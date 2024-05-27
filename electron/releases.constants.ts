// https://github.com/browserslist/update-db#readme
// https://evermeet.cx/pub/ffmpeg/
// https://evermeet.cx/ffmpeg/#api-download
// https://evermeet.cx/ffmpeg/get/zip
import { checkSO } from './utils'

const os = checkSO()
export const releaseFFmpegName =
  os === 'win'
    ? 'ffmpeg-n7.0-latest-win64-lgpl-7.0'
    : os === 'mac'
      ? 'ffmpeg'
      : 'ffmpeg-n7.0-latest-linux64-lgpl-7.0'
export const urlFFmpegToDownload =
  os === 'win'
    ? `https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${releaseFFmpegName}.zip`
    : os === 'mac'
      ? 'https://evermeet.cx/ffmpeg/get/zip'
      : `https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${releaseFFmpegName}.tar.xz`

export const ffmpegFileExtension = os === 'win' || 'mac' ? 'ffmpeg.zip' : 'ffmpeg.tar.xz'
