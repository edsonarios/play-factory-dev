const { app, BrowserWindow, ipcMain } = require('electron')
const convert = require('./src/electron/convert')
const log = require('electron-log')

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)
log.info('Ready')

ipcMain.on('convert-video', (event, requestData) => {
  convert(requestData);
})
