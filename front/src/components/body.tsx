import { useState, useRef, useMemo } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'
import ConfigurationComponent from './configurationPanel/configurations'
import ButtonComponent from './button'
import { formatTime, validateDatas } from '../common/utils'
import axios from 'axios'
import { Tab } from '@headlessui/react'
interface Options {
  name: string
  value: string
}

export default function BodyPlayerComponent () {
  const playerRef = useRef<APITypes>(null)
  const playerSecondRef = useRef<APITypes>(null)
  const [videoName, setVideoName] = useState<string>('')
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [videoSecondSrc, setVideoSecondSrc] = useState<string>('')
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
    }
  }

  const handleEndCut = () => {
    if (playerRef?.current !== null) {
      const currenTime = playerRef.current.plyr.currentTime
      setCutEnd(formatTime(currenTime))
    }
  }

  const jumpToSecond = (seconds: number | null) => {
    if (playerRef?.current !== null && seconds !== null) {
      const player = playerRef.current.plyr
      player.currentTime = seconds
    }
  }

  const jumpSecondToSecond = (seconds: number | null) => {
    if (playerSecondRef?.current !== null && seconds !== null) {
      const player = playerSecondRef.current.plyr
      player.currentTime = seconds
    }
  }

  const plyrComponent = useMemo(
    () => (
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
    ),
    [playerRef, videoSrc]
  )

  const plyrSecondComponent = useMemo(
    () => (
      <Plyr
        ref={playerSecondRef}
        source={{
          type: 'video',
          sources: [
            {
              src: videoSecondSrc,
              provider: 'html5'
            }
          ]
        }}
        options={{ ...plyrOptions, keyboard: { global: false } }}
      />
    ),
    [playerSecondRef, videoSecondSrc]
  )

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDrop = (event: any) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (Boolean(files) && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      console.log(url)
      setCutEnd('00:00:00')
      setCutStart('00:00:00')
      setVideoSrc(url)
      setVideoName(file.name)
    }
  }

  const handleSecondDrop = (event: any) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (Boolean(files) && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setVideoSecondSrc(url)
    }
  }

  const handleConvert = async (event: any) => {
    event.preventDefault()
    console.log('Convert')
    const requestData = {
      videoName,
      filePath,
      cutStart,
      cutEnd,
      volume: volume.value,
      format: format.value
    }
    console.log(requestData)
    const validDatas = validateDatas(requestData)
    if (validDatas !== '') {
      alert(`Error ${validDatas}`)
      return
    }
    try {
      const response = await axios.post(
        'http://localhost:3100/conversor',
        requestData
      )
      console.log('Result', response.data)
    } catch (error) {
      console.error('Error', error)
    }
  }

  function classNames (...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <div className="w-4/6 max-w-4xl">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Player 1
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Player 2
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                  {plyrComponent}
                  {/* Additional Controls */}
                  <h3>Additional controls:</h3>
                  <ButtonComponent
                    label="-1 Sec"
                    onClick={() => {
                      if (playerRef?.current !== null) {
                        jumpToSecond(playerRef.current.plyr.currentTime - 1)
                      }
                    }}
                  />
                  <ButtonComponent
                    label="+1 Sec"
                    onClick={() => {
                      if (playerRef?.current !== null) {
                        jumpToSecond(playerRef.current.plyr.currentTime + 1)
                      }
                    }}
                  />
                  <ButtonComponent label="Time Init" onClick={handleStartCut} />
                  <ButtonComponent label="Time End" onClick={handleEndCut} />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                  {plyrComponent}
                  {/* Additional Controls */}
                  <h3>Additional controls:</h3>
                  <ButtonComponent
                    label="-1 Sec"
                    onClick={() => {
                      if (playerRef?.current !== null) {
                        jumpToSecond(playerRef.current.plyr.currentTime - 1)
                      }
                    }}
                  />
                  <ButtonComponent
                    label="+1 Sec"
                    onClick={() => {
                      if (playerRef?.current !== null) {
                        jumpToSecond(playerRef.current.plyr.currentTime + 1)
                      }
                    }}
                  />
                  <ButtonComponent label="Time Init" onClick={handleStartCut} />
                  <ButtonComponent label="Time End" onClick={handleEndCut} />
                </div>
                <div onDragOver={handleDragOver} onDrop={handleSecondDrop}>
                  {plyrSecondComponent}
                  {/* Additional Controls */}
                  <h3>Additional controls:</h3>
                  <ButtonComponent
                    label="-1 Sec"
                    onClick={() => {
                      if (playerSecondRef?.current !== null) {
                        jumpSecondToSecond(playerSecondRef.current.plyr.currentTime - 1)
                      }
                    }}
                  />
                  <ButtonComponent
                    label="+1 Sec"
                    onClick={() => {
                      if (playerSecondRef?.current !== null) {
                        jumpSecondToSecond(playerSecondRef.current.plyr.currentTime + 1)
                      }
                    }}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
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
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
