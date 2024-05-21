import { type StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FFmpegStoreType {
  isFFmpegInstalled: boolean
  setIsFFmpegVersion: (isFFmpegInstalled: boolean) => void

  showModalStatus: boolean
  setShowModalStatus: (showModalStatus: boolean) => void
}

const storeFFmpeg: StateCreator<FFmpegStoreType> = (set) => ({
  isFFmpegInstalled: false,
  setIsFFmpegVersion: (isFFmpegInstalled) => {
    set({ isFFmpegInstalled })
  },

  showModalStatus: false,
  setShowModalStatus: (showModalStatus) => {
    set({ showModalStatus })
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
