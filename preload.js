const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close'),
  toggleAlwaysOnTop: (value) => ipcRenderer.send('toggle-always-on-top', value),
  setLayout: (count) => ipcRenderer.send('set-layout', count),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  onAlwaysOnTopChanged: (callback) => ipcRenderer.on('always-on-top-changed', (event, value) => callback(value)),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback)
});
