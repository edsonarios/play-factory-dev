import { checkSO } from './utils'

const os = checkSO()
export const releaseFFmpegName =
  os === 'win'
    ? 'ffmpeg-n7.0-latest-win64-lgpl-7.0'
    : 'ffmpeg-n7.0-latest-linux64-lgpl-7.0'
export const urlFFmpegToDownload =
  os === 'win'
    ? `https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${releaseFFmpegName}.zip`
    : `https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${releaseFFmpegName}.tar.xz`

export const ffmpegFileExtension = os === 'win' ? 'ffmpeg.zip' : 'ffmpeg.tar.xz'
