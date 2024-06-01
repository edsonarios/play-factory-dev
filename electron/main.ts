import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import log from 'electron-log'
import { type IPlayFactoryConfig } from './entities/size.entity'
import { addFFmpegMenu } from './components/menuFFmpeg'
import { currentPlayFactoryConfigs, playFactoryConfigsPath } from './utils'
import { addMenuFile } from './components/menuFile'
import { autoUpdater } from 'electron-updater'

// v1
// import { convert } from './conversion/v1/convert'

// v2
import { makeFfmpegCommand } from './conversion/v2/makeCommand'
import { getTotalDuration, parseProgress } from './conversion/v2/utils'
import { type ChildProcess, fork } from 'node:child_process'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

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

function createWindow() {
  // Load the previous state to set the window position and size
  let playFactoryConfigs: IPlayFactoryConfig = {}
  try {
    playFactoryConfigs = JSON.parse(
      fs.readFileSync(playFactoryConfigsPath(), 'utf-8'),
    )
  } catch (err) {
    playFactoryConfigs = { x: 0, y: 0, width: 800, height: 600 }
  }

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'iconPlayFactory.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    x: playFactoryConfigs.x,
    y: playFactoryConfigs.y,
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
      fs.writeFileSync(
        playFactoryConfigsPath(),
        JSON.stringify({ ...currentPlayFactoryConfigs(), x, y, width, height }),
      )
    }
    win = null
    app.quit()
  })

  // Update and add Menus
  addFFmpegMenu()
  addMenuFile()
  addMenuHelp()
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

void app.whenReady().then(() => {
  win?.on('enter-full-screen', () => {
    win?.setMenuBarVisibility(false)
  })

  win?.on('leave-full-screen', () => {
    win?.setMenuBarVisibility(true)
  })
})

log.info('Ready')

// Conversion v1: Not possible cancel conversion
// ipcMain.on('start-conversion', (event, requestData) => {
//   convert(event, requestData)
// })

// Conversion v2: Possible cancel convercion, but just works in file "win-unpacked" using the installer file not works
let ffmpegProcess: ChildProcess
ipcMain.on('start-conversion', (event, requestData) => {
  event.sender.send('electron-debug', 'start-conversion')
  const command = makeFfmpegCommand(event, requestData)
  const modulePath = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts/runShellCommand.js')
    : path.join(__dirname, '../electron/conversion/v2/runShellCommand.js')

  ffmpegProcess = fork(modulePath)
  ffmpegProcess.send(command)
  let totalDuration = -1
  ffmpegProcess.on('message', (message: any) => {
    if (message.type === 'stdout' || message.type === 'stderr') {
      let getDuration = -1
      if (totalDuration === -1) {
        getDuration = getTotalDuration(message.data)
      }
      if (getDuration > 0) {
        totalDuration = getDuration
      }
      const progress = parseProgress(message.data)
      let progressPercent = 0
      if (totalDuration > 0 && progress > 0) {
        progressPercent = Math.floor((progress / totalDuration) * 100)
        event.sender.send('conversion-status', progressPercent)
      }
    } else if (message.type === 'close') {
      if (message.code === 0) {
        event.sender.send('conversion-status', 'Completed')
      } else {
        event.sender.send('conversion-status', 'Conversion failed')
      }
      ffmpegProcess = undefined!
    }
  })
})

ipcMain.on('cancel-conversion', () => {
  if (ffmpegProcess !== undefined) {
    ffmpegProcess.send('kill')
  }
})
// -------------------------------------------------------

export function addMenuHelp() {
  const menu = Menu.getApplicationMenu()
  if (menu !== null) {
    menu.items.forEach((item) => {
      if (item.label === 'Help' && item.submenu !== undefined) {
        item.submenu.insert(
          0,
          new MenuItem({
            label: 'Check for updates',
            click: () => {
              checkForUpdates()
            },
          }),
        )
      }
    })

    Menu.setApplicationMenu(menu)
  }
}

// Check for updates
function checkForUpdates() {
  // Remove previous events
  autoUpdater.removeAllListeners('update-available')
  autoUpdater.removeAllListeners('update-not-available')
  autoUpdater.removeAllListeners('update-downloaded')
  autoUpdater.removeAllListeners('download-progress')

  autoUpdater.on('update-available', () => {
    void dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Do you want to update now?',
        buttons: ['Update', 'Later'],
        noLink: true,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate().catch((error) => {
            win?.webContents.send('debug', 'update-available: ' + error.message)
          })
        }
      })
  })

  autoUpdater.on('update-not-available', () => {
    void dialog.showMessageBox({
      type: 'info',
      title: 'No Updates',
      message: 'Current version is up-to-date.',
    })
  })

  autoUpdater.on('update-downloaded', () => {
    void dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded, application will be quit for update...',
      })
      .then(() => {
        autoUpdater.quitAndInstall()
      })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('update-download-progress', progressObj)
  })

  autoUpdater.on('error', (error) => {
    win?.webContents.send('debug', 'error: ' + error.message)
  })

  autoUpdater.checkForUpdates().catch((error) => {
    win?.webContents.send('debug', 'checkForUpdates: ' + error.message)
  })
}
