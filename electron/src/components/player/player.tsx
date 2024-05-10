import { type APITypes } from 'plyr-react'
import ButtonComponent from '../configurationPanel/button'

export function Ply({
  plyrComponent,
  onDragOver,
  onDrop,
  playerRef,
  jumpToSecond,
  children,
}: {
  plyrComponent: JSX.Element
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  playerRef: React.MutableRefObject<APITypes | null>
  jumpToSecond: (time: number) => void
  children?: React.ReactNode
}) {
  return (
    <div onDragOver={onDragOver} onDrop={onDrop} className="w-full">
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
      {children}
    </div>
  )
}
