import { useCallback, useEffect } from 'react'

export function OpenFile({
  setCutEnd,
  setCutStart,
  setVolume,
  setFormat,
  setVideoName,
  setVideoSrc,
  setFilePath,
}: {
  setCutEnd: (value: string) => void
  setCutStart: (value: string) => void
  setVolume: (value: { name: string; value: string }) => void
  setFormat: (value: { name: string; value: string }) => void
  setVideoName: (value: string) => void
  setVideoSrc: (value: string) => void
  setFilePath: (value: string) => void
}) {
  const openFile = useCallback((_event: any, pathOrInvalid: string) => {
    if (pathOrInvalid === 'Invalid file') {
      alert('Invalid file')
      return
    }
    const videoName = pathOrInvalid.split('/').pop() ?? ''
    setCutEnd('00:00:00')
    setCutStart('00:00:00')
    setVolume({ name: 'None', value: '' })
    setFormat({ name: 'None', value: '' })
    setVideoName(videoName)
    setVideoSrc(pathOrInvalid)
    setFilePath(pathOrInvalid)
  }, [])

  useEffect(() => {
    window.electron.receive('open-file', openFile)
    return () => {
      window.electron.removeListener('open-file', openFile)
    }
  }, [])

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'o' && event.ctrlKey === true) {
        window.electron.sendEvent('open-file')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return <></>
}
