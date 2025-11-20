/**
 * 完成记录页面
 */

import React from 'react'
import { View, Text, FlatList, ViewStyle, TextStyle } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Loading, Error, EmptyState, Card } from '@shared/components'
import { formatDateTime } from '@shared/utils/date'
import { useReminderCompletions } from '../hooks/use-reminders'
import type { RemindersStackParamList } from '@app/navigation/types'

type CompletionRecordsRouteProp = RouteProp<RemindersStackParamList, 'CompletionRecords'>

export const CompletionRecordsScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<CompletionRecordsRouteProp>()

  const { id } = route.params

  // 查询完成记录
  const { data: completions, isLoading, isError, refetch } = useReminderCompletions(id)

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  // 空状态
  if (!completions || completions.length === 0) {
    return <EmptyState title="暂无完成记录" description="还没有完成记录哦" emoji="📝" fullScreen />
  }

  return (
    <View style={styles.container(theme)}>
      <FlatList
        data={completions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordDate(theme)}>{formatDateTime(item.completedAt)}</Text>
              <Text style={styles.recordStatus(theme)}>已完成</Text>
            </View>

            {item.notes && <Text style={styles.recordNotes(theme)}>{item.notes}</Text>}

            {item.amount && (
              <Text style={styles.recordAmount(theme)}>金额: ¥{item.amount.toFixed(2)}</Text>
            )}
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 统计信息 */}
      <View style={styles.statsBar(theme)}>
        <Text style={styles.statsText(theme)}>总共完成 {completions.length} 次</Text>
      </View>
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  listContent: {
    padding: 16,
  } as ViewStyle,

  recordCard: {
    marginBottom: 12,
  } as ViewStyle,

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,

  recordDate: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  recordStatus: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  recordNotes: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  }),

  recordAmount: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  }),

  statsBar: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    padding: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  }),

  statsText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }),
}
