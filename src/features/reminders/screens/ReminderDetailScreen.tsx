/**
 * 提醒详情页面
 */

import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Button, Loading, Error, Card } from '@shared/components'
import { CategoryIcon, getCategoryName } from '@shared/components/CategoryIcon'
import { formatDateTime, formatReminderTime, getDaysUntil } from '@shared/utils/date'
import { useReminder, useDeleteReminder, useCompleteReminder } from '../hooks/use-reminders'
import type { RemindersStackParamList } from '@app/navigation/types'

type ReminderDetailRouteProp = RouteProp<RemindersStackParamList, 'ReminderDetail'>
type NavigationProp = NativeStackNavigationProp<RemindersStackParamList, 'ReminderDetail'>

export const ReminderDetailScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<ReminderDetailRouteProp>()
  const navigation = useNavigation<NavigationProp>()

  const { id } = route.params

  // 查询提醒详情
  const { data: reminder, isLoading, isError, refetch } = useReminder(id)

  // 删除提醒
  const deleteMutation = useDeleteReminder()

  // 完成提醒
  const completeMutation = useCompleteReminder()

  // 处理删除
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 处理完成
  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync({ id })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 处理编辑
  const handleEdit = () => {
    navigation.navigate('EditReminder', { id })
  }

  // 查看完成记录
  const handleViewCompletions = () => {
    navigation.navigate('CompletionRecords', { id })
  }

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError || !reminder) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  const daysUntil = getDaysUntil(reminder.nextRemindTime)
  const isOverdue = daysUntil < 0
  const isCompleted = reminder.completionRate === 100

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 分类图标和标题 */}
      <View style={styles.header}>
        <CategoryIcon category={reminder.category} size="lg" />
        <Text style={styles.title(theme)}>{reminder.title}</Text>
        <Text style={styles.category(theme)}>{getCategoryName(reminder.category)}</Text>
      </View>

      {/* 状态卡片 */}
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel(theme)}>状态</Text>
          <Text
            style={[
              styles.statusValue(theme),
              {
                color: isCompleted
                  ? theme.colors.success
                  : isOverdue
                    ? theme.colors.error
                    : theme.colors.warning,
              },
            ]}
          >
            {isCompleted ? '已完成' : isOverdue ? '已逾期' : '待完成'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel(theme)}>提醒时间</Text>
          <Text style={styles.statusValue(theme)}>
            {formatReminderTime(reminder.nextRemindTime)}
          </Text>
        </View>
        {reminder.recurrenceType && reminder.recurrenceType !== 'none' && (
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel(theme)}>重复周期</Text>
            <Text style={styles.statusValue(theme)}>
              {reminder.recurrenceType === 'daily'
                ? '每天'
                : reminder.recurrenceType === 'weekly'
                  ? '每周'
                  : reminder.recurrenceType === 'monthly'
                    ? '每月'
                    : reminder.recurrenceType === 'yearly'
                      ? '每年'
                      : '智能周期'}
            </Text>
          </View>
        )}
      </Card>

      {/* 描述 */}
      {reminder.description && (
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle(theme)}>描述</Text>
          <Text style={styles.description(theme)}>{reminder.description}</Text>
        </Card>
      )}

      {/* 金额相关 */}
      {reminder.category === 'rent' || reminder.category === 'finance' ? (
        <Card style={styles.amountCard}>
          <Text style={styles.sectionTitle(theme)}>金额信息</Text>
          {reminder.amount && (
            <Text style={styles.amount(theme)}>¥ {reminder.amount.toFixed(2)}</Text>
          )}
        </Card>
      ) : null}

      {/* 操作按钮 */}
      <View style={styles.actions}>
        {!isCompleted && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleComplete}
            style={styles.actionButton}
          >
            标记完成
          </Button>
        )}

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onPress={handleEdit}
          style={styles.actionButton}
        >
          编辑提醒
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleViewCompletions}
          style={styles.actionButton}
        >
          查看完成记录
        </Button>

        <Button
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleDelete}
          loading={deleteMutation.isPending}
          style={styles.actionButton}
        >
          删除提醒
        </Button>
      </View>

      {/* 创建时间 */}
      <Text style={styles.timestamp(theme)}>创建于 {formatDateTime(reminder.createdAt)}</Text>
    </ScrollView>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  content: {
    padding: 16,
  } as ViewStyle,

  header: {
    alignItems: 'center',
    marginBottom: 24,
  } as ViewStyle,

  title: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: 16,
    textAlign: 'center',
  }),

  category: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),

  statusCard: {
    marginBottom: 16,
  } as ViewStyle,

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  statusLabel: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  statusValue: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  }),

  descriptionCard: {
    marginBottom: 16,
  } as ViewStyle,

  sectionTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  description: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }),

  amountCard: {
    marginBottom: 16,
  } as ViewStyle,

  amount: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  }),

  paymentDate: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textTertiary,
  }),

  actions: {
    marginTop: 8,
    marginBottom: 16,
  } as ViewStyle,

  actionButton: {
    marginBottom: 12,
  } as ViewStyle,

  timestamp: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  }),
}
