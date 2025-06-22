console.log("content.js loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BACKEND_SIGNAL') {
    console.log('Content script received signal from background:', message.signal);
  }
});

// user 정보를 chrome.storage.local에도 저장
(function syncUserToChromeStorage() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      chrome.storage.local.set({ user });
      console.log('user info synced to chrome.storage.local:', user);
    }
  } catch (e) {
    console.warn('Failed to sync user info to chrome.storage.local:', e);
  }
})();

setInterval(syncUserToChromeStorage, 30000);