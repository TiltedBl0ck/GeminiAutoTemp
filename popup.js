document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  // Load the current state from Chrome storage (default is ON)
  chrome.storage.sync.get({ autoTempEnabled: true }, (data) => {
    toggleSwitch.checked = data.autoTempEnabled;
  });

  // Save the state when the user clicks the toggle
  toggleSwitch.addEventListener('change', () => {
    chrome.storage.sync.set({ autoTempEnabled: toggleSwitch.checked });
  });
});