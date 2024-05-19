import path from 'path'
import { type ChildProcess, exec } from 'child_process'

interface FileToConvertType {
  videoName: string
  filePath: string
  cutStart: string
  cutEnd: string
  volume: string
  format: string
}
function getTotalDuration(stderr: string) {
  const totalDuration = stderr.match(/Duration: (\d{2}:\d{2}:\d{2}.\d{2})/)
  if (totalDuration == null) return 0
  const timeString = totalDuration[1]
  const [hours, minutes, seconds] = timeString.split(':').map(parseFloat)
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds
  return timeInSeconds
}

function parseProgress(stderr: string): number {
  const timeMatch = stderr.match(/time=(\d{2}:\d{2}:\d{2}.\d{2})/)
  if (timeMatch == null) return 0

  const timeString = timeMatch[1]
  const [hours, minutes, seconds] = timeString.split(':').map(parseFloat)
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds

  return timeInSeconds
}

export function convert(
  event: any,
  fileToConvert: FileToConvertType,
  // signal: AbortSignal,
) {
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
  const ffmpegProcess = exec(commandToExecute)
  let totalDuration = -1
  ffmpegProcess.stderr?.on('data', (data) => {
    let getDuration = -1
    if (totalDuration === -1) {
      getDuration = getTotalDuration(data)
    }
    if (getDuration > 0) {
      totalDuration = getDuration
    }
    const progress = parseProgress(data)
    let progressPercent = 0
    if (totalDuration > 0 && progress > 0) {
      progressPercent = Math.floor((progress / totalDuration) * 100)
      event.sender.send('conversion-status', progressPercent)
    }
  })

  ffmpegProcess.on('close', (code) => {
    if (code === 0) {
      event.sender.send('conversion-status', 'Completed')
    } else {
      event.sender.send('conversion-status', 'Conversion failed')
    }
  })

  return ffmpegProcess
}

export function cancelConversion(process: ChildProcess) {
  if (process !== undefined && !process.killed) {
    process.kill('SIGINT')
  }
}
