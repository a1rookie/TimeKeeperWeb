/**
 * 模板实体类型定义
 */

import type { ReminderCategory, RecurrenceType, RecurrenceConfig } from './reminder'

export interface ReminderTemplate {
  readonly id: number
  name: string
  description?: string
  category: string
  default_recurrence_type?: string
  default_recurrence_config?: RecurrenceConfig
  default_remind_advance_days?: number
  is_active: boolean
  usage_count: number
  readonly created_at: string
}

export interface UserCustomTemplate {
  readonly id: number
  user_id: number
  name: string
  description?: string
  recurrence_type?: string
  recurrence_config?: RecurrenceConfig
  remind_advance_days?: number
  created_from_template_id?: number
  readonly created_at: string
  readonly updated_at: string
}

export interface TemplateShare {
  readonly id: number
  template_id: number
  user_id: number
  share_type: 'public' | 'family' | 'private_link'
  share_code: string
  share_title: string
  share_description?: string
  family_group_id?: number
  usage_count: number
  like_count: number
  is_active: boolean
  readonly created_at: string
}

export interface TemplateUsageRecord {
  readonly id: number
  template_share_id: number
  user_id: number
  feedback_rating?: number
  feedback_comment?: string
  readonly used_at: string
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
