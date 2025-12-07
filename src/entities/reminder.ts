/**
 * 提醒实体类型定义
 * 对应后端 Reminder 模型
 */

export type ReminderCategory =
  | 'rent' // 居住
  | 'health' // 健康
  | 'pet' // 宠物
  | 'finance' // 财务
  | 'document' // 证件
  | 'memorial' // 纪念
  | 'other' // 其他

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'smart' | 'none'

export type ReminderStatus = 'pending' | 'completed' | 'cancelled'

export interface Reminder {
  readonly id: number
  user_id: number
  title: string
  description?: string
  category: ReminderCategory
  recurrence_type: RecurrenceType
  recurrence_config: RecurrenceConfig
  next_remind_time: string
  first_remind_time: string
  last_remind_time?: string
  advance_minutes: number
  remind_channels: string[]
  amount?: number
  is_active: boolean
  is_completed: boolean
  completed_at?: string
  readonly created_at: string
  readonly updated_at: string
}

export interface RecurrenceConfig {
  // 日周期配置
  time?: string // HH:mm

  // 周周期配置
  weekdays?: number[] // 0-6, 0=周日

  // 月周期配置
  dayOfMonth?: number // 1-31
  lastDayOfMonth?: boolean
  workdayAdjust?: boolean

  // 年周期配置
  month?: number // 1-12
  day?: number // 1-31

  // 智能周期配置
  baseMonths?: number
  flexibilityDays?: number
  learningEnabled?: boolean
}

export interface CreateReminderRequest {
  title: string
  description?: string
  category: ReminderCategory
  recurrenceType: RecurrenceType
  recurrenceConfig: RecurrenceConfig
  remindAdvanceDays?: number
  remindChannels?: string[]
  amount?: number
  currency?: string
  familyGroupId?: string
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  isActive?: boolean
}

export interface ReminderCompletion {
  readonly id: string
  reminderId: string
  userId: string
  completedAt: Date
  notes?: string
  amount?: number
  isDelayed: boolean
}

export interface ReminderStatistics {
  totalCount: number
  completedCount: number
  completionRate: number
  categoryDistribution: Record<ReminderCategory, number>
  upcomingCount: number
}
