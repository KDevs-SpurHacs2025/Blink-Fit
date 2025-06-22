console.log("background.js loaded");

let latestBlinkCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BLINK_DETECTED') {
    const userId = message.userId || 'defaultUser';
    latestBlinkCount = message.blinkCount;
    sendBlinkCountToBackend(userId, latestBlinkCount);
  }
});

const BACKEND_URL = 'https://api-lcq5pbmy4q-pd.a.run.app';

async function sendBlinkCountToBackend(userId, blinkCount) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blink-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blinkCount }),
    });
    if (response.ok) {
      console.log('Blink count sent to backend:', { userId, blinkCount });
    } else {
      console.error('Failed to send blink count to backend:', response.status);
    }
  } catch (err) {
    console.error('Error sending blink count to backend:', err);
  }
}

setInterval(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/`);
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
