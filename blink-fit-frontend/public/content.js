console.log("content.js loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BACKEND_SIGNAL') {
    console.log('Content script received signal from background:', message.signal);
  }
});