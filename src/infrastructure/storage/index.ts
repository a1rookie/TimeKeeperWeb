/**
 * 本地存储适配器
 * 基于 react-native-mmkv 的高性能存储方案
 */

import { MMKV } from 'react-native-mmkv'

export class Storage {
  private storage: MMKV

  constructor() {
    this.storage = new MMKV({
      id: 'timekeeper-storage',
      encryptionKey: 'timekeeper-secret-key-2024', // 生产环境应使用安全的密钥管理
    })
  }

  /**
   * 存储字符串值
   */
  setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  /**
   * 获取字符串值
   */
  getItem(key: string): string | undefined {
    return this.storage.getString(key)
  }

  /**
   * 存储对象（自动序列化）
   */
  setObject<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value))
  }

  /**
   * 获取对象（自动反序列化）
   */
  getObject<T>(key: string): T | undefined {
    const value = this.storage.getString(key)
    if (!value) return undefined

    try {
      return JSON.parse(value) as T
    } catch {
      return undefined
    }
  }

  /**
   * 存储布尔值
   */
  setBoolean(key: string, value: boolean): void {
    this.storage.set(key, value)
  }

  /**
   * 获取布尔值
   */
  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key)
  }

  /**
   * 存储数字
   */
  setNumber(key: string, value: number): void {
    this.storage.set(key, value)
  }

  /**
   * 获取数字
   */
  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key)
  }

  /**
   * 删除指定键
   */
  removeItem(key: string): void {
    this.storage.delete(key)
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    this.storage.clearAll()
  }

  /**
   * 检查键是否存在
   */
  hasKey(key: string): boolean {
    return this.storage.contains(key)
  }

  /**
   * 获取所有键
   */
  getAllKeys(): string[] {
    return this.storage.getAllKeys()
  }
}

// 导出单例
export const storage = new Storage()

// 常用的存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDED: 'is_onboarded',
  LAST_SYNC_TIME: 'last_sync_time',
} as const

export default storage
