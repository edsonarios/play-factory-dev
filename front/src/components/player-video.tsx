import { useState, useRef } from 'react'
import Plyr, { type APITypes, type PlyrOptions } from 'plyr-react'

function PlyrComponent () {
  const [videoSrc, setVideoSrc] = useState('')
  const playerRef = useRef<APITypes>(null)
  const [cutStart, setCutStart] = useState<number | null>(null)
  const [cutEnd, setCutEnd] = useState<number | null>(null)

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
      const player = playerRef.current.plyr
      setCutStart(player.currentTime)
    }
  }

  const handleEndCut = () => {
    if (playerRef?.current !== null) {
      const player = playerRef.current.plyr
      setCutEnd(player.currentTime)
    }
  }

  const jumpToSecond = (seconds: number | null) => {
    if (playerRef?.current !== null && seconds !== null) {
      const player = playerRef.current.plyr
      player.currentTime = seconds
    }
  }

  console.log(cutStart, cutEnd, videoSrc)

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDrop = (event: any) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (Boolean(files) && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className='flex flex-wrap justify-center gap-4 mb-4'>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          // style={{ width: '100%', height: '400px', border: '1px dashed #ccc' }}
          className="w-4/6"
        >
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
          <button
            onClick={() => {
              if (playerRef?.current !== null) {
                jumpToSecond(playerRef.current.plyr.currentTime - 1)
              }
            }}
          >
            Retroceder 1s
          </button>
          <button
            onClick={() => {
              if (playerRef?.current !== null) {
                jumpToSecond(playerRef.current.plyr.currentTime + 1)
              }
            }}
          >
            Avanzar 1s
          </button>
          <button onClick={handleStartCut}>Marcar Inicio</button>
          <button onClick={handleEndCut}>Marcar Fin</button>d
        </div>

        {/* Configurations */}
        <div className="w-1/6">
          some text
          {/* <input>src</input> */}
        </div>
      </div>
    </div>
  )
}

export default PlyrComponent
