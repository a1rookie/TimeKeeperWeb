/**
 * 模板实体类型定义
 */

import type { ReminderCategory, RecurrenceType, RecurrenceConfig } from './reminder'

export interface ReminderTemplate {
  readonly id: string
  title: string
  description?: string
  category: ReminderCategory
  recurrenceType: RecurrenceType
  recurrenceConfig: RecurrenceConfig
  remindAdvanceDays: number
  isSystem: boolean
  usageCount: number
  likeCount: number
  rating?: number
  readonly createdAt: Date
}

export interface UserCustomTemplate extends ReminderTemplate {
  userId: string
}

export interface TemplateShare {
  readonly id: string
  templateId: string
  shareType: 'public' | 'family' | 'link'
  shareCode: string
  title: string
  description?: string
  readonly createdAt: Date
  readonly expiresAt?: Date
}

export interface TemplateUsageRecord {
  readonly id: string
  templateId: string
  userId: string
  readonly usedAt: Date
}

/**
 * 创建模板请求
 */
export interface CreateTemplateRequest {
  title: string
  description?: string
  category: ReminderCategory
  recurrenceType: RecurrenceType
  recurrenceConfig: RecurrenceConfig
  remindAdvanceDays: number
  isPublic?: boolean
}

/**
 * 更新模板请求
 */
export interface UpdateTemplateRequest {
  title?: string
  description?: string
  category?: ReminderCategory
  recurrenceType?: RecurrenceType
  recurrenceConfig?: RecurrenceConfig
  remindAdvanceDays?: number
}

/**
 * 模板列表查询参数
 */
export interface TemplateQueryParams {
  category?: ReminderCategory
  keyword?: string
  sortBy?: 'usage' | 'likes' | 'latest'
  page?: number
  pageSize?: number
}

/**
 * 使用模板请求
 */
export interface UseTemplateRequest {
  templateId: string
  targetDate?: Date
}
