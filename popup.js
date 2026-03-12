document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  chrome.storage.sync.get({ autoTempEnabled: true }, (data) => {
    if (chrome.runtime.lastError) {
      console.error("Gemini Auto Temp: failed to load settings:", chrome.runtime.lastError);
      return;
    }
    toggleSwitch.checked = data.autoTempEnabled;
  });

  toggleSwitch.addEventListener('change', () => {
    chrome.storage.sync.set({ autoTempEnabled: toggleSwitch.checked }, () => {
      if (chrome.runtime.lastError) {
        console.error("Gemini Auto Temp: failed to save settings:", chrome.runtime.lastError);
      }
    });
  });
});