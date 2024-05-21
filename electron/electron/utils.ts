import path from 'node:path'
import { app } from 'electron'
import fs from 'node:fs'
import { type IPlayFactoryConfig } from './entities/size.entity'

export const playFactoryConfigsPath = path.join(
  app.getPath('userData'),
  'play-factory-state.json',
)

export function currentPlayFactoryConfigs(): IPlayFactoryConfig {
  return JSON.parse(fs.readFileSync(playFactoryConfigsPath, 'utf-8'))
}

export function getParseFFmpegPath(): string {
  const ffmpegPath = currentPlayFactoryConfigs().ffmpegPath
  if (ffmpegPath !== undefined) {
    return ffmpegPath.replace(/\\/g, '/')
  }
  return 'ffmpeg'
}
