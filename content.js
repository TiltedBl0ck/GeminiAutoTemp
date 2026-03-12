function enableTempChat(retries = 0) {
  chrome.storage.sync.get({ autoTempEnabled: true }, (data) => {
    if (chrome.runtime.lastError) {
      console.error("Gemini Auto Temp: storage error:", chrome.runtime.lastError);
      return;
    }
    if (!data.autoTempEnabled) return;

    const tempButton = document.querySelector('[aria-label*="Temporary chat"]');
    if (tempButton) {
      tempButton.click();
      console.log("Gemini Auto Temp: enabled.");
    } else if (retries < 10) {
      setTimeout(() => enableTempChat(retries + 1), 1000);
    } else {
      console.warn("Gemini Auto Temp: button not found after 10 retries. Giving up.");
    }
  });
}

let lastUrl = location.href;
let debounceTimer;

new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => enableTempChat(), 1000);
  }
}).observe(document.body, { subtree: true, childList: true });

enableTempChat();