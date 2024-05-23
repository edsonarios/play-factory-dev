import path from 'node:path'
import { app } from 'electron'
import fs from 'node:fs'
import { type IPlayFactoryConfig } from './entities/size.entity'

export const playFactoryConfigsPath = (): string => {
  const configPath = path.join(
    app.getPath('userData'),
    'play-factory-config.json',
  )

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}), 'utf-8')
  }
  return configPath
}

export function currentPlayFactoryConfigs(): IPlayFactoryConfig {
  return JSON.parse(fs.readFileSync(playFactoryConfigsPath(), 'utf-8'))
}

export function getParseFFmpegPath(): string {
  const ffmpegPath = currentPlayFactoryConfigs().ffmpegPath
  if (ffmpegPath !== undefined) {
    return ffmpegPath.replace(/\\/g, '/')
  }
  return 'ffmpeg'
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
