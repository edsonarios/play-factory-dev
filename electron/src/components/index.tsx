import { useState, useRef, useMemo, useEffect } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'
import ConfigurationComponent from './configurationPanel/configurationsIndex'
import ButtonComponent from './configurationPanel/button'
import { formatTime, validateDatas } from '@/common/utils'
import { Title } from './title'
import { Ply } from './player/player'
import { TabHeader } from './player/tabHeader'
import ModalConvertionStatus from './modal/modalStatusConvert'

interface ElectronAPI {
  send: (channel: string, data: any) => void
  sendEvent: (channel: string) => void
  receive: (channel: string, func: (event: any, ...args: any[]) => void) => void
  removeListener: (channel: string, func: (...args: any[]) => void) => void
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

export default function IndexComponent() {
  const playerRef = useRef<APITypes>(null)
  const playerSecondRef = useRef<APITypes>(null)
  const [videoName, setVideoName] = useState<string>('')
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [videoSecondSrc, setVideoSecondSrc] = useState<string>('')
  const [cutStart, setCutStart] = useState<string>('00:00:00')
  const [cutEnd, setCutEnd] = useState<string>('00:00:00')
  const [volume, setVolume] = useState<Options>({
    name: 'Not Change',
    value: '',
  })
  const [format, setFormat] = useState<Options>({
    name: 'Not Change',
    value: '',
  })
  const [filePath, setFilePath] = useState<string>(' ')

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

  const handleDropElectron = (event: any) => {
    event.preventDefault()
    // Use DataTransferItemList interface to access the file(s)
    if (event.dataTransfer.items !== undefined) {
      if (
        event.dataTransfer.items.length > 0 &&
        event.dataTransfer.items[0].kind === 'file'
      ) {
        const file = event.dataTransfer.items[0].getAsFile()
        const url = URL.createObjectURL(file)
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
    const requestData = {
      videoName,
      filePath,
      cutStart,
      cutEnd,
      volume: volume.value,
      format: format.value,
    }
    const validDatas = validateDatas(requestData)
    if (validDatas !== '') {
      alert(`Error ${validDatas}`)
      return
    }
    window.electron.send('start-conversion', requestData)
  }

  const [selectTab, setSelectTab] = useState(0)
  // resize player
  const appContainerRef = useRef<HTMLDivElement>(null)
  const updatePlayerSize = () => {
    if (appContainerRef.current !== null) {
      const titlePlace = document.getElementById('titleId')
      const configPlace = document.getElementById('configurationId')
      const additionalTPlace = document.getElementById('additionalTId')
      const additionalCPlace = document.getElementById('additionalCId')
      const tabsPlace = document.getElementById('tabsId')
      const playerWrapper: NodeListOf<HTMLElement> = document.querySelectorAll(
        '.plyr__video-wrapper',
      )
      if (
        playerWrapper !== null &&
        titlePlace !== null &&
        configPlace !== null &&
        additionalCPlace !== null &&
        tabsPlace !== null &&
        additionalTPlace !== null
      ) {
        const appWidth = appContainerRef.current.offsetWidth
        let appHeight
        let aspectRatio
        if (selectTab === 0) {
          aspectRatio = 16 / 9
          appHeight =
            appContainerRef.current.offsetHeight -
            (titlePlace.offsetHeight +
              configPlace.offsetHeight +
              additionalCPlace.offsetHeight +
              tabsPlace.offsetHeight +
              additionalTPlace.offsetHeight)
        } else {
          aspectRatio = 16 / 8
          appHeight = appContainerRef.current.offsetHeight
        }

        let playerHeight = appHeight
        let playerWidth = +(appHeight * aspectRatio).toFixed(0)

        if (playerWidth > appWidth) {
          playerWidth = appWidth
          playerHeight = +(appWidth / aspectRatio).toFixed(0)
        }

        if (playerHeight > appHeight) {
          playerHeight = appHeight
          playerWidth = +(playerHeight * aspectRatio).toFixed(0)
        }
        if (selectTab === 0) {
          playerWrapper.forEach((element) => {
            element.style.maxWidth = `${playerWidth}px`
            element.style.minWidth = `${playerWidth}px`
            element.style.maxHeight = `${playerHeight}px`
            element.style.minHeight = `${playerHeight}px`
          })
        }
        if (selectTab === 1) {
          const doublePlayerWidth = playerWidth / 2
          const doublePlayerHeight = playerHeight / 2
          playerWrapper.forEach((element) => {
            element.style.maxWidth = `${doublePlayerWidth}px`
            element.style.minWidth = `${doublePlayerWidth}px`
            element.style.maxHeight = `${doublePlayerHeight}px`
            element.style.minHeight = `${doublePlayerHeight}px`
          })
        }
      }
    }
  }

  useEffect(() => {
    updatePlayerSize()
    window.addEventListener('resize', updatePlayerSize)
    return () => {
      window.removeEventListener('resize', updatePlayerSize)
    }
  }, [selectTab, videoSrc, videoSecondSrc])

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

  // Listen to loading status
  useEffect(() => {
    const debugParams = async (_event: any, action: string) => {
      console.log('debug: ', action)
    }

    window.electron.receive('ffmpeg-status', debugParams)

    return () => {
      window.electron.removeListener('ffmpeg-status', debugParams)
    }
  }, [])

  return (
    <div
      ref={appContainerRef}
      className="flex flex-col items-center justify-start h-screen mx-4 "
    >
      <Title />
      <div className="flex flex-col justify-center items-center">
        <div id="tabsId" className="flex flex-row min-w-[500px]">
          <TabHeader
            label="Single Player"
            selectTab={0}
            currentTab={selectTab}
            setSelectTab={setSelectTab}
          />
          <TabHeader
            label="Double Player"
            selectTab={1}
            currentTab={selectTab}
            setSelectTab={setSelectTab}
          />
        </div>
        {selectTab === 0 ? (
          <div className="">
            <Ply
              idPlayer="player1"
              plyrComponent={plyrComponent}
              onDragOver={handleDragOver}
              onDrop={handleDropElectron}
              playerRef={playerRef}
              jumpToSecond={jumpToSecond}
            >
              <ButtonComponent label="Cut Init" onClick={handleStartCut} />
              <ButtonComponent label="Cut End" onClick={handleEndCut} />
            </Ply>
          </div>
        ) : (
          <div
            id="doublePlayer"
            className="player-wrapper flex flex-row justify-between"
          >
            <Ply
              idPlayer="player1"
              plyrComponent={plyrComponent}
              onDragOver={handleDragOver}
              onDrop={handleDropElectron}
              playerRef={playerRef}
              jumpToSecond={jumpToSecond}
            >
              <ButtonComponent label="Cut Init" onClick={handleStartCut} />
              <ButtonComponent label="Cut End" onClick={handleEndCut} />
            </Ply>
            <Ply
              idPlayer="player2"
              plyrComponent={plyrSecondComponent}
              onDragOver={handleDragOver}
              onDrop={handleSecondDrop}
              playerRef={playerSecondRef}
              jumpToSecond={jumpSecondToSecond}
            />
          </div>
        )}

        {/* Configurations */}
        <div id="configurationId" className="w-full">
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
      <ModalConvertionStatus filePath={filePath} />
    </div>
  )
}
