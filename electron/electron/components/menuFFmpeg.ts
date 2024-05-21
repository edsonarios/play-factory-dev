import fs from 'node:fs'
import { exec } from 'node:child_process'
import { BrowserWindow, Menu, MenuItem, dialog, ipcMain } from 'electron'
import { currentPlayFactoryConfigs, playFactoryConfigsPath } from '../utils'

export function addFFmpegMenu() {
  const menu = Menu.getApplicationMenu()
  if (menu !== null) {
    menu.items.forEach((item) => {
      if (item.label === 'Help' && item.submenu !== undefined) {
        item.submenu.insert(
          0,
          new MenuItem({
            label: 'Check for updates',
            click: () => {
              // checkForUpdates()
              console.log('Check for updates')
            },
          }),
        )
      }
    })
    const newMenuFfmpeg = new MenuItem({
      label: 'FFmpeg',
      submenu: [
        {
          label: 'Check version',
          click: () => {
            checkFFmpegVersion()
          },
        },
        {
          label: 'Find in system',
          click: () => {
            findFFmpegBinary()
          },
        },
        {
          label: 'Download FFmpeg',
          click: () => {
            // downloadFFmpeg()
            console.log('Download')
          },
        },
      ],
    })
    menu.insert(1, newMenuFfmpeg)

    Menu.setApplicationMenu(menu)
  }
}

export function checkFFmpegVersion(
  ffmpegPath = currentPlayFactoryConfigs().ffmpegPath ?? 'ffmpeg',
) {
  const command = `${ffmpegPath} -version`
  exec(command, (error) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (error !== null) {
      mainWindow.webContents.send('ffmpeg-status', 'FFmpeg not found')
    } else {
      savePathFFmpeg(ffmpegPath)
      mainWindow.webContents.send('ffmpeg-status', 'FFmpeg correctly installed')
    }
  })
}

// Find FFmpeg binary
function findFFmpegBinary() {
  const result = dialog.showOpenDialogSync({
    title: 'Find ffmpeg binary',
  })
  if (result === undefined || result.length === 0) return
  const path = result[0]

  const mainWindow = BrowserWindow.getAllWindows()[0]
  if (path.endsWith('ffmpeg.exe')) {
    checkFFmpegVersion(path)
  } else {
    mainWindow.webContents.send('ffmpeg-status', 'Invalid file')
  }
}

// Save the path of FFmpeg
function savePathFFmpeg(path: string) {
  fs.writeFileSync(
    playFactoryConfigsPath,
    JSON.stringify({ ...currentPlayFactoryConfigs(), ffmpegPath: path }),
  )
}

ipcMain.on('check-ffmpeg', (_event) => {
  checkFFmpegVersion()
})

ipcMain.on('download-ffmpeg', (_event) => {
  console.log('Download FFmpeg')
})

ipcMain.on('find-ffmpeg', (_event) => {
  findFFmpegBinary()
})
