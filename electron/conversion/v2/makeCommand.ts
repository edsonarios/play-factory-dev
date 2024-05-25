import { getParseFFmpegPath } from '../../utils'
import path from 'path'

interface FileToConvertType {
  videoName: string
  filePath: string
  cutStart: string
  cutEnd: string
  volume: string
  format: string
}

export function makeFfmpegCommand(
  _event: any,
  fileToConvert: FileToConvertType,
) {
  const { videoName, filePath, cutStart, cutEnd, volume, format } =
    fileToConvert
  const ffmpegPath = getParseFFmpegPath()
  let commandToExecute = `${ffmpegPath} -ss ${cutStart} `

  if (cutEnd !== '00:00:00') {
    commandToExecute += `-to ${cutEnd} `
  }

  commandToExecute += `-i "${filePath}" `

  if (volume.length > 0) {
    commandToExecute += `-filter:a "volume=${volume}" `
  }

  const filePathWithoutName = path.dirname(filePath)

  if (format.length > 0) {
    const baseName = path.basename(videoName, path.extname(videoName))
    const outputFileName = `${baseName}-converted.${format}`
    const newPath = path.join(filePathWithoutName, outputFileName)
    commandToExecute += `"${newPath}"`
  } else {
    if (volume.length === 0) {
      commandToExecute += '-c copy '
    }
    const baseName = path.basename(videoName, path.extname(videoName))
    const extName = path.extname(videoName)
    const newPath = path.join(
      filePathWithoutName,
      `${baseName}-converted${extName}`,
    )
    commandToExecute += `"${newPath}"`
  }

  commandToExecute += ' -y'
  return commandToExecute
}
