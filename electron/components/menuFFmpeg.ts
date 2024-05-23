import fs from 'node:fs'
import { exec } from 'node:child_process'
import { BrowserWindow, Menu, MenuItem, app, dialog, ipcMain } from 'electron'
import {
  currentPlayFactoryConfigs,
  formatBytes,
  playFactoryConfigsPath,
} from '../utils'
import path from 'node:path'
import axios from 'axios'
import { type IStatusDownload } from '../entities/statusDownload.entity'
import AdmZip from 'adm-zip'

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
            checkSO()
            console.log('Download')
          },
        },
      ],
    })
    menu.insert(1, newMenuFfmpeg)

    Menu.setApplicationMenu(menu)
  }
}

function checkSO() {
  const so = process.platform
  console.log(so)
  if (so === 'win32') {
    return 'win'
  } else if (so === 'darwin') {
    return 'mac'
  } else {
    return 'linux'
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
    playFactoryConfigsPath(),
    JSON.stringify({ ...currentPlayFactoryConfigs(), ffmpegPath: path }),
  )
}

async function downloadFile(url: string, outputPath: string, onProgress: any) {
  const writer = fs.createWriteStream(outputPath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  const totalLength = parseInt(response.headers['content-length'], 10)

  let downloadedLength = 0
  let lastPercentage = 0

  response.data.on('data', (chunk: any) => {
    downloadedLength += chunk.length
    const percentage = Math.round((downloadedLength / totalLength) * 100)
    if (percentage !== lastPercentage) {
      lastPercentage = percentage
      onProgress({
        error: '',
        message: 'Downloading FFmpeg...',
        percentage,
        totalLength: formatBytes(totalLength),
        elapsedLength: formatBytes(downloadedLength),
      })
    }
  })

  response.data.pipe(writer)

  return await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function unzipFile(zipPath: string, outputPath: string, onProgress: any) {
  const zip = new AdmZip(zipPath)
  const zipEntries = zip.getEntries()
  const totalSize = zipEntries.reduce(
    (acc, entry) => acc + entry.header.size,
    0,
  )

  let extractedSize = 0
  let lastPercentage = 0

  for (const entry of zipEntries) {
    const entryPath = path.join(outputPath, entry.entryName)
    if (entry.isDirectory) {
      fs.mkdirSync(entryPath, { recursive: true })
    } else {
      fs.writeFileSync(entryPath, entry.getData())
      extractedSize += entry.header.size
      const percentage = Math.round((extractedSize / totalSize) * 100)
      if (percentage !== lastPercentage) {
        lastPercentage = percentage
        onProgress({
          error: '',
          message: 'Extracting FFmpeg...',
          percentage,
          totalLength: formatBytes(totalSize),
          elapsedLength: formatBytes(extractedSize),
        })
      }
    }
  }
}

ipcMain.on('download-ffmpeg', async (_event) => {
  const releaseName = 'ffmpeg-n7.0-latest-win64-lgpl-7.0'
  const url = `https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${releaseName}.zip`

  const outputPath = app.isPackaged
    ? path.join(process.resourcesPath, 'ffmpeg.zip')
    : path.join(__dirname, 'ffmpeg.zip')

  const mainWindow = BrowserWindow.getAllWindows()[0]
  let progressDataObjet: IStatusDownload = {
    message: '',
    percentage: 0,
    totalLength: '',
    elapsedLength: '',
    completed: false,
    error: '',
  }
  try {
    await downloadFile(url, outputPath, (progressData: IStatusDownload) => {
      progressDataObjet = progressData
      console.log(progressDataObjet)
      mainWindow?.webContents.send('download-ffmpeg-status', progressDataObjet)
    })

    console.log(progressDataObjet)
    mainWindow?.webContents.send('download-ffmpeg-status', {
      ...progressDataObjet,
      message: 'FFmpeg downloaded successfully',
      completed: true,
    })

    // Unzip FFmpeg
    const unzipPath = app.isPackaged
      ? path.join(process.resourcesPath, 'ffmpeg')
      : path.join(__dirname, 'ffmpeg')

    console.log(unzipPath)
    await unzipFile(outputPath, unzipPath, (progressData: IStatusDownload) => {
      progressDataObjet = progressData
      console.log(progressData)
      mainWindow?.webContents.send('download-ffmpeg-status', progressData)
    })

    mainWindow?.webContents.send('download-ffmpeg-status', {
      ...progressDataObjet,
      message: 'FFmpeg downloaded and extracted successfully',
      completed: true,
    })

    const relativePathAux = path.join(unzipPath, releaseName, 'bin', 'ffmpeg')

    console.log(relativePathAux)
    checkFFmpegVersion(relativePathAux)
  } catch (error: any) {
    console.log('Download error', error.message)
    mainWindow?.webContents.send('download-ffmpeg-status', {
      ...progressDataObjet,
      error: error.message,
    })
  }
})

ipcMain.on('check-ffmpeg', (_event) => {
  checkFFmpegVersion()
})

ipcMain.on('find-ffmpeg', (_event) => {
  findFFmpegBinary()
})
