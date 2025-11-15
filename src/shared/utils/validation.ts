/**
 * 表单验证工具
 * 基于 zod
 */

import { z } from 'zod'

/**
 * 手机号验证规则
 */
export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号')

/**
 * 短信验证码验证规则
 */
export const smsCodeSchema = z
  .string()
  .regex(/^\d{6}$/, '请输入6位验证码')

/**
 * 密码验证规则
 */
export const passwordSchema = z
  .string()
  .min(6, '密码至少6位')
  .max(20, '密码最多20位')

/**
 * 昵称验证规则
 */
export const nicknameSchema = z
  .string()
  .min(2, '昵称至少2个字符')
  .max(20, '昵称最多20个字符')

/**
 * 提醒标题验证规则
 */
export const reminderTitleSchema = z
  .string()
  .min(1, '提醒标题不能为空')
  .max(100, '提醒标题最多100个字符')

/**
 * 提醒描述验证规则
 */
export const reminderDescriptionSchema = z
  .string()
  .max(500, '提醒描述最多500个字符')
  .optional()

/**
 * 登录表单验证
 */
export const loginSchema = z.object({
  phone: phoneSchema,
  sms_code: smsCodeSchema,
})

/**
 * 注册表单验证
 */
export const registerSchema = z.object({
  phone: phoneSchema,
  sms_code: smsCodeSchema,
  nickname: nicknameSchema.optional(),
})

/**
 * 发送短信验证码验证
 */
export const sendSmsCodeSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(['register', 'login', 'reset_password', 'bind_phone']),
})

/**
 * 创建提醒表单验证
 */
export const createReminderSchema = z.object({
  title: reminderTitleSchema,
  description: reminderDescriptionSchema,
  category: z.enum(['rent', 'health', 'pet', 'finance', 'document', 'memorial']),
  remind_time: z.string().datetime(),
  recurrence_type: z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly', 'smart']).optional(),
})

/**
 * 验证辅助函数
 */
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { success: boolean; error?: string } => {
  try {
    schema.parse(value)
    return { success: true }
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message || '验证失败' }
    }
    return { success: false, error: '验证失败' }
  }
}
