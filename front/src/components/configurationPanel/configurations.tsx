import ButtonComponent from '../button'
import DropDownComponent from './drop-down'
import InputComponent from './input'
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
  handleConvert: () => void
}

const volumeOptions: Options[] = [
  { name: 'None', value: '' },
  { name: '0.5 Volume', value: '0.5' },
  { name: '2 Volume', value: '2' },
  { name: '3 Volume', value: '3' },
  { name: '4 Volume', value: '4' },
  { name: '5 Volume', value: '5' }
]

const formatOptions: Options[] = [
  { name: 'None', value: '' },
  { name: 'Mp4', value: 'mp4' },
  { name: 'Flv', value: 'flv' },
  { name: 'MKV', value: 'mkv' },
  { name: 'Ts', value: 'ts' },
  { name: 'Mp3', value: 'mp3' },
  { name: 'Wav', value: 'wav' }
]

export default function ConfigurationComponent ({
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
  handleConvert
}: ConfigurationComponentProps) {
  const validateFilePath = (value: string) => {
    if (value === '') return 'File path is required.'
    return ''
  }

  const validateTimeFormat = (value: string) => {
    if (value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/) == null) {
      return 'Invalid time format.'
    }
    return ''
  }
  return (
    <div>
      <form onSubmit={handleConvert}>
        <InputComponent
          label="File Path"
          value={filePath}
          onChange={(event: any) => {
            setFilePath(event.target.value)
          }}
          validate={validateFilePath}
          required={true}
        />
        <InputComponent
          label="Time InitCut - HH:MM:SS"
          value={cutStart}
          onChange={(event: any) => {
            setCutStart(event.target.value)
          }}
          validate={validateTimeFormat}
          required={true}
        />
        <InputComponent
          label="Time FinishCut - HH:MM:SS"
          value={cutEnd}
          onChange={(event: any) => {
            setCutEnd(event.target.value)
          }}
          validate={validateTimeFormat}
          required={true}
        />
        <DropDownComponent
          label="Change Volume"
          value={volume}
          setValue={setVolume}
          options={volumeOptions}
        />
        <DropDownComponent
          label="Convert To"
          value={format}
          setValue={setFormat}
          options={formatOptions}
        />
        <ButtonComponent label="Convert" type='submit' />
      </form>
    </div>
  )
}
