export function getTotalDuration(stderr: string) {
  const totalDuration = stderr.match(/Duration: (\d{2}:\d{2}:\d{2}.\d{2})/)
  if (totalDuration == null) return 0
  const timeString = totalDuration[1]
  const [hours, minutes, seconds] = timeString.split(':').map(parseFloat)
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds
  return timeInSeconds
}

export function parseProgress(stderr: string): number {
  const timeMatch = stderr.match(/time=(\d{2}:\d{2}:\d{2}.\d{2})/)
  if (timeMatch == null) return 0

  const timeString = timeMatch[1]
  const [hours, minutes, seconds] = timeString.split(':').map(parseFloat)
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds

  return timeInSeconds
}
