import { validateNotEmptyField, validateTimeFormat } from '@/common/utils'
import DropDownComponent from './dropDown'
import InputComponent from './input'
import ButtonComponent from '@/components/configurationPanel/button'
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
  { name: 'None', value: '' },
]

const formatOptions: Options[] = [
  { name: 'Mp3', value: 'mp3' },
  { name: 'Wav', value: 'wav' },
  { name: 'Ts', value: 'ts' },
  { name: 'MKV', value: 'mkv' },
  { name: 'Flv', value: 'flv' },
  { name: 'Mp4', value: 'mp4' },
  { name: 'None', value: '' },
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
  return (
    <div className="pt-4">
      <h3 id="additionalTId" className="text-lg">
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
              label="Cut Init - HH:MM:SS"
              value={cutStart}
              onChange={(event: any) => {
                setCutStart(event.target.value)
              }}
              validate={validateTimeFormat}
              required={true}
            />
            <InputComponent
              label="Cut Finish - HH:MM:SS"
              value={cutEnd}
              onChange={(event: any) => {
                setCutEnd(event.target.value)
              }}
              validate={validateTimeFormat}
              required={true}
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
            <ButtonComponent
              label="Convert"
              type="submit"
              style="py-4 text-lg"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
