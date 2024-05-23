import { useCallback, useEffect, useState } from 'react'
import { ProgressBar } from '../modalStatusConversion/progressbar'
interface IStatusDownload {
  message: string
  percentage: number
  totalLength: string
  elapsedLength: string
  completed: boolean
  error: string
}

export default function StatusDownload() {
  const [statusDownload, setStatusDownload] = useState<IStatusDownload | null>(
    null,
  )

  const statusProgress = useCallback((_event: any, action: IStatusDownload) => {
    setStatusDownload(action)
    if (
      action.completed &&
      action.message === 'FFmpeg downloaded and extracted successfully'
    ) {
      setTimeout(() => {
        setStatusDownload(null)
      }, 2000)
    }
  }, [])

  useEffect(() => {
    window.electron.receive('download-ffmpeg-status', statusProgress)
    return () => {
      window.electron.removeListener('download-ffmpeg-status', statusProgress)
    }
  }, [])

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setStatusDownload(null)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {statusDownload !== null && (
        <div
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-2 w-full max-w-xl"
          >
            <p className="text-xl">
              {statusDownload.completed
                ? statusDownload.message
                : statusDownload.error !== ''
                  ? statusDownload.error
                  : statusDownload.message}
            </p>
            <p className="text-sm">
              {statusDownload.completed
                ? statusDownload.totalLength
                : statusDownload.elapsedLength}
              {statusDownload.error !== '' ? '' : ' / '}
              {statusDownload.totalLength}
            </p>
            <ProgressBar
              value={
                statusDownload.completed
                  ? '100'
                  : statusDownload.error !== ''
                    ? 'error'
                    : statusDownload.percentage.toString()
              }
            />
          </section>
        </div>
      )}
    </div>
  )
}
