/**
 * 模板服务
 */

import { apiClient } from '@infrastructure/api/client'
import type {
  ReminderTemplate,
  UserCustomTemplate,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateQueryParams,
  UseTemplateRequest,
} from '@entities/template'

export class TemplateService {
  /**
   * 获取公共模板列表
   * TODO: 传递 query params 需要优化 API 客户端类型
   */
  async getPublicTemplates(_params?: TemplateQueryParams): Promise<ReminderTemplate[]> {
    const response = await apiClient.get<ReminderTemplate[]>('/api/v1/templates/public')
    return response.data
  }

  /**
   * 获取用户的自定义模板
   */
  async getMyTemplates(): Promise<UserCustomTemplate[]> {
    const response = await apiClient.get<UserCustomTemplate[]>('/api/v1/templates/my')
    return response.data
  }

  /**
   * 获取模板详情
   */
  async getTemplate(id: string): Promise<ReminderTemplate> {
    const response = await apiClient.get<ReminderTemplate>(`/api/v1/templates/${id}`)
    return response.data
  }

  /**
   * 创建自定义模板
   */
  async createTemplate(data: CreateTemplateRequest): Promise<UserCustomTemplate> {
    const response = await apiClient.post<UserCustomTemplate>('/api/v1/templates', data)
    return response.data
  }

  /**
   * 更新自定义模板
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<UserCustomTemplate> {
    const response = await apiClient.put<UserCustomTemplate>(`/api/v1/templates/${id}`, data)
    return response.data
  }

  /**
   * 删除自定义模板
   */
  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/templates/${id}`)
  }

  /**
   * 使用模板创建提醒
   */
  async useTemplate(data: UseTemplateRequest): Promise<void> {
    await apiClient.post('/api/v1/templates/use', data)
  }

  /**
   * 点赞模板
   */
  async likeTemplate(id: string): Promise<void> {
    await apiClient.post(`/api/v1/templates/${id}/like`)
  }

  /**
   * 取消点赞
   */
  async unlikeTemplate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/templates/${id}/like`)
  }

  /**
   * 收藏模板
   */
  async favoriteTemplate(id: string): Promise<void> {
    await apiClient.post(`/api/v1/templates/${id}/favorite`)
  }

  /**
   * 取消收藏
   */
  async unfavoriteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/templates/${id}/favorite`)
  }

  /**
   * 获取收藏的模板
   */
  async getFavoriteTemplates(): Promise<ReminderTemplate[]> {
    const response = await apiClient.get<ReminderTemplate[]>('/api/v1/templates/favorites')
    return response.data
  }

  /**
   * 获取系统模板列表
   */
  async getSystemTemplates(params?: { category?: string; page?: number; page_size?: number }): Promise<ReminderTemplate[]> {
    const response = await apiClient.get<ReminderTemplate[]>('/api/v1/templates/system', params as Record<string, string | number> | undefined)
    return response.data
  }

  /**
   * 获取系统模板详情
   */
  async getSystemTemplate(id: string): Promise<ReminderTemplate> {
    const response = await apiClient.get<ReminderTemplate>(`/api/v1/templates/system/${id}`)
    return response.data
  }

  /**
   * 获取热门系统模板
   */
  async getPopularSystemTemplates(limit?: number): Promise<ReminderTemplate[]> {
    const response = await apiClient.get<ReminderTemplate[]>('/api/v1/templates/system/popular', 
      limit ? { limit } as Record<string, number> : undefined)
    return response.data
  }

  /**
   * 获取用户自定义模板（完整信息）
   */
  async getCustomTemplates(params?: { page?: number; page_size?: number }): Promise<UserCustomTemplate[]> {
    const response = await apiClient.get<UserCustomTemplate[]>('/api/v1/templates/custom', params as Record<string, string | number> | undefined)
    return response.data
  }

  /**
   * 获取模板分类列表
   */
  async getTemplateCategories(): Promise<Array<{ name: string; count: number }>> {
    const response = await apiClient.get<Array<{ name: string; count: number }>>('/api/v1/templates/categories')
    return response.data
  }
}

export const templateService = new TemplateService()
