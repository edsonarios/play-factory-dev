import { useState, useRef, useMemo, useEffect } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'
import ConfigurationComponent from './configurationPanel/configurationsIndex'
import ButtonComponent from './configurationPanel/button'
import { formatTime, validateDatas } from '@/common/utils'
import { Title } from './title'
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

  // resize player
  const appContainerRef = useRef<HTMLDivElement>(null)
  // const playerContainerRef = useRef<HTMLDivElement>(null)
  const updatePlayerSize = () => {
    if (appContainerRef.current !== null) {
      const playersPlace = document.getElementById('singlePlayer')
      const titlePlace = document.getElementById('titleId')
      const configPlace = document.getElementById('configurationId')
      const additionalTPlace = document.getElementById('additionalTId')
      const additionalCPlace = document.getElementById('additionalCId')
      const tabsPlace = document.getElementById('tabsId')
      const playerWrapper = document.querySelector(
        '.plyr__video-wrapper',
      ) as HTMLElement

      if (
        playerWrapper !== null &&
        titlePlace !== null &&
        configPlace !== null &&
        playersPlace !== null &&
        additionalCPlace !== null &&
        tabsPlace !== null &&
        additionalTPlace !== null
      ) {
        const appWidth = appContainerRef.current.offsetWidth
        const appHeight =
          appContainerRef.current.offsetHeight -
          (titlePlace.offsetHeight +
            configPlace.offsetHeight +
            additionalCPlace.offsetHeight +
            tabsPlace.offsetHeight +
            additionalTPlace.offsetHeight)

        console.log(
          'appContainerRef: ',
          appContainerRef.current.offsetHeight,
          'appHeight: ',
          appHeight,
          'titlePlace: ',
          titlePlace.offsetHeight,
          'configPlace: ',
          configPlace.offsetHeight,
          'additionalCPlace: ',
          additionalCPlace.offsetHeight,
        )

        const aspectRatio = 16 / 8

        let playerHeight = appHeight
        let playerWidth = appHeight * aspectRatio

        if (playerWidth > appWidth) {
          playerWidth = appWidth
          playerHeight = appWidth / aspectRatio
        }

        if (playerHeight > appHeight) {
          playerHeight = appHeight
          playerWidth = playerHeight * aspectRatio
        }
        playerWrapper.style.maxWidth = `${playerWidth}px`
        playerWrapper.style.minWidth = `${playerWidth}px`
        playerWrapper.style.maxHeight = `${playerHeight}px`
        playerWrapper.style.minHeight = `${playerHeight}px`
      }
    }
  }

  useEffect(() => {
    updatePlayerSize()
    window.addEventListener('resize', updatePlayerSize)
    return () => {
      window.removeEventListener('resize', updatePlayerSize)
    }
  }, [videoSrc])

  // Event full screen
  useEffect(() => {
    const handleFullScreen = (event: any) => {
      if (event.target !== undefined) {
        const playerWrapper = document.querySelector(
          '.plyr__video-wrapper',
        ) as HTMLElement
        if (playerWrapper !== null) {
          playerWrapper.style.maxWidth = 'none'
          playerWrapper.style.minWidth = 'none'
          playerWrapper.style.maxHeight = 'none'
          playerWrapper.style.minHeight = 'none'
        }
      }
    }
    window.addEventListener('enterfullscreen', handleFullScreen)

    return () => {
      window.removeEventListener('enterfullscreen', handleFullScreen)
    }
  }, [])

  const [selectTab, setSelectTab] = useState(0)

  return (
    <div
      ref={appContainerRef}
      className="flex flex-col items-center justify-start h-screen px-4"
    >
      <Title />
      <div className="flex flex-col justify-center items-center">
        <div id="tabsId" className="flex flex-row w-full">
          <button
            className={`headerButton ${selectTab === 0 ? 'bg-white' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`}
            onClick={() => {
              setSelectTab(0)
            }}
          >
            Single Player
          </button>
          <button
            className={`headerButton ${selectTab === 1 ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`}
            onClick={() => {
              setSelectTab(1)
            }}
          >
            Double Player
          </button>
        </div>
        {selectTab === 0 ? (
          <div className="">
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
          </div>
        ) : (
          <div id="doublePlayer" className="flex flex-row">
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
            <Ply
              plyrComponent={plyrSecondComponent}
              onDragOver={handleDragOver}
              onDrop={handleSecondDrop}
              playerRef={playerSecondRef}
              jumpToSecond={jumpSecondToSecond}
            />
          </div>
        )}

        {/* Configurations */}
        <div id="configurationId" className="pb-4">
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
