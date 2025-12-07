/**
 * 提醒服务
 * 封装所有提醒相关的 API 调用
 */

import { apiClient } from '../api/client'
import type {
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
  ReminderCompletion,
  ReminderStatistics,
} from '@entities/reminder'
import type { PaginatedResponse } from '@shared/types/api'

interface GetRemindersParams {
  page?: number
  pageSize?: number
  category?: string
  isActive?: boolean
}

class ReminderService {
  /**
   * 获取提醒列表
   */
  async getReminders(params?: GetRemindersParams) {
    const response = await apiClient.get<PaginatedResponse<Reminder>>(
      '/api/v1/reminders',
      params as Record<string, string | number | boolean> | undefined
    )
    return response.data
  }

  /**
   * 获取提醒详情
   */
  async getReminderById(id: string) {
    const response = await apiClient.get<Reminder>(`/api/v1/reminders/${id}`)
    return response.data
  }

  /**
   * 创建提醒
   */
  async createReminder(data: CreateReminderRequest) {
    const response = await apiClient.post<Reminder>('/api/v1/reminders', data)
    return response.data
  }

  /**
   * 更新提醒
   */
  async updateReminder(id: string, data: UpdateReminderRequest) {
    const response = await apiClient.put<Reminder>(`/api/v1/reminders/${id}`, data)
    return response.data
  }

  /**
   * 删除提醒
   */
  async deleteReminder(id: string) {
    const response = await apiClient.delete<{ message: string }>(`/api/v1/reminders/${id}`)
    return response.data
  }

  /**
   * 标记提醒完成
   */
  async completeReminder(id: string, notes?: string, amount?: number) {
    const response = await apiClient.post<ReminderCompletion>(`/api/v1/reminders/${id}/complete`, {
      notes,
      amount,
    })
    return response.data
  }

  /**
   * 取消完成标记
   */
  async uncompleteReminder(id: string) {
    const response = await apiClient.post<{ message: string }>(`/api/v1/reminders/${id}/uncomplete`)
    return response.data
  }

  /**
   * 获取提醒完成记录
   */
  async getReminderCompletions(reminderId: string) {
    const response = await apiClient.get<ReminderCompletion[]>(
      `/api/v1/completions/reminder/${reminderId}`
    )
    return response.data
  }

  /**
   * 获取提醒统计信息
   */
  async getReminderStatistics() {
    const response = await apiClient.get<ReminderStatistics>('/api/v1/completions/stats/my')
    return response.data
  }

  /**
   * 快速创建提醒（语音输入）
   */
  async quickCreateReminder(text: string) {
    const response = await apiClient.post<Reminder>('/api/v1/reminders/quick', { text })
    return response.data
  }

  /**
   * 语音创建提醒
   */
  async createVoiceReminder(audioData: FormData) {
    const response = await apiClient.post<Reminder>('/api/v1/reminders/voice', audioData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  /**
   * 获取提醒的通知配置
   */
  async getNotificationConfig(reminderId: string) {
    const response = await apiClient.get<{
      advance_notify_minutes: number[]
      smart_scheduling_enabled: boolean
      notification_sound: string
    }>(`/api/v1/reminders/${reminderId}/notification-config`)
    return response.data
  }

  /**
   * 更新提醒的通知配置
   */
  async updateNotificationConfig(
    reminderId: string,
    config: {
      advance_notify_minutes?: number[]
      smart_scheduling_enabled?: boolean
      notification_sound?: string
    }
  ) {
    const response = await apiClient.put<{
      advance_notify_minutes: number[]
      smart_scheduling_enabled: boolean
      notification_sound: string
    }>(`/api/v1/reminders/${reminderId}/notification-config`, config)
    return response.data
  }
}

export const reminderService = new ReminderService()
export default reminderService
