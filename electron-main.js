// electron-main.js moded to FeStore by Irongt
'use strict';
const { app, BrowserWindow, Menu, screen } = require('electron');
const path = require('path');

// --- Protocol configuration ---
const PROTOCOL = 'penguinmodauth';
app.setAsDefaultProtocolClient(PROTOCOL);

// --- Prevent multiple instances ---
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// Remove the menu bar on all platforms
Menu.setApplicationMenu(null);

// Project base route
const basePath = __dirname;
let mainWindow;

// Create the main window
function createMainWindow() {
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const bounds = display.workArea;

  mainWindow = new BrowserWindow({
    width: 360,               // Width of the proyect here
    height: 360,              // Height of the proyect here
    x: bounds.x + ((bounds.width - 360) / 2),   // Width of the proyect x: bounds.x + ((bounds.width - Here->>360) / 2),
    y: bounds.y + ((bounds.height - 360) / 2),  // Height of the proyect here y: bounds.y + ((bounds.height - Here->>360) / 2),
    frame: false,             // Whitout frame
    resizable: false,         // No resizable
    backgroundColor: "#000000", // Background
    show: false,              // Show when its ready
    webPreferences: {
      nodeIntegration: true,    // Use require('fs') in the UI
      contextIsolation: false,
      sandbox: false
    }
  });

  // Load index.html
  mainWindow.loadFile(path.join(basePath, 'index.html'));

  // Show window when its ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // If you close the window → Exit (not compatible in macOS)
  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  return mainWindow;
}

// --- Logic to inject data into the extension ---
function handleProtocolUrl(url) {
  const token = url.split('://')[1];
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`
      window.dispatchEvent(new CustomEvent('token-recibido', { detail: '${token}' }));
    `);
  }
}

// Start app
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// --- Handle protocol events ---
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleProtocolUrl(url);
});

// --- Handle second instance for Windows ---
app.on('second-instance', (event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL}://`));
  if (url) handleProtocolUrl(url);
});

// Exit on Windows\Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
