const { app, BrowserWindow, WebContentsView, ipcMain, Tray, Menu, globalShortcut, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

// Set up AppData/Roaming/gemini-on-windows for persistence
app.setPath('userData', path.join(app.getPath('appData'), 'gemini-on-windows'));

// Read settings
const getSetting = (key, defaultVal) => store.get(key, defaultVal);
const setSetting = (key, val) => store.set(key, val);

if (getSetting('disableHardwareAcceleration', false)) {
  app.disableHardwareAcceleration();
}

let mainWindow;
let tray;
let views = [];
const GEMINI_URL = 'https://gemini.google.com/';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    icon: path.join(__dirname, 'Assets', 'App logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
    alwaysOnTop: getSetting('alwaysOnTop', false),
    skipTaskbar: getSetting('keepInTray', false), // Optional behavior based on requirements
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  setupTray();
  setupGlobalShortcut();
  
  // Security Hardening: Open external links in default OS browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (!details.url.includes('google.com')) {
      shell.openExternal(details.url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('google.com') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

function setupTray() {
  tray = new Tray(path.join(__dirname, 'Assets', 'App logo.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Always on Top', type: 'checkbox', checked: getSetting('alwaysOnTop', false), click: (item) => toggleAlwaysOnTop(item.checked) },
    { label: 'Launch on Startup', type: 'checkbox', checked: getSetting('runOnStartup', false), click: (item) => toggleRunOnStartup(item.checked) },
    { label: 'Settings', click: () => { mainWindow.show(); mainWindow.webContents.send('open-settings'); } },
    { type: 'separator' },
    { label: 'Exit', click: () => { app.isQuiting = true; app.quit(); } }
  ]);
  tray.setToolTip('gemini-on-windows');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

function setupGlobalShortcut() {
  const shortcut = getSetting('shortcut', 'CommandOrControl+Alt+G');
  globalShortcut.unregisterAll();
  try {
    globalShortcut.register(shortcut, () => {
      if (mainWindow.isVisible() && mainWindow.isFocused()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (e) {
    console.error('Failed to register shortcut', e);
  }
}

function toggleAlwaysOnTop(value) {
  setSetting('alwaysOnTop', value);
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(value);
    mainWindow.webContents.send('always-on-top-changed', value);
  }
}

function toggleRunOnStartup(value) {
  setSetting('runOnStartup', value);
  app.setLoginItemSettings({
    openAtLogin: value,
    path: app.getPath('exe')
  });
}

// IPC Handlers
ipcMain.on('window-minimize', () => {
  if (getSetting('keepInTray', false)) {
    mainWindow.hide();
  } else {
    mainWindow.minimize();
  }
});
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

ipcMain.on('toggle-always-on-top', (event, value) => {
  toggleAlwaysOnTop(value);
});

// Layout sets are now managed by renderer DOM

ipcMain.handle('get-settings', () => {
  return {
    shortcut: getSetting('shortcut', 'CommandOrControl+Alt+G'),
    keepInTray: getSetting('keepInTray', false),
    runOnStartup: getSetting('runOnStartup', false),
    disableHardwareAcceleration: getSetting('disableHardwareAcceleration', false),
    alwaysOnTop: getSetting('alwaysOnTop', false)
  };
});

ipcMain.on('save-settings', (event, settings) => {
  if (settings.shortcut !== getSetting('shortcut')) {
    setSetting('shortcut', settings.shortcut);
    setupGlobalShortcut();
  }
  setSetting('keepInTray', settings.keepInTray);
  
  if (settings.runOnStartup !== getSetting('runOnStartup')) {
    toggleRunOnStartup(settings.runOnStartup);
  }

  if (settings.disableHardwareAcceleration !== getSetting('disableHardwareAcceleration')) {
    setSetting('disableHardwareAcceleration', settings.disableHardwareAcceleration);
    // Note: User must restart app manually for HW accel changes to take effect
  }
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

app.whenReady().then(() => {
  createWindow();

  // Security for dynamically created webviews
  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
      contents.setWindowOpenHandler((details) => {
        if (!details.url.includes('google.com')) {
          shell.openExternal(details.url);
          return { action: 'deny' };
        }
        return { action: 'allow' };
      });
      contents.on('will-navigate', (navEvent, url) => {
        if (!url.includes('google.com')) {
          navEvent.preventDefault();
          shell.openExternal(url);
        }
      });
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
