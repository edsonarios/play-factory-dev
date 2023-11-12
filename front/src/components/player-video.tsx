import { useState, useRef, useMemo } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'
import ConfigurationComponent from './configurationPanel/configurations'
import ButtonComponent from './button'
import { formatTime } from '../common/utils'
import axios from 'axios'
interface Options {
  name: string
  value: string
}

export default function Conversor () {
  const playerRef = useRef<APITypes>(null)
  const [videoName, setVideoName] = useState<string>('')
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [cutStart, setCutStart] = useState<string>('00:00:00')
  const [cutEnd, setCutEnd] = useState<string>('00:00:00')
  const [volume, setVolume] = useState<Options>({ name: 'None', value: '' })
  const [format, setFormat] = useState<Options>({ name: 'None', value: '' })
  const [filePath, setFilePath] = useState<string>('')

  const plyrOptions: PlyrOptions = {
    loop: { active: true },
    autoplay: true,
    hideControls: false,
    keyboard: {
      global: true
    }
  }

  const handleStartCut = () => {
    if (playerRef?.current !== null) {
      const currenTime = playerRef.current.plyr.currentTime
      setCutStart(formatTime(currenTime))
      console.log(currenTime)
      console.log(formatTime(currenTime))
    }
  }

  const handleEndCut = () => {
    if (playerRef?.current !== null) {
      const currenTime = playerRef.current.plyr.currentTime
      setCutEnd(formatTime(currenTime))
      console.log(currenTime)
      console.log(formatTime(currenTime))
    }
  }

  const jumpToSecond = (seconds: number | null) => {
    if (playerRef?.current !== null && seconds !== null) {
      const player = playerRef.current.plyr
      player.currentTime = seconds
    }
  }

  const plyrComponent = useMemo(() => (
    <Plyr
      ref={playerRef}
      source={{
        type: 'video',
        sources: [
          {
            src: videoSrc,
            provider: 'html5'
          }
        ]
      }}
      options={plyrOptions}
    />
  ), [playerRef, videoSrc])

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDrop = (event: any) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (Boolean(files) && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setCutEnd('00:00:00')

      setCutStart('00:00:00')
      setVideoSrc(url)
      setVideoName(file.name)
      console.log('url changed')
    }
  }

  const handleConvert = async (event: any) => {
    event.preventDefault()
    console.log('------------------------')
    console.log(videoName)
    console.log(videoSrc)
    console.log(filePath)
    console.log(cutStart)
    console.log(cutEnd)
    console.log(volume)
    console.log(format)
    const requestData = {
      videoName,
      filePath,
      cutStart,
      cutEnd,
      volume: volume.value,
      format: format.value
    }

    try {
      const response = await axios.post('http://localhost:3100/conversor', requestData)
      console.log('Resultado de la conversión:', response.data)
    } catch (error) {
      console.error('Error en la solicitud:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <div onDragOver={handleDragOver} onDrop={handleDrop} className="w-4/6">
          {plyrComponent}
          {/* Additional Controls */}
          <h3>Additional controls:</h3>
          <ButtonComponent label="-1 Sec" onClick={() => {
            if (playerRef?.current !== null) {
              jumpToSecond(playerRef.current.plyr.currentTime - 1)
            }
          }} />
          <ButtonComponent label="+1 Sec" onClick={() => {
            if (playerRef?.current !== null) {
              jumpToSecond(playerRef.current.plyr.currentTime + 1)
            }
          }} />
          <ButtonComponent label="Time Init" onClick={handleStartCut} />
          <ButtonComponent label="Time End" onClick={handleEndCut} />

        </div>

        {/* Configurations */}
        <div className="w-1/6">
          <ConfigurationComponent
            filePath={filePath}
            setFilePath={setFilePath}
            cutStart={cutStart}
            setCutStart={setCutStart}
            cutEnd={cutEnd}
            setCutEnd={setCutEnd}
            handleConvert={handleConvert}
            volume={volume}
            setVolume={setVolume}
            format={format}
            setFormat={setFormat}
           />
        </div>
      </div>
    </div>
  )
}
