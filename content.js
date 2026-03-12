// content.js - fixed version
let observerAttached = false;

function enableTempChat() {
  // Read toggle state first
  chrome.storage.sync.get({ autoTempEnabled: true }, (data) => {
    if (!data.autoTempEnabled) return;

    const tempButton = document.querySelector('[aria-label*="Temporary chat"]');
    if (tempButton) {
      tempButton.click();
      console.log("Gemini Auto Temp: enabled.");
    } else {
      // Retry only when button not found
      setTimeout(enableTempChat, 1000);
    }
  });
}

// Attach observer ONCE for SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(enableTempChat, 1000);
  }
}).observe(document, { subtree: true, childList: true });

enableTempChat(); // initial call
