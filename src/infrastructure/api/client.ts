/**
 * 现代化类型安全的 API 客户端
 * 基于 Fetch API，支持请求/响应拦截、错误处理、超时控制
 */

import config from '../config'
import { Storage } from '../storage/index'
import type { ApiResponse } from '@shared/types/api'
import { ApiErrorException } from '@shared/types/api'

// 创建storage实例
const storage = new Storage()

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, string | number | boolean>
  data?: unknown
  headers?: Record<string, string>
  timeout?: number
  skipAuth?: boolean
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  /**
   * 通用请求方法
   */
  async request<T>(requestConfig: RequestConfig): Promise<ApiResponse<T>> {
    const { url, method = 'GET', params, data, headers = {}, timeout, skipAuth } = requestConfig

    // 构建完整 URL
    const fullUrl = this.buildUrl(url, params)

    // 构建请求头
    const requestHeaders = await this.buildHeaders(headers, skipAuth)

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout ?? this.timeout)

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // 处理响应
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)
      throw this.handleError(error)
    }
  }

  /**
   * GET 请求
   */
  get<T>(url: string, params?: Record<string, string | number | boolean>) {
    if (params) {
      return this.request<T>({ url, method: 'GET', params })
    }
    return this.request<T>({ url, method: 'GET' })
  }

  /**
   * POST 请求
   */
  post<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: 'POST', data })
  }

  /**
   * PUT 请求
   */
  put<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: 'PUT', data })
  }

  /**
   * DELETE 请求
   */
  delete<T>(url: string) {
    return this.request<T>({ url, method: 'DELETE' })
  }

  /**
   * PATCH 请求
   */
  patch<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: 'PATCH', data })
  }

  /**
   * 构建完整 URL
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>) {
    const fullUrl = `${this.baseURL}${url}`

    if (!params || Object.keys(params).length === 0) {
      return fullUrl
    }

    const queryParams: string[] = []
    Object.entries(params).forEach(([key, value]) => {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    })

    return `${fullUrl}?${queryParams.join('&')}`
  }

  /**
   * 构建请求头
   */
  private async buildHeaders(
    customHeaders: Record<string, string>,
    skipAuth?: boolean
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    // 添加认证 token
    if (!skipAuth) {
      const token = await storage.getItem('auth_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    // 添加 X-Device-Type header（用于后端单点登录/互踢机制）
    if (!headers['X-Device-Type']) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { Platform } = require('react-native')
        if (Platform && Platform.OS) {
          // android -> 'android', ios -> 'ios', 其他 -> 'web'
          headers['X-Device-Type'] = Platform.OS === 'android' ? 'android' : Platform.OS === 'ios' ? 'ios' : 'web'
        }
      } catch (e) {
        // 非 RN 环境（如测试），默认为 'web'
        headers['X-Device-Type'] = 'web'
      }
    }

    return headers
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // 尝试解析 JSON
    let responseData: ApiResponse<T>
    try {
      responseData = await response.json()
    } catch {
      throw new ApiErrorException(response.status, 'Invalid JSON response')
    }

    // 检查 HTTP 状态码
    if (!response.ok) {
      throw new ApiErrorException(
        responseData.code || response.status,
        responseData.message || response.statusText
      )
    }

    // 检查业务状态码
    if (responseData.code !== 200) {
      throw new ApiErrorException(responseData.code, responseData.message)
    }

    return responseData
  }

  /**
   * 处理错误
   */
  private handleError(error: unknown): ApiErrorException {
    if (error instanceof ApiErrorException) {
      return error
    }

    if (error instanceof Error) {
      // 网络错误
      if (error.name === 'AbortError') {
        return new ApiErrorException(408, 'Request timeout')
      }

      // 其他错误
      return new ApiErrorException(0, error.message)
    }

    return new ApiErrorException(0, 'Unknown error occurred')
  }
}

// 导出单例
export const apiClient = new ApiClient(config.apiBaseUrl, config.apiTimeout)

export default apiClient
