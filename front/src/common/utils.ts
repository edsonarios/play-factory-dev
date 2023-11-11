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
