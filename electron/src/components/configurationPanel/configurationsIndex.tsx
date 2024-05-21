import { validateNotEmptyField, validateTimeFormat } from '@/common/utils'
import DropDownComponent from './dropDown'
import InputComponent from './input'
import ButtonComponent from '@/components/configurationPanel/button'
import { type FFmpegStoreType, useFFmpegStore } from '@/store/ffmpegStore'
import { useEffect } from 'react'
interface Options {
  name: string
  value: string
}
interface ConfigurationComponentProps {
  filePath: string
  setFilePath: React.Dispatch<React.SetStateAction<string>>
  cutStart: string
  setCutStart: React.Dispatch<React.SetStateAction<string>>
  cutEnd: string
  setCutEnd: React.Dispatch<React.SetStateAction<string>>
  volume: Options
  setVolume: React.Dispatch<React.SetStateAction<Options>>
  format: Options
  setFormat: React.Dispatch<React.SetStateAction<Options>>
  handleConvert: (event: any) => void
}

const volumeOptions: Options[] = [
  { name: '5 Volume', value: '5' },
  { name: '4 Volume', value: '4' },
  { name: '3 Volume', value: '3' },
  { name: '2 Volume', value: '2' },
  { name: '0.5 Volume', value: '0.5' },
  { name: 'Not Change', value: '' },
]

const formatOptions: Options[] = [
  { name: 'Mp3', value: 'mp3' },
  { name: 'Wav', value: 'wav' },
  { name: 'Ts', value: 'ts' },
  { name: 'MKV', value: 'mkv' },
  { name: 'Flv', value: 'flv' },
  { name: 'Mp4', value: 'mp4' },
  { name: 'Not Change', value: '' },
]

export default function ConfigurationComponent({
  filePath,
  setFilePath,
  cutStart,
  setCutStart,
  cutEnd,
  setCutEnd,
  volume,
  setVolume,
  format,
  setFormat,
  handleConvert,
}: ConfigurationComponentProps) {
  const { isFFmpegInstalled, setIsFFmpegVersion, setShowModalStatus } =
    useFFmpegStore<FFmpegStoreType>((state) => state)

  // Listen to the ffmpeg-status event
  useEffect(() => {
    const debugParams = async (_event: any, action: boolean) => {
      setIsFFmpegVersion(action)
      setShowModalStatus(true)
    }

    window.electron.receive('ffmpeg-status', debugParams)

    return () => {
      window.electron.removeListener('ffmpeg-status', debugParams)
    }
  }, [])

  return (
    <div className="pt-4">
      <h3 id="additionalTId" className="text-lg border-t-2 border-zinc-700">
        Configurations:
      </h3>
      <form className="flex flex-row gap-x-2 mt-2" onSubmit={handleConvert}>
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-row gap-x-4 flex-wrap">
            <InputComponent
              label="File Path"
              value={filePath}
              onChange={(event: any) => {
                setFilePath(event.target.value)
              }}
              validate={validateNotEmptyField}
              required={true}
            />
            <InputComponent
              label="Cut Init"
              value={cutStart}
              onChange={(event: any) => {
                setCutStart(event.target.value)
              }}
              validate={validateTimeFormat}
              required={true}
              placeholder="HH:MM:SS"
            />
            <InputComponent
              label="Cut Finish"
              value={cutEnd}
              onChange={(event: any) => {
                setCutEnd(event.target.value)
              }}
              validate={validateTimeFormat}
              required={true}
              placeholder="HH:MM:SS"
            />
            <DropDownComponent
              label="Volume"
              value={volume}
              setValue={setVolume}
              options={volumeOptions}
            />
            <DropDownComponent
              label="Format"
              value={format}
              setValue={setFormat}
              options={formatOptions}
            />
          </div>
          <div className="flex items-start pl-4">
            {isFFmpegInstalled ? (
              <ButtonComponent
                label="Convert"
                type="submit"
                // style="py-4 text-lg"
                style="py-4 text-lg"
              />
            ) : (
              <ButtonComponent
                label="Check FFmpeg"
                type="button"
                style="py-4 text-sm w-28 bg-yellow-500 hover:bg-yellow-700"
                onClick={() => {
                  window.electron.sendEvent('check-ffmpeg')
                }}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
