// content.js — using verified Gemini DOM selectors

// Real sidebar toggle selectors (sourced from live Gemini scripts)
const SIDEBAR_OPEN_SELECTORS = [
  '[aria-label*="Show side panel"]',
  '[data-test-id="menu-toggle-button"]',
  '[aria-label*="Main menu"]',
  '[data-mat-icon-name="menu"]',
];

const TEMP_CHAT_SELECTORS = [
  '[aria-label*="Temporary chat"]',
  '[aria-label*="temporary chat"]',
  '[data-test-id*="temporary"]',
  'a[href*="temporary"]',
];

function findEl(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

// Text-content fallback: scans buttons/links for "temporary chat" text
function findByText(text) {
  const candidates = document.querySelectorAll('a, button, [role="menuitem"], [role="option"]');
  for (const el of candidates) {
    if (el.textContent.trim().toLowerCase().includes(text.toLowerCase())) return el;
  }
  return null;
}

function isSidebarOpen() {
  // Sidebar is open when the "Hide side panel" button is present
  return !!document.querySelector('[aria-label*="Hide side panel"]');
}

function clickTempButton() {
  const btn = findEl(TEMP_CHAT_SELECTORS) || findByText('Temporary chat');
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

    // Strategy 1: button already visible
    if (clickTempButton()) return;

    // Strategy 2: sidebar is closed — open it first, then retry
    if (!isSidebarOpen()) {
      const sidebarBtn = findEl(SIDEBAR_OPEN_SELECTORS);
      if (sidebarBtn) {
        sidebarBtn.click();
        setTimeout(() => {
          if (!clickTempButton()) {
            if (retries < 10) setTimeout(() => enableTempChat(retries + 1), 1000);
            else console.warn("Gemini Auto Temp: gave up after 10 retries.");
          }
        }, 800); // give sidebar 800ms to render
        return;
      }
    }

    // Strategy 3: sidebar already open but button not found yet — keep retrying
    if (retries < 10) {
      setTimeout(() => enableTempChat(retries + 1), 1000);
    } else {
      console.warn("Gemini Auto Temp: button not found after 10 retries.");
    }
  });
}

// SPA navigation observer
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
