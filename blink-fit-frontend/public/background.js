console.log("background.js loaded");

let latestBlinkCount = 0;

function getUserIdFromChromeStoragePromise() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['user'], (result) => {
      if (result.user && result.user.id) {
        resolve(result.user.id);
      } else {
        resolve('defaultUser');
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BLINK_DETECTED') {
    getUserIdFromChromeStoragePromise().then((userId) => {
      latestBlinkCount = message.blinkCount;
      // userId를 필요시 사용 가능
    });
  }
});

const BACKEND_URL = 'https://api-lcq5pbmy4q-pd.a.run.app';

async function sendBlinkCountToBackend(userId, blinkCount) {
  try {
    const response = await fetch(`${BACKEND_URL}/blink-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blinkCount, "sessionDuration":60 }),
    });
    if (response.ok) {
      console.log("Successfully sent blink count to backend!");
      console.log('Blink count sent to backend:', { userId, blinkCount });
    } else {
      const errorText = await response.text();
      console.error('Failed to send blink count to backend:', response.status, response.statusText, errorText);
    }
  } catch (err) {
    console.error('Error sending blink count to backend:', err);
  }
}

setInterval(async () => {
  const userId = await getUserIdFromChromeStoragePromise();
  if (!userId) return;
  if (latestBlinkCount > 0) {
    await sendBlinkCountToBackend(userId, latestBlinkCount);
    latestBlinkCount = 0; // 전송 후 0으로 초기화
    // tracker.js에 blinkCount 초기화 신호 전송
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: 'RESET_BLINK_COUNT' });
      });
    });
  }
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
}, 30000); // 1분 주기로 변경
