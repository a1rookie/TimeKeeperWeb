/**
 * ReminderCard - 提醒卡片组件
 */

import React from 'react'
import { View, Text, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import { useTheme } from '@shared/theme'
import { formatReminderTime, getDaysUntil } from '@shared/utils/date'
import { CategoryIcon, getCategoryName } from './CategoryIcon'
import type { Reminder } from '@entities/reminder'

export interface ReminderCardProps {
  /** 提醒数据 */
  reminder: Reminder
  /** 点击事件 */
  onPress?: () => void
  /** 完成事件 */
  onComplete?: () => void
  /** 自定义样式 */
  style?: ViewStyle
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onPress,
  onComplete,
  style,
}) => {
  const theme = useTheme()

  const daysUntil = getDaysUntil(reminder.next_remind_time)
  const isOverdue = daysUntil < 0
  const isToday = daysUntil === 0
  const isCompleted = !!reminder.is_completed

  // 状态指示器颜色
  const getStatusColor = () => {
    if (isCompleted) return theme.colors.success
    if (isOverdue) return theme.colors.error
    if (isToday) return theme.colors.warning
    return theme.colors.textSecondary
  }

  // 状态文本
  const getStatusText = () => {
    if (isCompleted) return '已完成'
    if (isOverdue) return '已逾期'
    if (isToday) return '今天'
    if (daysUntil === 1) return '明天'
    if (daysUntil <= 7) return `${daysUntil}天后`
    return ''
  }

  return (
    <TouchableOpacity
      style={[styles.container(theme), style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* 左侧分类图标 */}
      <CategoryIcon category={reminder.category} size="md" style={styles.icon} />

      {/* 中间内容区 */}
      <View style={styles.content}>
        {/* 标题 */}
        <Text style={styles.title(theme)} numberOfLines={1}>
          {reminder.title}
        </Text>

        {/* 描述 */}
        {reminder.description && (
          <Text style={styles.description(theme)} numberOfLines={2}>
            {reminder.description}
          </Text>
        )}

        {/* 底部信息 */}
        <View style={styles.footer}>
          <Text style={styles.category(theme)}>{getCategoryName(reminder.category)}</Text>
          <Text style={styles.time(theme)}>{formatReminderTime(reminder.next_remind_time)}</Text>
        </View>
      </View>

      {/* 右侧状态指示器 */}
      <View style={styles.statusContainer}>
        {getStatusText() && (
          <View style={[styles.statusBadge(theme), { backgroundColor: `${getStatusColor()}20` }]}>
            <Text style={[styles.statusText(theme), { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        )}

        {/* 完成按钮 */}
        {!isCompleted && onComplete && (
          <TouchableOpacity
            style={styles.completeButton(theme)}
            onPress={(e) => {
              e.stopPropagation()
              onComplete()
            }}
          >
            <Text style={styles.completeButtonText}>✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  }),

  icon: {
    marginRight: 12,
  } as ViewStyle,

  content: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  title: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  }),

  description: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  }),

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  category: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    marginRight: 8,
  }),

  time: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
  }),

  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  } as ViewStyle,

  statusBadge: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  }),

  statusText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  completeButton: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  }),

  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
  } as TextStyle,
}
