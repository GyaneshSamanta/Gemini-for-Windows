# Product Requirements Document (PRD): gemini-on-windows

## 1. Product Overview
**Product Name:** gemini-on-windows
**Description:** A production-grade Windows desktop application built as an Electron wrapper that encapsulates the Google Gemini web interface (`https://gemini.google.com/`).
**Objective:** To provide a seamless, persistent, and highly accessible desktop experience for Gemini. It must function flawlessly as a background utility, handle edge cases gracefully, and be distributed as a standalone, portable `.exe` file.

## 2. Platform and Implementation

### 2.1. Technology Stack
* **Framework:** Electron.
* **Architecture:** Utilizes a custom frameless browser window with integrated webview/BrowserView components to render the Gemini interface.

### 2.2. Persistent Login
* **Functionality:** The application must maintain session state and cookies across all restarts. Users should only need to sign in with their Google account once.
* **Storage:** Authentication data must be securely stored within the application's user data directory (`AppData/Roaming/gemini-on-windows`) and must not clear upon exit.

### 2.3. Portable Executable & Updates
* **Requirement:** The final build output must be a single, portable executable file (`.exe`). 
* **Auto-Updater Readiness:** The architecture must be built with `electron-updater` in mind to support future over-the-air updates.

### 2.4. Build Environment Isolation
* **Requirement:** The entire development, dependency installation (`npm install`), and build process executed by the agent MUST occur within a strictly isolated local environment.
* **Conflict Prevention:** The agent must NOT install any packages globally (`-g`). All Node dependencies must be confined to this project's local `node_modules` directory to prevent cache poisoning or conflicts with other local Electron builds.

### 2.5. Security Hardening
* **Context Isolation:** All webviews must run with `contextIsolation: true` and `nodeIntegration: false`.
* **Navigation Lockdown:** The Electron main process must intercept all `will-navigate` and `setWindowOpenHandler` events. Only URLs matching `*.google.com` or authentication flows should load internally; everything else must be pushed to the OS default browser.

## 3. Core Functional Requirements

### 3.1. Main Window
* **Functionality:** Render the full Gemini web interface within a custom Electron window.
* **Title Bar:** Custom themed title bar (see Section 5.3).

### 3.2. Multi-View Mode (Single, Dual, Quad)
* **Functionality:** Provide a UI control in the title bar to switch between different viewing layouts.
* **Layout Options:**
    * **Single View:** 1 full-screen webview instance.
    * **Dual View (Split):** 2 independent webview instances, splitting the window 50/50 vertically.
    * **Quad View:** 4 independent webview instances arranged in a 2x2 grid.
* **Implementation:** All active webviews must share the same session cookie store, ensuring the user remains authenticated across all panes simultaneously.

## 4. Extended OS Integration & Usability

### 4.1. Global Keyboard Shortcut (Quick Summon)
* **Functionality:** Register a system-wide global shortcut (`Ctrl + Alt + G`).
* **Action:** Instantly brings the application window to the foreground and sets focus. Restores the app if minimized to the tray.
* **Customization:** A settings option must allow the user to change or disable this shortcut.

### 4.2. Minimize to System Tray
* **Functionality:** Provide an option to minimize to the Windows system tray rather than the taskbar.
* **System Tray Icon:** Add an icon with a right-click context menu containing: `Open`, `Always on Top`, `Launch on Startup`, `Settings`, and `Exit`.

### 4.3. Always on Top & Run on Startup
* **Always on Top:** A push-pin icon in the title bar to pin the app above other windows.
* **Run on Startup:** A settings checkbox to add a registry key/startup shortcut so the portable `.exe` runs automatically when Windows boots.

### 4.4. Graceful Offline Handling
* **Functionality:** Actively monitor `navigator.onLine` or Electron's `net.isOnline()`.
* **Offline UI:** If the connection drops, hide the webview and display a branded HTML splash screen stating "Waiting for connection..." to prevent the default Chromium dinosaur error page. Auto-reload the webviews once the connection returns.

### 4.5. Hardware Acceleration Toggle
* **Functionality:** Add a checkbox in the settings menu to "Disable Hardware Acceleration." When toggled, the app must prompt for a restart and append `app.disableHardwareAcceleration()` to the main process on the next boot.

## 5. UI/UX & Theming Requirements

### 5.1. Branding and Assets
* **App Logo/Icon:** A specific `.png` file located in the working directory must be used as the application icon for the `.exe`, taskbar, and system tray.

### 5.2. Custom Accent Colors
* **Source:** All UI highlights, focus states, title bar details, and the footer content must be derived directly from the provided brand logo `.png`.
* **Specific Color Palette (Hex Codes):**
    * **Primary Accent (Magenta/Fuchsia):** Approx. `#D43F9B`.
    * **Secondary Accent (Dark Indigo/Violet):** Approx. `#43216E`.
    * **Tertiary Accent (Lavender/Light Purple):** Approx. `#D7BCFC`.
    * **Standard Text:** White (`#FFFFFF`).

### 5.3. Custom Title Bar & Footer
* **Title Bar:** Frameless window implementation featuring the app logo, "gemini-on-windows," Settings gear, View Layout selector, Always on Top push-pin, and window controls.
* **Footer:** A fixed status bar at the bottom displaying: `built with <3 by Gyanesh Samanta` (`#D7BCFC`).
* **Hyperlinks:** Footer must contain links styled with `#D43F9B` that open in the default OS browser:
    * Newsletter: `https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/`
    * LinkedIn: `https://www.linkedin.com/in/gyanesh-samanta/`
    * GitHub: `https://github.com/GyaneshSamanta`
    * Buy Me a Chai: `https://buymeachai.ezee.li/GyaneshOnProduct`

## 6. Performance and Optimization

### 6.1. System Footprint & Throttling
* **Memory Management:** When the application is minimized to the system tray, implement logic to throttle webview background activity (e.g., lower frame rates, pause non-essential DOM rendering) to conserve RAM and battery, especially critical when utilizing Quad View.