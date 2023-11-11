import ButtonComponent from '../button'
import DropDownComponent from './drop-down'
import InputComponent from './input'
interface Options {
  name: string
  value: string
}
interface ConfigurationComponentProps {
  cutStart: string
  setCutStart: React.Dispatch<React.SetStateAction<string>>
  cutEnd: string
  setCutEnd: React.Dispatch<React.SetStateAction<string>>
  volume: string
  setVolume: React.Dispatch<React.SetStateAction<string>>
  format: string
  setFormat: React.Dispatch<React.SetStateAction<string>>
  handleConvert: () => void
}

const volumeOptions: Options[] = [
  { name: 'None', value: '0' },
  { name: '0.5 Volume', value: '0.5' },
  { name: '2 Volume', value: '2' },
  { name: '3 Volume', value: '3' },
  { name: '4 Volume', value: '4' },
  { name: '5 Volume', value: '5' }
]

const formatOptions: Options[] = [
  { name: 'None', value: '' },
  { name: 'Mp4', value: '.mp4' },
  { name: 'Flv', value: '.flv' },
  { name: 'MKV', value: '.mkv' },
  { name: 'Ts', value: '.ts' },
  { name: 'Mp3', value: '.mp3' },
  { name: 'Wav', value: '.wav' }
]

export default function ConfigurationComponent ({ cutStart, setCutStart, cutEnd, setCutEnd, volume, setVolume, format, setFormat, handleConvert }: ConfigurationComponentProps) {
  return (
    <div>
      <InputComponent
        label='Time InitCut - HH:MM:SS'
        value={cutStart}
        onChange={(event: any) => { setCutStart(event.target.value) }}
      />
      <InputComponent
        label='Time FinishCut - HH:MM:SS'
        value={cutEnd}
        onChange={(event: any) => { setCutEnd(event.target.value) }}
      />
      <DropDownComponent
        label='Change Volume'
        value={volume}
        onChange={setVolume}
        options={volumeOptions}
      />
      <DropDownComponent
        label='Convert To'
        value={format}
        onChange={setFormat}
        options={formatOptions}
      />
      <ButtonComponent label="Convert" onClick={handleConvert} />

    </div>
  )
}
