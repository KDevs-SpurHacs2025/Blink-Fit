console.log("background.js loaded");

let latestBlinkCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BLINK_DETECTED') {
    latestBlinkCount = message.blinkCount;
    sendBlinkCountToBackend(latestBlinkCount);
  }
});

const BACKEND_URL = 'http://127.0.0.1:8000';

async function sendBlinkCountToBackend(blinkCount) {
  try {
    const response = await fetch(`${BACKEND_URL}/blink-count`, {
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

setInterval(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/signal`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.signal) {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
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