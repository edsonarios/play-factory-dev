import { type StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FFmpegStoreType {
  isFFmpegInstalled: boolean
  setIsFFmpegInstalled: (isFFmpegInstalled: boolean) => void

  showModalStatus: boolean
  setShowModalStatus: (showModalStatus: boolean) => void

  messageFFmpegError: string
  setMessageFFmpegError: (messageError: string) => void
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
})

export const useFFmpegStore = create<FFmpegStoreType>()(
  persist(storeFFmpeg, {
    name: 'ffmpeg-storage',
    partialize: (state) => ({
      // isFFmpegInstalled: state.isFFmpegInstalled,
    }),
  }),
)
