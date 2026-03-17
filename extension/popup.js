document.addEventListener('DOMContentLoaded', () => {
  const adToggle = document.getElementById('blockAds');
  const shortsToggle = document.getElementById('blockShorts');
  const refreshBtn = document.getElementById('refreshBtn');

  // Load saved states
  chrome.storage.local.get(['blockAds', 'blockShorts'], (result) => {
    // If undefined, defaults to true (from checked state in HTML)
    if (result.blockAds !== undefined) {
      adToggle.checked = result.blockAds;
    }
    if (result.blockShorts !== undefined) {
      shortsToggle.checked = result.blockShorts;
    }
  });

  // Save states on change
  adToggle.addEventListener('change', () => {
    chrome.storage.local.set({ blockAds: adToggle.checked });
  });

  shortsToggle.addEventListener('change', () => {
    chrome.storage.local.set({ blockShorts: shortsToggle.checked });
  });

  // Reload current tab
  refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url.includes("youtube.com")) {
        chrome.tabs.reload(tabs[0].id);
        // Optional: close popup
        window.close();
      } else {
        refreshBtn.textContent = "Open YouTube to Reload";
        setTimeout(() => refreshBtn.textContent = "Reload Page to Apply", 2000);
      }
    });
  });
});
