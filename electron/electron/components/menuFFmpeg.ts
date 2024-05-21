import { exec } from 'child_process'
import { BrowserWindow, Menu, MenuItem, dialog, ipcMain } from 'electron'

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
            console.log('Check version')
            checkFFmpegVersion()
          },
        },
        {
          label: 'Download FFmpeg',
          click: () => {
            // downloadFFmpeg()
            console.log('Download')
          },
        },
        {
          label: 'Find in system',
          click: () => {
            // installFFmpeg()
            console.log('Find in system')
          },
        },
      ],
    })
    menu.insert(1, newMenuFfmpeg)

    Menu.setApplicationMenu(menu)
  }
}

function checkFFmpegVersion() {
  const command = 'ffmpeg -version'
  // const command =
  //   'C:/Users/edson/Documents/Docs/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe -version'
  exec(command, (error) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (error !== null) {
      mainWindow.webContents.send('ffmpeg-status', false)
    } else {
      mainWindow.webContents.send('ffmpeg-status', true)
    }
  })
}

// Import config from file .json
async function importConfig() {
  const result = dialog.showOpenDialogSync({
    title: 'Find ffmpeg binary',
  })
  if (result === undefined || result.length === 0) return
  const path = result[0]

  // const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  // if (result.canceled || result.filePaths.length === 0) return {}
  // const path = result.filePaths[0]

  console.log(path)
  const mainWindow = BrowserWindow.getAllWindows()[0]
  mainWindow.webContents.send('ffmpeg-status', true)
}

ipcMain.on('check-ffmpeg', (_event) => {
  checkFFmpegVersion()
})

ipcMain.on('download-ffmpeg', (_event) => {
  console.log('Download FFmpeg')
})

ipcMain.on('find-ffmpeg', async (_event) => {
  console.log('Find FFmpeg')
  await importConfig()
})
