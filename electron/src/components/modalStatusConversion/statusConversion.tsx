import { useCallback, useEffect, useState } from 'react'
import { ProgressBar } from './progressbar'
import ButtonComponent from '../configurationPanel/button'
export enum EstatusConvertion {
  Completed = 'Completed',
  ConversionCompleted = 'Conversion completed',
  ConversionFailed = 'Conversion failed',
  Converting = 'Converting...',
  Close = 'Close',
  Cancel = 'Cancel',
  Canceled = 'Canceled',
  Hidden = 'Hidden',
}
export default function StatusConversion({ filePath }: { filePath: string }) {
  const timeToHiddenProgressBar = 1000
  const [statusConvertion, setStatusConvertion] = useState<string>(
    EstatusConvertion.Hidden,
  )

  const statusProgress = useCallback((_event: any, action: string) => {
    setStatusConvertion(action)
    if (action === EstatusConvertion.Completed) {
      setTimeout(() => {
        setStatusConvertion(EstatusConvertion.Hidden)
      }, timeToHiddenProgressBar)
    }
  }, [])

  useEffect(() => {
    window.electron.receive('conversion-status', statusProgress)
    return () => {
      window.electron.removeListener('conversion-status', statusProgress)
    }
  }, [])

  const handledButtonProgressBar = () => {
    if (statusConvertion === EstatusConvertion.ConversionFailed) {
      setStatusConvertion(EstatusConvertion.Hidden)
      return
    }

    window.electron.sendEvent('cancel-conversion')

    if (statusConvertion !== EstatusConvertion.Completed) {
      setStatusConvertion(EstatusConvertion.Cancel)
      setTimeout(() => {
        setStatusConvertion(EstatusConvertion.Hidden)
      }, timeToHiddenProgressBar)
    }
  }

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setStatusConvertion(EstatusConvertion.Hidden)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {statusConvertion !== EstatusConvertion.Hidden && (
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
                  : statusConvertion === EstatusConvertion.Cancel
                    ? EstatusConvertion.Canceled
                    : EstatusConvertion.Converting}
            </p>
            <p className="text-sm">{filePath}</p>
            <ProgressBar
              value={
                statusConvertion === EstatusConvertion.Completed
                  ? '100'
                  : statusConvertion === EstatusConvertion.ConversionFailed
                    ? EstatusConvertion.Cancel
                    : statusConvertion
              }
            />
            <ButtonComponent
              label={
                statusConvertion === EstatusConvertion.Completed
                  ? EstatusConvertion.Close
                  : statusConvertion === EstatusConvertion.ConversionFailed
                    ? EstatusConvertion.Close
                    : EstatusConvertion.Cancel
              }
              onClick={() => {
                handledButtonProgressBar()
              }}
              style="py-1 w-16 self-end mr-2 mt-2"
            />
          </section>
        </div>
      )}
    </div>
  )
}
