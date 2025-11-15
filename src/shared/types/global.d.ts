/**
 * 全局类型定义
 * React Native 和第三方库的类型声明
 */

/// <reference types="react-native" />

declare global {
  // React Native 开发环境标志
  const __DEV__: boolean

  // 全局变量声明
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      API_BASE_URL?: string
      JPUSH_APP_KEY?: string
    }
  }

  // Fetch API 全局类型（React Native 已内置）
  interface Response {
    readonly ok: boolean
    readonly status: number
    readonly statusText: string
    json(): Promise<any>
  }

  // AbortController 全局类型（React Native 已内置）
  interface AbortController {
    readonly signal: AbortSignal
    abort(): void
  }

  interface AbortSignal {
    readonly aborted: boolean
  }

  // 定时器全局函数（React Native 已内置）
  function setTimeout(handler: () => void, timeout: number): number
  function clearTimeout(handle: number): void
}

export {}
