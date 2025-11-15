/**
 * 认证状态管理
 * 管理用户登录状态和 token
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage, STORAGE_KEYS } from '@infrastructure/storage'
import type { User } from '@entities/user'

interface AuthStore {
  // 状态
  token: string | null
  user: User | null
  isAuthenticated: boolean

  // Actions
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      setUser: (user: User) => set({ user }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const value = storage.getItem(name)
          return value ?? null
        },
        setItem: (name: string, value: string) => {
          storage.setItem(name, value)
          // 同时存储 token 到独立的 key，供 API 客户端使用
          try {
            const data = JSON.parse(value)
            if (data.state?.token) {
              storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.state.token)
            }
          } catch {
            // Ignore parse errors
          }
        },
        removeItem: (name: string) => {
          storage.removeItem(name)
          storage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        },
      })),
    }
  )
)
