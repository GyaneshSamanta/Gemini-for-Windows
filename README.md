# Gemini-for-Windows Desktop

<p align="center">
  <img src="Assets/App logo.png" alt="Gemini-for-Windows Logo" width="128" height="128">
</p>

<p align="center">
  <strong>A native Windows desktop app for Google Gemini</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-for-developers">For Developers</a>
</p>

<p align="center">
  <a href="https://github.com/GyaneshSamanta/Gemini-for-Windows/releases">
    <img src="https://img.shields.io/github/v/tag/GyaneshSamanta/Gemini-for-Windows?style=for-the-badge&color=D43F9B&label=latest%20release" alt="Latest Release">
  </a>
  <a href="https://github.com/GyaneshSamanta/Gemini-for-Windows/releases">
    <img src="https://img.shields.io/github/downloads/GyaneshSamanta/Gemini-for-Windows/total?style=for-the-badge&logo=github&color=43216E" alt="GitHub downloads">
  </a>
  <a href="https://buymeachai.ezee.li/GyaneshOnProduct">
    <img src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png" alt="Buy Me A Chai" height="28">
  </a>
</p>

---

## 🚀 Quick Start

### Download & Run (No Installation Required!)

1. **Download** the latest release from the [**Releases Page**](https://github.com/GyaneshSamanta/Gemini-for-Windows/releases).
2. **Extract** the ZIP file to any folder.
3. **Run** `gemini-on-windows.exe` inside the extracted folder.

That's it! No installation, no setup wizards. Just run and enjoy.

> **Tip:** Pin `gemini-on-windows.exe` to your taskbar for quick access!

---

## ✨ Key Features

This application transforms the Gemini web experience into a powerful, deeply integrated Windows utility:

- 🪟 **Multi-View Modes:** Why settle for one chat? Use the layout selector to work with Dual (2) or Quad (4) Gemini sessions simultaneously side-by-side in the same window, seamlessly sharing your login session.
- 📐 **Resizable Grids:** Instantly resize any of the Dual and Quad layout panels by dynamically dragging the borders!
- ⚡ **Global Shortcut (Ctrl+Alt+G):** Found something interesting? Just press `Ctrl+Alt+G`, and Gemini will immediately jump to the foreground to answer your query.
- 🖼️ **Frameless Custom UI:** Enjoy a sleek frameless window design with a custom title bar, beautiful gradients, and a glowing custom footer.
- ⚙️ **Persistent Settings:** Keep the app minimized in the System Tray, configure it to run on Startup automatically, and pin it Always On Top over other windows!

---

## ✨ Full Feature List

| Feature | Description |
|---------|-------------|
| 🪟 **Multi-View** | Work on up to 4 different Gemini chats simultaneously |
| 📐 **Draggable Panels** | Drag the borders in Multi-View to resize your workflow |
| ⚡ **Global Summon** | Hit `Ctrl+Alt+G` to Instantly summon the window anywhere |
| 🖥️ **Native App** | Dedicated, frameless desktop app with custom window controls |
| 🔐 **Persistent Login**| Stay signed in across sessions using secure AppData storage |
| 📌 **Always on Top** | Pin the window above other applications |
| 📥 **System Tray** | Minimize to tray to keep the app working quietly in the background |
| 🚀 **Auto-Launch** | Configure the app to start when Windows boots |
| ☕ **Support Me** | Support further development with **10 rs** via [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct) |

---

## 💻 For Developers

### Project Structure

```
Gemini-for-Windows/
├── Assets/App logo.png      # App icon
├── main.js                  # Electron main process
├── preload.js               # Secure IPC bridge
├── renderer/                # UI frontend
│   ├── renderer.js          # Layout tracking and Webview manipulation
│   ├── styles.css           # Styling
│   └── index.html           # App container
├── package.json             # Dependencies & build scripts
└── README.md
```

### Tech Stack

- **[Electron](https://www.electronjs.org/)** - Windows application and `<webview>` framework.
- **Vanilla JS/HTML/CSS** - Lightweight and lightning fast, without bloat.

### Build from Source

```bash
# Clone the repository
git clone https://github.com/GyaneshSamanta/Gemini-for-Windows.git
cd Gemini-for-Windows

# Install dependencies
npm install

# Run in development mode
npm start

# Build portable app into /release folder
npm run build
```

The built app will be in `release/gemini-on-windows.exe`.

### Creating a GitHub Release

1. Run `npm run build`
2. Compress the `release/gemini-on-windows.exe` file inside a ZIP
3. Go to repo → **Releases** → **Draft a new release**
4. Create tag (e.g., `v1.0.0`), upload ZIP, publish!

---

## 📜 License

GPL-3.0 License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ♥ by <a href="https://www.linkedin.com/in/gyanesh-samanta/">Gyanesh Samanta</a>
</p>

<p align="center">
  <a href="https://buymeachai.ezee.li/GyaneshOnProduct">
    <img src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png" alt="Buy Me A Chai" width="200">
  </a>
</p>

<p align="center">
  <em>Supporters can contribute as little as 10 rs! ☕</em>
</p>
