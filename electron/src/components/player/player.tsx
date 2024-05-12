import { type APITypes } from 'plyr-react'
import ButtonComponent from '../configurationPanel/button'

export function Ply({
  idPlayer,
  plyrComponent,
  onDragOver,
  onDrop,
  playerRef,
  jumpToSecond,
  children,
}: {
  idPlayer: string
  plyrComponent: JSX.Element
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  playerRef: React.MutableRefObject<APITypes | null>
  jumpToSecond: (time: number) => void
  children?: React.ReactNode
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="w-full flex flex-col"
    >
      <div id={idPlayer}>{plyrComponent}</div>
      <div id="additionalCId" className="flex flex-row gap-x-2 mt-2 flex-wrap">
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
        {children}
      </div>
    </div>
  )
}
