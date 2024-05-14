import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { convert } from './convert'
import log from 'electron-log'
import { type ISize } from './entities/size.entity'
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

const windowStatePath = path.join(
  app.getPath('userData'),
  'play-factory-state.json',
)

function createWindow() {
  // Load the previous state to set the window position and size
  let windowState: ISize = {}
  try {
    windowState = JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'))
  } catch (err) {
    windowState = { x: 0, y: 0, width: 800, height: 600 }
  }

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'conversor.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    x: windowState.x,
    y: windowState.y,
  })
  win.maximize()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL != null) {
    void win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    void win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  win.on('close', (_event) => {
    if (win !== null) {
      const { x, y, width, height } = win.getBounds()
      fs.writeFileSync(windowStatePath, JSON.stringify({ x, y, width, height }))
    }
    win = null
    app.quit()
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

void app.whenReady().then(createWindow)

log.info('Ready')

// Functions for app
ipcMain.on('convert-video', (event, requestData) => {
  convert(event, requestData)
})
