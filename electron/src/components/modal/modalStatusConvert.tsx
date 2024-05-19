import { useCallback, useEffect, useState } from 'react'
import { ProgressBar } from './progressbar'
// import ButtonComponent from '../configurationPanel/button'
enum EstatusConvertion {
  Completed = 'Completed',
  ConversionCompleted = 'Conversion completed',
  ConversionFailed = 'Conversion failed',
  Converting = 'Converting...',
  Close = 'Close',
  Cancel = 'Cancel',
}
export default function ModalConvertionStatus({
  filePath,
}: {
  filePath: string
}) {
  const [statusConvertion, setStatusConvertion] = useState<string>('-1')

  const statusProgress = useCallback((_event: any, action: string) => {
    setStatusConvertion(action)
    if (action === EstatusConvertion.Completed) {
      setTimeout(() => {
        setStatusConvertion('-1')
      }, 2000)
    }
  }, [])

  useEffect(() => {
    window.electron.receive('conversion-status', statusProgress)
    return () => {
      window.electron.removeListener('conversion-status', statusProgress)
    }
  }, [])

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setStatusConvertion('-1')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {statusConvertion !== '-1' && (
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
              {statusConvertion === EstatusConvertion.Completed
                ? EstatusConvertion.ConversionCompleted
                : statusConvertion === EstatusConvertion.ConversionFailed
                  ? EstatusConvertion.ConversionFailed
                  : EstatusConvertion.Converting}
            </p>
            <p className="text-sm">{filePath}</p>
            <ProgressBar
              value={
                statusConvertion === EstatusConvertion.Completed
                  ? 100
                  : statusConvertion === EstatusConvertion.ConversionFailed
                    ? -1
                    : parseInt(statusConvertion)
              }
            />
            {/* <ButtonComponent
              label={
                statusConvertion === EstatusConvertion.Completed
                  ? EstatusConvertion.Close
                  : statusConvertion === EstatusConvertion.ConversionFailed
                    ? EstatusConvertion.Close
                    : EstatusConvertion.Cancel
              }
              onClick={() => {
                window.electron.sendEvent('cancel-conversion')
                setStatusConvertion('-1')
              }}
              style="py-1 w-16 self-end mr-2 mt-2"
            /> */}
          </section>
        </div>
      )}
    </div>
  )
}
