const TEMP_CHAT_SELECTOR = '[aria-label*="Temporary chat"], [data-test-id*="temporary"], a[href*="temporary"]';
const MENU_SELECTORS = [
  '[aria-label="Main menu"]',
  '[aria-label="Open navigation"]',
  '[aria-label="Close navigation"]',
  'button[aria-label*="menu" i]',
  'button.hamburger',
  'mat-icon[data-mat-icon-name="menu"]',
];

function findMenuButton() {
  for (const sel of MENU_SELECTORS) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function clickTempButton() {
  const btn = document.querySelector(TEMP_CHAT_SELECTOR);
  if (btn) {
    btn.click();
    console.log("Gemini Auto Temp: enabled.");
    return true;
  }
  return false;
}

function enableTempChat(retries = 0) {
  chrome.storage.sync.get({ autoTempEnabled: true }, (data) => {
    if (chrome.runtime.lastError) {
      console.error("Gemini Auto Temp: storage error:", chrome.runtime.lastError);
      return;
    }
    if (!data.autoTempEnabled) return;

    if (clickTempButton()) return;

    const menuBtn = findMenuButton();
    if (menuBtn) {
      menuBtn.click();
      setTimeout(() => {
        if (!clickTempButton()) {
          menuBtn.click();
          if (retries < 10) setTimeout(() => enableTempChat(retries + 1), 1000);
          else console.warn("Gemini Auto Temp: gave up after 10 retries.");
        }
      }, 600);
      return;
    }

    if (retries < 10) {
      setTimeout(() => enableTempChat(retries + 1), 1000);
    } else {
      console.warn("Gemini Auto Temp: button not found after 10 retries.");
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