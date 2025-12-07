/**
 * 通知服务
 * 封装所有通知相关的 API 调用
 */

import { apiClient } from '../api/client'

/**
 * 通知类型
 */
export enum NotificationType {
  REMINDER = 'reminder',
  FAMILY_INVITATION = 'family_invitation',
  SYSTEM = 'system',
}

/**
 * 通知对象
 */
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  content: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
  read_at?: string
}

/**
 * 通知统计
 */
interface NotificationStats {
  total_count: number
  unread_count: number
  by_type: Record<NotificationType, number>
}

class NotificationService {
  /**
   * 获取通知列表
   */
  async getNotifications(params?: {
    page?: number
    page_size?: number
    is_read?: boolean
    type?: NotificationType
  }) {
    const response = await apiClient.get<{
      items: Notification[]
      total: number
      page: number
      page_size: number
    }>('/api/v1/notifications', params as Record<string, string | number | boolean> | undefined)
    return response.data
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount() {
    const response = await apiClient.get<{ count: number }>('/api/v1/notifications/unread-count')
    return response.data
  }

  /**
   * 获取通知统计信息
   */
  async getNotificationStats() {
    const response = await apiClient.get<NotificationStats>('/api/v1/notifications/stats')
    return response.data
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(notificationId: string) {
    const response = await apiClient.post<{ message: string }>(
      `/api/v1/notifications/${notificationId}/read`
    )
    return response.data
  }

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead() {
    const response = await apiClient.post<{ message: string }>('/api/v1/notifications/read-all')
    return response.data
  }

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string) {
    const response = await apiClient.delete<{ message: string }>(
      `/api/v1/notifications/${notificationId}`
    )
    return response.data
  }

  /**
   * 清空所有已读通知
   */
  async clearReadNotifications() {
    const response = await apiClient.delete<{ message: string }>('/api/v1/notifications/clear-read')
    return response.data
  }
}

export const notificationService = new NotificationService()
export default notificationService
