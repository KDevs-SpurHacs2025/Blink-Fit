console.log("background.js loaded");

let latestBlinkCount = 0;

// Listener for messages from content scripts (e.g., BLINK_DETECTED)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BLINK_DETECTED') {
    latestBlinkCount = message.blinkCount;
    // Send blinkCount to the backend server
    sendBlinkCountToBackend(latestBlinkCount);
  }
});

// Backend URL definition
const BACKEND_URL = 'http://localhost:8000'; // Base URL for your backend

// Function to send blink count to the backend
async function sendBlinkCountToBackend(blinkCount) {
  try {
    const response = await fetch(`${BACKEND_URL}/blink-count`, { // Adjust endpoint as per your backend API
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blinkCount }),
    });
    if (response.ok) {
      console.log('Blink count sent to backend:', blinkCount);
    } else {
      console.error('Failed to send blink count to backend:', response.status);
    }
  } catch (err) {
    console.error('Error sending blink count to backend:', err);
  }
}

// Poll the backend every 10 seconds and send a signal to content scripts if available
setInterval(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/signal`); // Adjust endpoint as per your backend API
    if (response.ok) {
      const data = await response.json();
      if (data && data.signal) {
        // Send signal to all active tabs
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            // This message is sent to content scripts that are injected into web pages.
            // If your webcam demo runs as a popup, it will listen to this message directly
            // within its own script context.
            chrome.tabs.sendMessage(tab.id, { type: 'BACKEND_SIGNAL', signal: data.signal });
          });
        });
      }
    } else {
      console.error('Failed to fetch signal from backend:', response.status);
    }
  } catch (err) {
    console.error('Error fetching signal from backend:', err);
  }
}, 10000);