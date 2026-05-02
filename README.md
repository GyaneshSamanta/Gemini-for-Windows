# Gemini for Windows

> **A native, frameless Windows desktop app for Google Gemini — with multi-pane chats, a global hotkey, and zero install friction.**

<p align="center">
  <img src="Assets/App logo.png" alt="Gemini for Windows logo" width="128" height="128">
</p>

![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![Windows](https://img.shields.io/badge/Windows-0078D4?logo=windows&logoColor=white)
![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue)

[Download latest release](https://github.com/GyaneshSamanta/Gemini-for-Windows/releases) · [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct)

## About

- **What:** A standalone Windows desktop app that wraps Google Gemini in a native shell — frameless window, system tray, global hotkey, and side-by-side multi-chat panes.
- **Who:** Designed and built solo by Gyanesh Samanta.
- **When:** Shipped March 8, 2026.
- **Where:** Personal product project, distributed as a portable `.exe` via GitHub Releases.
- **Why:** Gemini-in-a-browser-tab is fine until you actually rely on it. You lose tab-stack focus, can't summon it with a keystroke, and can't easily run two parallel chats. This app fixes all three by treating Gemini as a first-class desktop tool.

## The Story

I kept finding myself doing the same little dance: Cmd-Tab to the browser, Cmd-Tab through twelve tabs to find the Gemini one, type, get pulled away, lose the tab again. The fix wasn't more discipline — it was a real desktop app.

Gemini for Windows is an Electron shell over Google's web app, but with the affordances a desktop user actually wants. **`Ctrl+Alt+G` summons it from anywhere**, even mid-document — Gemini snaps to the foreground, ready to answer. **Multi-view layouts** let you run two or four Gemini sessions side by side in the same window, each sharing your login session, with draggable borders so you can size each pane to the conversation. **Persistent settings** keep the window always-on-top if you want, dock it to the system tray, and auto-launch on Windows boot.

The app is portable: download the zip, extract, run. No installer, no admin rights, no telemetry middlemen. Pin the `.exe` to your taskbar and you're done.

## Gallery

<p align="center">
  <img src="Assets/App logo.png" width="200" alt="App icon" />
</p>

---

## Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/) `^40.8.0`
- **Builder:** `electron-builder` (portable Windows target)
- **Persistence:** `electron-store` (settings) + secure AppData session storage
- **Auto-update:** `electron-updater`
- **Frontend:** Vanilla HTML / CSS / JS — no framework bloat

## Repo Structure

```
Gemini-for-Windows/
├── main.js              # Electron main process (window, tray, shortcuts)
├── preload.js           # Secure IPC bridge
├── renderer/
│   ├── index.html       # App container with <webview> hosts
│   ├── renderer.js      # Layout + webview manipulation
│   └── styles.css       # Frameless UI
├── Assets/
│   └── App logo.png
├── PRD/                 # Product requirements docs
├── package.json         # Electron + builder config
└── release/             # Build output (portable .exe)
```

## Getting Started

### Users — Quick start

1. Grab the latest zip from the [Releases page](https://github.com/GyaneshSamanta/Gemini-for-Windows/releases).
2. Extract anywhere.
3. Run `gemini-on-windows.exe`.

That's it — no installer. Pin to your taskbar for one-click access, or hit `Ctrl+Alt+G` from any app to summon it.

### Developers — Build from source

```bash
git clone https://github.com/GyaneshSamanta/Gemini-for-Windows.git
cd Gemini-for-Windows
npm install

npm start        # Run in dev
npm run build    # Build portable .exe into ./release
```

Output lands at `release/gemini-on-windows.exe`.

## Contributing

Issues and PRs welcome. Most-wanted next: configurable global shortcut, dark-mode title bar, more layout presets.

## License

[GPL-3.0](LICENSE).

## Credits

Built by [Gyanesh Samanta](https://www.linkedin.com/in/gyanesh-samanta/). If the app earns its keep, the [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct) jar funds future updates and signing certificates.
