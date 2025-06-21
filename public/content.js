// Import MediaPipe Tasks Vision and Drawing Utils from the local bundle.
// This assumes 'vision_bundle.mjs' is placed in the same directory as 'content.js'
// and is listed in 'web_accessible_resources' in manifest.json.
import * as visionModule from "./task-vision/vision_bundle.mjs";
import * as DrawingUtils from "./task-vision/vision_wasm/drawing_utils.js";
console.log("content.js loaded");

// Ensure the DOM is fully loaded before trying to access elements
window.onload = function() {
  (async () => {
    console.log("MediaPipe modules loaded");

    // Dynamically create and hide video/canvas elements if not present in DOM
    let videoElement = document.getElementById('videoElement');
    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.id = 'videoElement';
      videoElement.style.display = 'none';
      document.body.appendChild(videoElement);
    }
    let canvasElement = document.getElementById('canvasElement');
    if (!canvasElement) {
      canvasElement = document.createElement('canvas');
      canvasElement.id = 'canvasElement';
      canvasElement.style.display = 'none';
      document.body.appendChild(canvasElement);
    }
    const canvasCtx = canvasElement.getContext('2d');

    let faceLandmarker; // MediaPipe FaceLandmarker instance
    let blinkCount = 0; // Counter for eye blinks
    let prevEyeClosed = false; // Flag to track eye state (closed in previous frame)

    // Asynchronous function to initialize the FaceLandmarker model
    async function initializeFaceLandmarker() {
      try {
        console.log("Initializing FaceLandmarker...");
        // Use chrome.runtime.getURL to resolve the local WASM directory and model file
        const wasmPath = chrome.runtime.getURL("src/task-vision/vision_wasm"); // Directory containing WASM files
        const vision = await visionModule.FilesetResolver.forVisionTasks(wasmPath);

        faceLandmarker = await visionModule.FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: chrome.runtime.getURL("src/task-vision/face_landmarker.task")
          },
          runningMode: 'VIDEO', // Set to video processing mode
          numFaces: 1,          // Detect only one face
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false
        });
        console.log("FaceLandmarker initialized");
      } catch (e) {
        console.error("Error inside initializeFaceLandmarker:", e);
        throw e;
      }
    }

    // Check if the current environment supports camera access (HTTPS or Chrome Extension)
    if (location.protocol !== 'https:' && location.protocol !== 'chrome-extension:') {
      canvasCtx.font = '20px sans-serif';
      canvasCtx.fillStyle = 'red';
      canvasCtx.fillText('Camera access is only available in HTTPS or extension environment.', 10, 50);
      return; // Stop execution if environment is not secure
    }

    // Request camera access from the user
    console.log("Requesting camera access...");
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log("Camera stream connected");
        videoElement.srcObject = stream;
        // When video metadata is loaded, set up canvas and start processing
        videoElement.onloadedmetadata = async () => {
          try {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            await initializeFaceLandmarker(); // Initialize FaceLandmarker after video metadata is available
            videoElement.play(); // Start video playback
            processFrame(); // Begin processing video frames
          } catch (err) {
            // If err is an Event, print all properties for debugging
            if (err instanceof Event) {
              console.error("Error during FaceLandmarker initialization or video setup: Event", err, JSON.stringify(err, null, 2));
              for (const key in err) {
                if (Object.prototype.hasOwnProperty.call(err, key)) {
                  console.error(`Event property: ${key} =`, err[key]);
                }
              }
              canvasCtx.font = '20px sans-serif';
              canvasCtx.fillStyle = 'red';
              canvasCtx.fillText('Failed to initialize face detection (Event error).', 10, 50);
            } else {
              console.error("Error during FaceLandmarker initialization or video setup:", err);
              canvasCtx.font = '20px sans-serif';
              canvasCtx.fillStyle = 'red';
              canvasCtx.fillText('Failed to initialize face detection.', 10, 50);
            }
          }
        };
      })
      .catch((err) => {
        // Handle error safely: err may be an Event object, not always an Error
        let errorMsg = 'Please allow webcam access.';
        if (err && err.name === 'NotAllowedError') {
          errorMsg = 'Camera access was blocked. Please check your browser settings.';
        } else if (err && err.name === 'NotFoundError') {
          errorMsg = 'No camera device found.';
        } else if (err && err.message) {
          errorMsg = err.message;
        } else if (err && err.type) {
          errorMsg = `Camera error: ${err.type}`;
        }
        // Print error to console for debugging
        console.error("Camera stream connection failed", err);
        canvasCtx.font = '20px sans-serif';
        canvasCtx.fillStyle = 'red';
        canvasCtx.fillText(errorMsg, 10, 50);
      });

    // Main loop to process each video frame
    async function processFrame() {
      // Ensure FaceLandmarker is initialized and video data is ready
      if (faceLandmarker && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        const startTimeMs = performance.now();
        // Detect face landmarks for the current video frame
        const results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
        onResults(results); // Process the detection results
      }
      // Request the next animation frame for continuous processing
      requestAnimationFrame(processFrame);
    }

    // Calculates the Eye Aspect Ratio (EAR)
    // The EAR is a value that indicates the degree of eye opening.
    // Lower EAR means the eye is more closed.
    function calcEAR(landmarks, eyeIndices) {
      // Extract the 6 key eye landmarks based on provided indices
      const p1 = landmarks[eyeIndices[0]]; // Horizontal eye points
      const p2 = landmarks[eyeIndices[1]];
      const p3 = landmarks[eyeIndices[2]]; // Vertical eye points (upper eyelid)
      const p4 = landmarks[eyeIndices[3]];
      const p5 = landmarks[eyeIndices[4]]; // Vertical eye points (lower eyelid)
      const p6 = landmarks[eyeIndices[5]];

      // Helper function to calculate Euclidean distance between two points
      const distance = (point1, point2) => {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
      };

      // Calculate vertical distances
      const A = distance(p3, p6);
      const B = distance(p4, p5);
      // Calculate horizontal distance
      const C = distance(p1, p2);

      // Apply the EAR formula
      return (A + B) / (2 * C);
    }

    // Callback function to process FaceLandmarker results
    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // Draw the current video frame onto the canvas
      canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      // Check if face landmarks were detected
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0]; // Get landmarks for the first detected face

        // MediaPipe FaceLandmarker's specific landmark indices for eye EAR calculation.
        // These indices are approximate and should be verified against MediaPipe's official documentation for FaceLandmarker.
        // (https://developers.google.com/mediapipe/solutions/vision/face_landmarker#face_landmarks)
        const leftEyeOuterCorner = landmarks[362]; // User's left eye (screen's right)
        const leftEyeInnerCorner = landmarks[263];
        const leftEyeUpper1 = landmarks[386];
        const leftEyeUpper2 = landmarks[374];
        const leftEyeLower1 = landmarks[380];
        const leftEyeLower2 = landmarks[381];

        const rightEyeOuterCorner = landmarks[133]; // User's right eye (screen's left)
        const rightEyeInnerCorner = landmarks[33];
        const rightEyeUpper1 = landmarks[159];
        const rightEyeUpper2 = landmarks[145];
        const rightEyeLower1 = landmarks[153];
        const rightEyeLower2 = landmarks[144];

        // Calculate EAR for each eye
        const leftEAR = calcEAR([leftEyeOuterCorner, leftEyeInnerCorner, leftEyeUpper1, leftEyeUpper2, leftEyeLower1, leftEyeLower2], [0,1,2,3,4,5]);
        const rightEAR = calcEAR([rightEyeOuterCorner, rightEyeInnerCorner, rightEyeUpper1, rightEyeUpper2, rightEyeLower1, rightEyeLower2], [0,1,2,3,4,5]);
        
        const avgEAR = (leftEAR + rightEAR) / 2; // Average EAR of both eyes
        const EYE_AR_THRESH = 0.25; // Threshold to determine if an eye is closed (tune this value)

        const currentEyeClosed = avgEAR < EYE_AR_THRESH;

        // Blink detection logic: increment count when eye state changes from open to closed
        if (currentEyeClosed && !prevEyeClosed) {
          blinkCount++;
          prevEyeClosed = true;
          // Send the current blink count to the background script
          chrome.runtime.sendMessage({ type: 'BLINK_DETECTED', blinkCount });
        } else if (!currentEyeClosed && prevEyeClosed) {
          // Reset 'prevEyeClosed' when eyes open again
          prevEyeClosed = false;
        }

        // Draw facial landmarks and connectors on the canvas
        // Using DrawingUtils from local file and FaceLandmarker's predefined connection sets
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.FACE_OVAL, { color: '#E0E0E0' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.LEFT_EYE, { color: '#FF3030' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.RIGHT_EYE, { color: '#30FF30' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.LIPS, { color: '#3030FF' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.LEFT_EYEBROW, { color: '#FF3030' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.RIGHT_EYEBROW, { color: '#30FF30' });
        DrawingUtils.drawConnectors(canvasCtx, landmarks, visionModule.FaceLandmarker.FACE_TESSELATION, { color: '#C0C0C070', lineWidth: 0.5 });
      }

      // Display the current blink count on the canvas
      canvasCtx.font = '24px sans-serif';
      canvasCtx.fillStyle = 'red';
      canvasCtx.fillText(`Blinks: ${blinkCount}`, 10, 30);
      canvasCtx.restore(); // Restore canvas state
    }

    // Listen for messages from the background script (e.g., backend signals)
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'BACKEND_SIGNAL') {
        console.log('Received signal from background:', message.signal);
        // Add logic here to react to backend signals (e.g., update UI)
      }
    });
  })();
};