export function formatTime (seconds: number) {
  const roundedSeconds = Math.round(seconds)
  const hours = Math.floor(roundedSeconds / 3600)
  const minutes = Math.floor((roundedSeconds % 3600) / 60)
  const remainingSeconds = roundedSeconds % 60

  const padWithZero = (number: number) => {
    const string = number.toString()
    if (number < 10) {
      return '0' + string
    }
    return string
  }

  return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`
}

export const validateNotEmptyField = (value: string) => {
  if (value === '') return 'File path is required.'
  return ''
}

export const validateTimeFormat = (value: string) => {
  if (value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/) == null) {
    return 'Invalid time format.'
  }
  return ''
}

interface RequestData {
  videoName: string
  filePath: string
  cutStart: string
  cutEnd: string
  volume: string
  format: string
}

export function validateDatas (requestDatas: RequestData) {
  if (validateNotEmptyField(requestDatas.videoName) !== '') {
    return 'Not Found videoName'
  }
  if (validateNotEmptyField(requestDatas.filePath) !== '') {
    return 'Not Found filePath'
  }
  if (validateTimeFormat(requestDatas.cutStart) !== '') {
    return 'Invalid Format Time Start'
  }
  if (validateTimeFormat(requestDatas.cutEnd) !== '') {
    return 'Invalid Format Time End'
  }
  const cutStartSeconds = timeToSeconds(requestDatas.cutStart)
  const cutEndSeconds = timeToSeconds(requestDatas.cutEnd)
  if (requestDatas.cutStart === '00:00:00' && requestDatas.cutEnd === '00:00:00') {
    return ''
  }
  if (cutEndSeconds <= cutStartSeconds) {
    return 'The end time must be greater than the start time.'
  }
  return ''
}

const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}
