import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
      },
      
      setTheme: (theme) => {
        set({ theme })
      },
      
      initializeTheme: () => {
        const savedTheme = localStorage.getItem('theme')
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const theme = savedTheme || systemTheme
        set({ theme })
      }
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
)
