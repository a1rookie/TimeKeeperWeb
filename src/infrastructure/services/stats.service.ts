/**
 * 统计服务
 * 封装所有统计相关的 API 调用
 */

import { apiClient } from '../api/client'

/**
 * 提醒统计信息
 */
interface ReminderStats {
  total_count: number
  completed_count: number
  pending_count: number
  completion_rate: number
  category_stats: Array<{
    category: string
    count: number
    completed: number
  }>
}

/**
 * 用户整体统计
 */
interface UserStats {
  total_reminders: number
  total_completions: number
  current_streak: number
  longest_streak: number
  completion_rate: number
  category_distribution: Record<string, number>
  monthly_completions: Array<{
    month: string
    count: number
  }>
}

/**
 * 完成记录统计
 */
interface CompletionStats {
  today: number
  this_week: number
  this_month: number
  total: number
  recent_completions: Array<{
    reminder_id: string
    reminder_title: string
    completed_at: string
    notes?: string
  }>
}

class StatsService {
  /**
   * 获取指定提醒的统计信息
   */
  async getReminderStats(reminderId: string) {
    const response = await apiClient.get<ReminderStats>(`/api/v1/stats/reminder/${reminderId}`)
    return response.data
  }

  /**
   * 获取当前用户的整体统计
   */
  async getMyStats() {
    const response = await apiClient.get<UserStats>('/api/v1/stats/my')
    return response.data
  }

  /**
   * 获取完成记录统计
   */
  async getCompletionStats() {
    const response = await apiClient.get<CompletionStats>('/api/v1/completions/stats/my')
    return response.data
  }

  /**
   * 获取我的所有完成记录
   */
  async getMyCompletions(params?: { page?: number; page_size?: number }) {
    const response = await apiClient.get<{
      items: Array<{
        id: string
        reminder_id: string
        reminder_title: string
        completed_at: string
        notes?: string
        amount?: number
      }>
      total: number
      page: number
      page_size: number
    }>('/api/v1/completions/my', params as Record<string, string | number> | undefined)
    return response.data
  }
}

export const statsService = new StatsService()
export default statsService
