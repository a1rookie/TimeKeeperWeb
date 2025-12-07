/**
 * 通用 Hooks
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 防抖 Hook
 * @param value 需要防抖的值
 * @param delay 延迟时间(毫秒)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 节流 Hook
 * @param callback 需要节流的函数
 * @param delay 延迟时间(毫秒)
 */
export function useThrottle<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now())

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = now
      }
    },
    [callback, delay]
  )
}

/**
 * 安全的异步状态更新 Hook
 * 避免在组件卸载后更新状态导致内存泄漏
 */
export function useSafeState<T>(initialState: T): [T, (newState: T) => void] {
  const [state, setState] = useState<T>(initialState)
  const mounted = useRef(true)

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const setSafeState = useCallback((newState: T) => {
    if (mounted.current) {
      setState(newState)
    }
  }, [])

  return [state, setSafeState]
}

/**
 * Previous 值 Hook
 * 获取上一次渲染的值
 */
export function usePrevious<T>(value: T): T | undefined {
  // React 19 的类型定义要求为 useRef 提供初始值
  // 我们使用 undefined 来表示尚未有上一次值
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * 倒计时 Hook
 * @param initialSeconds 初始秒数
 */
/**
 * 倒计时 Hook
 * @param initialSeconds 倒计时秒数
 * @returns [countdown秒数, 开始倒计时函数, 重置倒计时函数]
 */
export function useCountdown(initialSeconds: number): [number, () => void, () => void] {
  const [seconds, setSeconds] = useState(0) // 初始状态应该是 0，表示可以发送
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s: number) => s - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const start = useCallback(() => {
    setSeconds(initialSeconds)
    setIsActive(true)
  }, [initialSeconds])

  const reset = useCallback(() => {
    setSeconds(0)
    setIsActive(false)
  }, [])

  return [seconds, start, reset]
}
