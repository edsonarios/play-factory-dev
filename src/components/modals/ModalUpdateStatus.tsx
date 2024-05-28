import { useCallback, useEffect, useState } from 'react'
import { ProgressBar } from '../modalStatusConversion/progressbar'

interface IDowloadProgress {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

export default function ModalUpdateStatus() {
  const [updateDownload, setUpdateDownload] = useState<IDowloadProgress | null>(
    null,
  )

  const updateDownloadProgress = useCallback(
    (_event: any, action: IDowloadProgress) => {
      setUpdateDownload(action)
    },
    [],
  )

  useEffect(() => {
    window.electron.receive('update-download-progress', updateDownloadProgress)
    return () => {
      window.electron.removeListener(
        'update-download-progress',
        updateDownloadProgress,
      )
    }
  }, [])

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div>
      {updateDownload !== null && (
        <div
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-2 w-full max-w-md"
          >
            <p className="text-xl">{'Downloading update...'}</p>
            <p className="text-xs">
              {'Speed: '} {formatBytes(updateDownload.bytesPerSecond)}/s
            </p>
            <p className="text-xs">
              {'Transferido: '}
              {formatBytes(updateDownload.transferred)} /{' '}
              {formatBytes(updateDownload.total)}
            </p>
            <ProgressBar value={updateDownload.percent + ''} />
          </section>
        </div>
      )}
    </div>
  )
}
