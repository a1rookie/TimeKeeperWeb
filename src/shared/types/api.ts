/**
 * 统一 API 响应类型
 * 确保类型安全的后端响应处理
 */

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiError {
  code: number
  message: string
  details?: Record<string, unknown>
}

export class ApiErrorException extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiErrorException'
  }
}
