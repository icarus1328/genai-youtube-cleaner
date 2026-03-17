// Default settings
let config = {
  blockShorts: true
};

chrome.storage.local.get(['blockShorts'], (result) => {
  if (result.blockShorts !== undefined) {
    config.blockShorts = result.blockShorts;
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockShorts) {
    config.blockShorts = changes.blockShorts.newValue;
  }
});

// Redirect Shorts to regular watch URL if enabled
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  if (details.frameId !== 0) return; // Only top-level navigations
  if (!config.blockShorts) return;

  const url = new URL(details.url);
  if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/shorts/")) {
    // Extract video ID from path /shorts/xyz
    const pathSegments = url.pathname.split('/');
    const videoId = pathSegments[2];
    
    if (videoId) {
      const redirectUrl = `https://www.youtube.com/watch?v=${videoId}`;
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    } else {
       // fallback to home
      chrome.tabs.update(details.tabId, { url: "https://www.youtube.com/" });
    }
  }
}, { url: [{ hostContains: "youtube.com" }] });
