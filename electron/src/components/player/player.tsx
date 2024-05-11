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
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="w-full flex flex-col"
    >
      <div id="singlePlayer">{plyrComponent}</div>
      <h3 id="additionalTId">Additional controls:</h3>
      <div id="additionalCId" className="flex flex-row">
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
