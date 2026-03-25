// State
let config = {
  blockAds: true,
  blockShorts: true
};

// Load preferences from storage
console.log("[YT Blocker] Extension starting up on", window.location.href);

chrome.storage.local.get(['blockAds', 'blockShorts'], (result) => {
  if (result.blockAds !== undefined) config.blockAds = result.blockAds;
  if (result.blockShorts !== undefined) config.blockShorts = result.blockShorts;

  // Initialize
  if (config.blockAds || config.blockShorts) {
    applyStyles();
    initObserver();
    // Run cleanup immediately in case the DOM is already parsed
    cleanup();
  }
});

// Watch for config changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockAds) config.blockAds = changes.blockAds.newValue;
  if (changes.blockShorts) config.blockShorts = changes.blockShorts.newValue;
  
  if (!config.blockAds && !config.blockShorts) {
    // If both are disabled, we might need a reload as CSS is injected
    // For now, removing styles works best.
    const styleEl = document.getElementById('yt-blocker-styles');
    if (styleEl) styleEl.remove();
  } else {
    applyStyles();
    cleanup();
  }
});

function applyStyles() {
  let css = '';

  // Shorts blocking CSS
  if (config.blockShorts) {
    css += `
      /* Hide Shorts from left sidebar */
      ytd-guide-entry-renderer a[title="Shorts"],
      ytd-mini-guide-entry-renderer[aria-label="Shorts"],
      /* Hide Shorts shelf on homepage */
      ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
      ytd-rich-shelf-renderer[is-shorts],
      ytd-rich-section-renderer:has(a[href^="/shorts/"]),
      ytd-rich-shelf-renderer:has(a[href^="/shorts/"]),
      /* Hide Shorts in search results */
      ytd-reel-shelf-renderer,
      ytd-reel-item-renderer,
      /* Hide Shorts from subscriptions */
      ytd-grid-video-renderer a[href^="/shorts/"],
      ytd-rich-item-renderer:has(a[href^="/shorts/"]),
      ytd-video-renderer:has(a[href^="/shorts/"]),
      ytd-compact-video-renderer:has(a[href^="/shorts/"]),
      /* Fallback for other shorts sections */
      [is-shorts],
      a[href^="/shorts/"] {
        display: none !important;
      }
    `;
  }

  // Ad blocking CSS
  if (config.blockAds) {
    css += `
      /* Video ads */
      .ad-showing .html5-video-player,
      ytd-promoted-sparkles-web-renderer,
      ytd-display-ad-renderer,
      ytd-ad-slot-renderer,
      ytd-in-feed-ad-layout-renderer,
      /* Banner ads */
      #masthead-ad,
      ytd-banner-promo-renderer,
      .ytd-video-masthead-ad-v3-renderer,
      .ytd-promoted-sparkles-text-search-renderer,
      /* Sidebar ads */
      #player-ads,
      ytd-player-legacy-desktop-watch-ads-renderer,
      /* Overlays */
      .ytp-ad-overlay-container,
      .ytp-ad-message-container,
      .ytp-ad-player-overlay {
        display: none !important;
      }
    `;
  }

  let styleEl = document.getElementById('yt-blocker-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'yt-blocker-styles';
    try {
      if (document.head || document.documentElement) {
        (document.head || document.documentElement).appendChild(styleEl);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          (document.head || document.documentElement).appendChild(styleEl);
        });
      }
    } catch (e) {
      console.error("[YT Blocker] Error appending styles:", e);
    }
  }
  styleEl.textContent = css;
}

// Additional DOM manipulation for things CSS can't easily catch
function cleanup() {
  try {
    if (config.blockAds) {
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
      if (skipButton) skipButton.click();
      
      const videoAds = document.querySelectorAll('.ad-showing video');
      videoAds.forEach(video => {
        if (video && !isNaN(video.duration)) {
          video.muted = true;
          video.currentTime = video.duration;
        }
      });

      const closeButtons = document.querySelectorAll('.ytp-ad-overlay-close-button');
      closeButtons.forEach(btn => btn.click());
    }

    if (config.blockShorts) {
      const shortsIcons = document.querySelectorAll('ytd-rich-shelf-renderer yt-icon path[d^="M17.77,10.32"], ytd-rich-section-renderer yt-icon path[d^="M17.77,10.32"]');
      shortsIcons.forEach(icon => {
        const shelf = icon.closest('ytd-rich-shelf-renderer') || icon.closest('ytd-rich-section-renderer');
        if (shelf && shelf.style.display !== 'none') shelf.style.display = 'none';
      });

      const titles = document.querySelectorAll('.yt-tab-shape-wizard-tab__title, yt-formatted-string.title, span.yt-core-attributed-string');
      titles.forEach(title => {
        if (title.textContent && title.textContent.trim().toLowerCase() === 'shorts') {
          const tab = title.closest('tp-yt-paper-tab') || title.closest('ytd-guide-entry-renderer') || title.closest('ytd-mini-guide-entry-renderer');
          if (tab && tab.style.display !== 'none') tab.style.display = 'none';
          const shelfTitle = title.closest('ytd-rich-section-renderer') || title.closest('ytd-rich-shelf-renderer');
          if (shelfTitle && shelfTitle.style.display !== 'none') shelfTitle.style.display = 'none';
        }
      });

      const spanTitles = document.querySelectorAll('#title-text');
      spanTitles.forEach(span => {
        if (span.textContent && span.textContent.trim().toLowerCase() === 'shorts') {
          const section = span.closest('ytd-rich-section-renderer') || span.closest('ytd-rich-shelf-renderer');
          if (section && section.style.display !== 'none') section.style.display = 'none';
        }
      });
    }
  } catch (err) {
    console.error("[YT Blocker] Cleanup error:", err);
  }
}

// Observe dynamically added nodes
function initObserver() {
  let timeout = null;
  const observer = new MutationObserver((mutations) => {
    // Throttle cleanup check
    if (!timeout) {
      timeout = setTimeout(() => {
        cleanup();
        timeout = null;
      }, 50);
    }
  });

  // Start observing once body is available
  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      setTimeout(startObserving, 100);
    }
  };
  
  startObserving();
}

// Periodic cleanup as fallback
setInterval(() => {
  if (config.blockAds || config.blockShorts) {
    cleanup();
  }
}, 1000);
