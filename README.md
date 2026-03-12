Gemini Auto Temp Chat

A straightforward Chrome extension that automatically enables "Temporary Chat" whenever you visit Google Gemini.

I set this up to save the hassle of manually hitting the temporary chat toggle every single time I start a new conversation. It just runs quietly in the background and handles the click for you!

Features

Auto-Enables Temporary Chat: The extension scans the page for the Temporary chat button and automatically clicks it for you.

Easy On/Off Toggle: Comes with a clean, simple popup menu. If you ever want to write a normal chat that saves to your history, just click the extension icon and toggle it off.

Smart Navigation: Because Gemini loads pages dynamically without refreshing, this extension uses a background observer to detect when you start a new chat or change URLs, making sure the temp chat stays enabled.

How to Install (Developer Mode)

Since this isn't on the Chrome Web Store, you can load it directly into your browser in just a few steps:

Download all the files (manifest.json, content.js, etc.) and put them in a single folder on your computer.

Open Chrome and go to your extensions page by typing chrome://extensions/ in the URL bar.

Turn on Developer mode (the switch in the top right corner).

Click the Load unpacked button in the top left.

Select the folder where you saved the files.

Done! I recommend pinning the extension to your toolbar so you can access the toggle easily.

How it Works

content.js: The main script that runs on gemini.google.com. It checks your saved preference and clicks the button for you.

popup.js & popup.html: The UI for the extension. It uses Chrome's storage API to remember whether you want the auto-clicker enabled or disabled.

manifest.json: Standard Manifest V3 file that ties it all together and requests the storage permission.