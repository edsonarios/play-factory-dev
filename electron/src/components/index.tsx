import { useState, useRef, useMemo } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'
import ConfigurationComponent from './configurationPanel/configurationsIndex'
import ButtonComponent from './configurationPanel/button'
import { Tab } from '@headlessui/react'
import { formatTime, validateDatas } from '@/common/utils'
import { Title } from './title'
import { TabHeader } from './player/tabHeader'
import { Ply } from './player/player'

interface ElectronAPI {
  send: (channel: string, data: any) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

interface Options {
  name: string
  value: string
}

export default function Index() {
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
      global: true,
    },
  }
  const plyrSecondOptions: PlyrOptions = {
    loop: { active: true },
    autoplay: true,
    hideControls: false,
    keyboard: {
      global: false,
    },
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
              provider: 'html5',
            },
          ],
        }}
        options={plyrOptions}
      />
    ),
    [playerRef, videoSrc],
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
              provider: 'html5',
            },
          ],
        }}
        options={plyrSecondOptions}
      />
    ),
    [playerSecondRef, videoSecondSrc],
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
      setCutEnd('00:00:00')
      setCutStart('00:00:00')
      setVideoSrc(url)
      setVideoName(file.name)
    }
  }

  const handleDropElectron = (event: any) => {
    event.preventDefault()
    // Use DataTransferItemList interface to access the file(s)
    if (event.dataTransfer.items !== undefined) {
      if (
        event.dataTransfer.items.length > 0 &&
        event.dataTransfer.items[0].kind === 'file'
      ) {
        const file = event.dataTransfer.items[0].getAsFile()
        console.log('File Path:', file.path)
        console.log(file)
        const url = URL.createObjectURL(file)
        console.log(file.name)
        setCutEnd('00:00:00')
        setCutStart('00:00:00')
        setVolume({ name: 'None', value: '' })
        setFormat({ name: 'None', value: '' })
        setVideoName(file.name)
        setVideoSrc(url)
        setFilePath(file.path)
      }
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

  const handleConvert = (event: any) => {
    event.preventDefault()
    console.log('from Front')
    const requestData = {
      videoName,
      filePath,
      cutStart,
      cutEnd,
      volume: volume.value,
      format: format.value,
    }
    console.log(requestData)
    const validDatas = validateDatas(requestData)
    if (validDatas !== '') {
      alert(`Error ${validDatas}`)
      return
    }
    window.electron.send('convert-video', requestData)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Title />
      <div className="flex flex-col ">
        <div className="">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <TabHeader>Player 1</TabHeader>
              <TabHeader>Player 2</TabHeader>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <Ply
                  plyrComponent={plyrComponent}
                  onDragOver={handleDragOver}
                  onDrop={handleDropElectron}
                  playerRef={playerRef}
                  jumpToSecond={jumpToSecond}
                >
                  <ButtonComponent label="Time Init" onClick={handleStartCut} />
                  <ButtonComponent label="Time End" onClick={handleEndCut} />
                </Ply>
              </Tab.Panel>
              <Tab.Panel>
                <Ply
                  plyrComponent={plyrComponent}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  playerRef={playerRef}
                  jumpToSecond={jumpToSecond}
                >
                  <ButtonComponent label="Time Init" onClick={handleStartCut} />
                  <ButtonComponent label="Time End" onClick={handleEndCut} />
                </Ply>
                <Ply
                  plyrComponent={plyrSecondComponent}
                  onDragOver={handleDragOver}
                  onDrop={handleSecondDrop}
                  playerRef={playerSecondRef}
                  jumpToSecond={jumpSecondToSecond}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Configurations */}
        <div className="">
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
