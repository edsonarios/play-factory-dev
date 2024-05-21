import { useEffect } from 'react'
import ButtonComponent from '../configurationPanel/button'
import { type FFmpegStoreType, useFFmpegStore } from '@/store/ffmpegStore'
import { IconCheck } from './IconCheck'
import { IconWarning } from './IconWarning'
enum ffmpegMessages {
  FOUND = 'FFmpeg correctly installed',
}
export default function StatusFFmpeg() {
  const {
    isFFmpegInstalled,
    showModalStatus,
    setShowModalStatus,
    setIsFFmpegInstalled,
    setMessageFFmpegError,
    messageFFmpegError,
  } = useFFmpegStore<FFmpegStoreType>((state) => state)

  // Listen to the ffmpeg-status event
  useEffect(() => {
    const debugParams = async (_event: any, action: string) => {
      if (action === ffmpegMessages.FOUND) {
        setIsFFmpegInstalled(true)
      }
      if (action !== ffmpegMessages.FOUND) {
        setMessageFFmpegError(action)
        setIsFFmpegInstalled(false)
      }
      setShowModalStatus(true)
    }

    window.electron.receive('ffmpeg-status', debugParams)

    return () => {
      window.electron.removeListener('ffmpeg-status', debugParams)
    }
  }, [])

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setShowModalStatus(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {showModalStatus && (
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
            {isFFmpegInstalled ? (
              <div className="flex justify-between">
                <span className="flex items-center">
                  <p className="text-xl">FFmpeg is correctly installed</p>
                  <IconCheck />
                </span>
                <ButtonComponent
                  label="Close"
                  onClick={() => {
                    setShowModalStatus(false)
                  }}
                  style="py-1 w-16 self-end mr-2 mt-2"
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="flex items-center">
                  <p className="text-xl">{messageFFmpegError}</p>
                  <IconWarning />
                </span>
                <div className="flex justify-around my-6">
                  <ButtonComponent
                    label="Find ffmpeg in system"
                    onClick={() => {
                      window.electron.sendEvent('find-ffmpeg')
                    }}
                    style="py-1 w-16 text-xs"
                  />
                  <ButtonComponent
                    label="Download FFmpeg"
                    onClick={() => {
                      window.electron.sendEvent('download-ffmpeg')
                    }}
                    style="py-1 w-16 text-xs"
                  />
                </div>
                <ButtonComponent
                  label="Close"
                  onClick={() => {
                    setShowModalStatus(false)
                  }}
                  style="py-1 w-16 self-end mr-2 mt-2 bg-yellow-400 hover:bg-yellow-700"
                />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
