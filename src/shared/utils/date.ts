/**
 * 日期格式化工具函数
 * 基于 date-fns
 */

import { format, formatDistance, parseISO, isValid, differenceInDays, startOfDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期时间
 * @param date 日期字符串或 Date 对象
 * @param formatStr 格式字符串，默认 'yyyy-MM-dd HH:mm:ss'
 */
export const formatDateTime = (date: string | Date, formatStr = 'yyyy-MM-dd HH:mm:ss'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return format(dateObj, formatStr, { locale: zhCN })
  } catch {
    return '-'
  }
}

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date): string => {
  return formatDateTime(date, 'yyyy-MM-dd')
}

/**
 * 格式化时间
 */
export const formatTime = (date: string | Date): string => {
  return formatDateTime(date, 'HH:mm:ss')
}

/**
 * 格式化为友好的相对时间
 * 例如: '2 小时前', '昨天', '3 天前'
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: zhCN })
  } catch {
    return '-'
  }
}

/**
 * 判断是否为今天
 */
export const isToday = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    const today = startOfDay(new Date())
    const target = startOfDay(dateObj)
    return today.getTime() === target.getTime()
  } catch {
    return false
  }
}

/**
 * 计算距离天数
 * 正数表示未来，负数表示过去
 */
export const getDaysUntil = (date: string | Date): number => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 0
    return differenceInDays(dateObj, new Date())
  } catch {
    return 0
  }
}

/**
 * 格式化提醒时间文本
 * 根据距离当前时间自动选择格式
 */
export const formatReminderTime = (date: string | Date): string => {
  const days = getDaysUntil(date)

  if (days < 0) {
    return '已逾期'
  } else if (days === 0) {
    return `今天 ${formatTime(date)}`
  } else if (days === 1) {
    return `明天 ${formatTime(date)}`
  } else if (days <= 7) {
    return `${days}天后 ${formatTime(date)}`
  } else {
    return formatDateTime(date, 'yyyy-MM-dd HH:mm')
  }
}
