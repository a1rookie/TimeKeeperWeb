/**
 * 用户服务
 * 封装所有用户相关的 API 调用
 */

import { apiClient } from '../api/client'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  SendSmsCodeRequest,
  AuthResponse,
  Token,
} from '@entities/user'

class UserService {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    const response = await apiClient.post<AuthResponse>('/api/v1/users/register', data)
    return response.data
  }

  /**
   * 用户登录
   * 后端返回 Token，需额外调用 /users/me 获取用户信息
   */
  async login(data: LoginRequest) {
    const response = await apiClient.post<Token>('/api/v1/users/login', data)
    // 登录后立即获取用户信息
    const userResponse = await apiClient.get<User>('/api/v1/users/me')
    return {
      token: response.data.access_token,
      user: userResponse.data,
    } as AuthResponse
  }

  /**
   * 发送短信验证码
   */
  async sendSmsCode(data: SendSmsCodeRequest) {
    const response = await apiClient.post<{ message: string }>('/api/v1/users/send_sms_code', data)
    return response.data
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await apiClient.get<User>('/api/v1/users/me')
    return response.data
  }

  /**
   * 更新用户信息
   */
  async updateUser(data: Partial<User>) {
    const response = await apiClient.put<User>('/api/v1/users/me', data)
    return response.data
  }

  /**
   * 退出登录
   */
  async logout() {
    const response = await apiClient.post<{ message: string }>('/api/v1/users/logout')
    return response.data
  }
}

export const userService = new UserService()
export default userService
