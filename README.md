<p align="center">
  <img src="logo.png" alt="YT Ad & Shorts Blocker Logo" width="128"/>
</p>

# YouTube Ad & Shorts Blocker

A lightweight browser extension (compatible with **Safari** and **Chrome**) designed to improve your YouTube experience by hiding ads and completely disabling the YouTube Shorts UI.

## Overview
- **Blocks Ad Elements:** Hides banner ads, overlay ads, sidebar ads, and uses DOM manipulation to automatically skip or fast-forward unskippable video ads.
- **Removes Shorts Elements:** Hides the Shorts sections on the homepage, channel pages, sidebar, subscriptions page, and search results.
- **Shorts Redirect:** Automatically redirects any `/shorts/` navigations to the standard video player format (`/watch?v=...`) or the homepage.

## File Structure
- `extension/`
  - `manifest.json`: Configuration, permissions (V3), and extension properties.
  - `content.js`: Main logic that injects CSS hides Shorts and Ads elements. It also features a MutationObserver for skipping video ads dynamically.
  - `background.js`: Handles background navigations and URL intercepts.
  - `popup.html`, `popup.css`, `popup.js`: The extension's settings menu accessible from the Safari toolbar.
  - `icons/`: Generated PNG icons for the extension.

## Installation (No Xcode Required)

Safari disables "Developer Folder" extensions every time the browser fully restarts. To bypass this so the extension runs permanently, you can install the pre-compiled **Mac Application** version of the blocker from this repository.

**Step 1. Download the App**
1. Go to the **Releases** section on the right side of this GitHub page.
2. Download the newest `YTBlocker.zip` file.
3. Once downloaded, double-click the `.zip` file to extract the `YTBlocker.app` application.
4. Drag `YTBlocker.app` into your Mac's **Applications** folder.

**Step 2. Bypass Apple Gatekeeper**
Because this app isn't distributed through the official Mac App Store, your Mac will flag it as an "unverified" internet download and won't let you double-click open it directly.
1. Open your Mac's **Terminal** app.
2. Paste the following command and press Enter:
   ```bash
   xattr -cr /Applications/YTBlocker.app
   ```
*(This simply tells your Mac to trust the application so "YTBlocker is damaged" warning doesn't appear).*

**Step 3. Enable in Safari**
1. Double-click `YTBlocker.app` in your Applications folder to run it. (A small window will open, you can immediately close it).
2. Open **Safari**.
3. Go to **Safari > Settings > Extensions**.
4. Check the box next to **YTBlocker** to activate it! Enjoy!

---

## Installation (Chrome)

The extension is a standard WebExtensions Manifest V3 extension and works directly in Chrome — no additional wrapping or compilation needed.

1. Open Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** ON (top-right corner).
3. Click **"Load unpacked"**.
4. Select the `extension/` folder from this repository.
5. The extension is now active — visit YouTube to confirm ads and Shorts are blocked.

> **Note:** In Chrome, the extension will remain active across browser restarts automatically. No Gatekeeper bypassing or Mac app required.

---

## Setup Instructions (For Developers)
If you are an Apple Developer and want to permanently wrap this into a compiled native macOS app yourself, this project supports Apple's native extension converter.
1. Install Xcode.
2. Run Apple's conversion tool:
   ```bash
   xcrun safari-web-extension-converter ./extension --project-name "YTBlocker"
   ```
3. Open the generated Xcode project and build it.

## Customization
To extend or change what elements are hidden, modify logic in `extension/content.js`. The CSS handles styling while JS is used to bypass video ads directly.
