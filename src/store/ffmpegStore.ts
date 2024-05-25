import { type StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface IStatusDownload {
  message: string
  percentage: number
  totalLength: string
  elapsedLength: string
  completed: boolean
  error: string
}

export interface FFmpegStoreType {
  isFFmpegInstalled: boolean
  setIsFFmpegInstalled: (isFFmpegInstalled: boolean) => void

  showModalStatus: boolean
  setShowModalStatus: (showModalStatus: boolean) => void

  messageFFmpegError: string
  setMessageFFmpegError: (messageError: string) => void

  statusDownload: IStatusDownload | null
  setStatusDownload: (statusDownload: IStatusDownload | null) => void
}

const storeFFmpeg: StateCreator<FFmpegStoreType> = (set) => ({
  isFFmpegInstalled: false,
  setIsFFmpegInstalled: (isFFmpegInstalled) => {
    set({ isFFmpegInstalled })
  },

  showModalStatus: false,
  setShowModalStatus: (showModalStatus) => {
    set({ showModalStatus })
  },

  messageFFmpegError: '',
  setMessageFFmpegError: (messageFFmpegError) => {
    set({ messageFFmpegError })
  },

  statusDownload: null,
  setStatusDownload: (statusDownload) => {
    set({ statusDownload })
  },
})

export const useFFmpegStore = create<FFmpegStoreType>()(
  persist(storeFFmpeg, {
    name: 'ffmpeg-storage',
    partialize: (state) => ({
      isFFmpegInstalled: state.isFFmpegInstalled,
    }),
  }),
)
