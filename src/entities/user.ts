/**
 * 用户实体类型定义
 * 对应后端 User 模型
 */

export interface User {
  readonly id: string
  phone: string
  nickname?: string
  avatar?: string
  settings?: UserSettings
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  remindChannels: RemindChannel[]
  quietHours?: {
    enabled: boolean
    startTime: string // HH:mm
    endTime: string // HH:mm
  }
}

export type RemindChannel = 'app' | 'sms' | 'wechat' | 'voice'

export interface LoginRequest {
  phone: string
  password: string
}

export interface RegisterRequest {
  phone: string
  password: string
  smsCode: string
  nickname?: string
}

export interface SendSmsCodeRequest {
  phone: string
}

export interface AuthResponse {
  token: string
  user: User
}
