import {
  FilesetResolver,
  FaceLandmarker,
  DrawingUtils,
} from "./task-vision/vision_bundle.mjs";

const videoElement = document.getElementById("videoElement");
const canvasElement = document.getElementById("canvasElement");
const canvasCtx = canvasElement.getContext("2d");
const blinkCountDisplay = document.getElementById("blink-count-display");
const statusMessageDisplay = document.getElementById("status-message");

let faceLandmarker;
let blinkCount = 0;
let prevEyeClosed = false;
let animationFrameId = null;

function updateStatus(message) {
  statusMessageDisplay.textContent = `Status: ${message}`;
}

async function initializeFaceLandmarker() {
  updateStatus("Loading AI model...");
  try {
    const wasmPath = "./task-vision/wasm";
    const vision = await FilesetResolver.forVisionTasks(wasmPath);

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "./task-vision/face_landmarker.task",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });
    updateStatus("Model loaded. Starting camera...");
  } catch (e) {
    console.error("Error initializing FaceLandmarker:", e);
    updateStatus(`Error loading model: ${e.message || "Unknown error"}.`);
    throw e;
  }
}

async function startCameraStream() {
  updateStatus("Requesting camera access...");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = async () => {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      await initializeFaceLandmarker();
      await videoElement.play();
      updateStatus("Camera started. Tracking blinks...");
      processFrame();
    };
  } catch (err) {
    let errorMsg = "Failed to access camera. Please allow permission.";
    if (err && err.name === "NotAllowedError") {
      errorMsg = "Camera access blocked. Please check browser settings.";
    } else if (err && err.name === "NotFoundError") {
      errorMsg = "No camera device found.";
    } else if (err && err.message) {
      errorMsg = `Camera error: ${err.message}`;
    } else if (err && err.type) {
      errorMsg = `Camera error: ${err.type}`;
    }
    console.error(errorMsg, err);
    updateStatus(`Camera Error: ${errorMsg}`);
  }
}

function calcEAR(landmarks, eyeIndices) {
  const p1 = landmarks[eyeIndices[0]];
  const p2 = landmarks[eyeIndices[1]];
  const p3 = landmarks[eyeIndices[2]];
  const p4 = landmarks[eyeIndices[3]];
  const p5 = landmarks[eyeIndices[4]];
  const p6 = landmarks[eyeIndices[5]];
  const distance = (a, b) =>
    Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  const A = distance(p3, p6);
  const B = distance(p4, p5);
  const C = distance(p1, p2);
  return (A + B) / (2 * C);
}

function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
    const landmarks = results.faceLandmarks[0];
    const leftEAR = calcEAR(landmarks, [362, 263, 386, 374, 380, 381]);
    const rightEAR = calcEAR(landmarks, [133, 33, 159, 145, 153, 144]);
    const avgEAR = (leftEAR + rightEAR) / 2;
    const EYE_AR_THRESH = 0.25;
    const currentEyeClosed = avgEAR < EYE_AR_THRESH;

    if (currentEyeClosed && !prevEyeClosed) {
      blinkCount++;
      blinkCountDisplay.textContent = `Blinks: ${blinkCount}`;
      // 눈 깜빡임 감지 시 background.js로 메시지 전송
      if (window.chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "BLINK_DETECTED",
          blinkCount: blinkCount,
        });
        // React(ScreenTime.jsx)로도 실시간 blinkCount 전달
        chrome.runtime.sendMessage({
          type: "BLINK_COUNT_UPDATE",
          blinkCount: blinkCount,
        });
      }
    }
    prevEyeClosed = currentEyeClosed;

    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_OVAL, {
      color: "#E0E0E0",
    });
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.LEFT_EYE, {
      color: "#FF3030",
    });
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.RIGHT_EYE, {
      color: "#30FF30",
    });
  }
}

async function processFrame() {
  if (videoElement.readyState < 2) {
    animationFrameId = requestAnimationFrame(processFrame);
    return;
  }

  if (faceLandmarker) {
    const results = await faceLandmarker.detectForVideo(
      videoElement,
      performance.now()
    );
    onResults(results);
  }
  animationFrameId = requestAnimationFrame(processFrame);
}

document.addEventListener("DOMContentLoaded", startCameraStream);

window.addEventListener("beforeunload", () => {
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});

// background.js에서 blinkCount 초기화 신호 수신
if (window.chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RESET_BLINK_COUNT") {
      blinkCount = 0;
      blinkCountDisplay.textContent = `Blinks: 0`;
    }
  });
}
