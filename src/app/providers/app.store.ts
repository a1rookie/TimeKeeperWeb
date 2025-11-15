/**
 * 应用全局状态管理（客户端状态）
 * 使用 Zustand 管理 UI 状态和用户偏好
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@infrastructure/storage'

export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'zh' | 'en'

interface AppStore {
  // 状态
  theme: ThemeMode
  language: Language
  isOnboarded: boolean

  // Actions
  setTheme: (theme: ThemeMode) => void
  setLanguage: (language: Language) => void
  setOnboarded: (value: boolean) => void
  reset: () => void
}

const initialState = {
  theme: 'system' as ThemeMode,
  language: 'zh' as Language,
  isOnboarded: false,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: ThemeMode) => set({ theme }),

      setLanguage: (language: Language) => set({ language }),

      setOnboarded: (value: boolean) => set({ isOnboarded: value }),

      reset: () => set(initialState),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const value = storage.getItem(name)
          return value ?? null
        },
        setItem: (name: string, value: string) => {
          storage.setItem(name, value)
        },
        removeItem: (name: string) => {
          storage.removeItem(name)
        },
      })),
    }
  )
)
