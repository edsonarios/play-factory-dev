import { BrowserWindow, Menu, MenuItem, dialog, ipcMain } from 'electron'
export const allowedExtensions = new Set([
  'mp3',
  'wav',
  'flac',
  'mp4',
  'mkv',
  'avi',
  'ts',
])

export function addMenuFile() {
  const menu = Menu.getApplicationMenu()
  if (menu !== null) {
    menu.items.forEach((item) => {
      if (item.label === 'File' && item.submenu !== undefined) {
        item.submenu.insert(
          0,
          new MenuItem({
            label: 'Open File (O)',
            click: () => {
              openFile()
            },
          }),
        )
        item.submenu.insert(1, new MenuItem({ type: 'separator' }))
      }
    })

    Menu.setApplicationMenu(menu)
  }
}

// Open file
function openFile() {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  const result = dialog.showOpenDialogSync({
    title: 'Find ffmpeg binary',
  })
  if (result === undefined || result.length === 0) return
  const path = result[0]
  const pathParsed = path.replace(/\\/g, '/')
  const extensionFile = pathParsed.split('/').pop()?.split('.').pop()
  if (extensionFile !== undefined && allowedExtensions.has(extensionFile)) {
    mainWindow.webContents.send('open-file', pathParsed)
  } else {
    mainWindow.webContents.send('open-file', 'Invalid file')
  }
}

ipcMain.on('open-file', (_event) => {
  openFile()
})
