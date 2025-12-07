/**
 * 用户实体类型定义
 * 对应后端 User 模型
 */

export interface User {
  readonly id: number
  phone: string
  nickname?: string
  avatar_url?: string
  settings?: UserSettings
  readonly created_at: string
  readonly updated_at: string
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
  /** 密码 - 密码登录时必填 */
  password?: string
  /** 短信验证码 - 验证码登录时必填 */
  sms_code?: string
}

export interface RegisterRequest {
  phone: string
  password: string
  /** 短信验证码（后端字段名为 sms_code）*/
  sms_code: string
  nickname?: string
}

export interface SendSmsCodeRequest {
  phone: string
  /** 用途: register(注册) | login(登录) | reset(重置密码) */
  purpose?: 'register' | 'login' | 'reset'
}

/** 后端登录返回的 Token 结构 */
export interface Token {
  access_token: string
  token_type: string
}

/** 前端使用的认证响应（包含 token 和 user）*/
export interface AuthResponse {
  token: string
  user: User
}
