const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 先加载 index.html，后续可改为加载 whatsapp-api 页面
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
