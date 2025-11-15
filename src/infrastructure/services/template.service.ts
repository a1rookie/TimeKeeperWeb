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
    const response = await apiClient.get<ReminderTemplate[]>('/templates/public')
    return response.data
  }

  /**
   * 获取用户的自定义模板
   */
  async getMyTemplates(): Promise<UserCustomTemplate[]> {
    const response = await apiClient.get<UserCustomTemplate[]>('/templates/my')
    return response.data
  }

  /**
   * 获取模板详情
   */
  async getTemplate(id: string): Promise<ReminderTemplate> {
    const response = await apiClient.get<ReminderTemplate>(`/templates/${id}`)
    return response.data
  }

  /**
   * 创建自定义模板
   */
  async createTemplate(data: CreateTemplateRequest): Promise<UserCustomTemplate> {
    const response = await apiClient.post<UserCustomTemplate>('/templates', data)
    return response.data
  }

  /**
   * 更新自定义模板
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<UserCustomTemplate> {
    const response = await apiClient.put<UserCustomTemplate>(`/templates/${id}`, data)
    return response.data
  }

  /**
   * 删除自定义模板
   */
  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/templates/${id}`)
  }

  /**
   * 使用模板创建提醒
   */
  async useTemplate(data: UseTemplateRequest): Promise<void> {
    await apiClient.post('/templates/use', data)
  }

  /**
   * 点赞模板
   */
  async likeTemplate(id: string): Promise<void> {
    await apiClient.post(`/templates/${id}/like`)
  }

  /**
   * 取消点赞
   */
  async unlikeTemplate(id: string): Promise<void> {
    await apiClient.delete(`/templates/${id}/like`)
  }

  /**
   * 收藏模板
   */
  async favoriteTemplate(id: string): Promise<void> {
    await apiClient.post(`/templates/${id}/favorite`)
  }

  /**
   * 取消收藏
   */
  async unfavoriteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/templates/${id}/favorite`)
  }

  /**
   * 获取收藏的模板
   */
  async getFavoriteTemplates(): Promise<ReminderTemplate[]> {
    const response = await apiClient.get<ReminderTemplate[]>('/templates/favorites')
    return response.data
  }
}

export const templateService = new TemplateService()
