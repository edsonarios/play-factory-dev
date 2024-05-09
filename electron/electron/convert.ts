import path from 'path'
import { exec } from 'child_process'

interface FileToConvertType {
  videoName: string
  filePath: string
  cutStart: string
  cutEnd: string
  volume: string
  format: string
}

export function convert(fileToConvert: FileToConvertType) {
  const { videoName, filePath, cutStart, cutEnd, volume, format } =
    fileToConvert
  let commandToExecute = `ffmpeg -ss ${cutStart} `

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
    commandToExecute += `"${filePathWithoutName}\\${outputFileName}" `
  } else {
    if (volume.length === 0) {
      commandToExecute += '-c copy '
    }
    const baseName = path.basename(videoName, path.extname(videoName))
    const extName = path.extname(videoName)
    commandToExecute += `"${filePathWithoutName}\\${baseName}-converted${extName}" `
  }

  commandToExecute += '-y'
  console.log(commandToExecute)
  exec(commandToExecute, (error: any, stdout: any, stderr: any) => {
    if (error !== undefined) {
      console.error(`Error when execute script: ${error}`)
      return
    }
    console.error(`stderr: ${stderr}`)
    console.log(`stdout: ${stdout}`)
    console.log('Finished')
  })
}
