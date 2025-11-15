/**
 * 提醒列表页面
 */

import React, { useState } from 'react'
import { View, Text, FlatList, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Button, Loading, Error, EmptyState } from '@shared/components'
import { ReminderCard } from '@shared/components/ReminderCard'
import { CategoryIcon } from '@shared/components/CategoryIcon'
import { useReminders, useCompleteReminder } from '../hooks/use-reminders'
import type { RemindersStackParamList } from '@app/navigation/types'
import type { ReminderCategory } from '@entities/reminder'

type NavigationProp = NativeStackNavigationProp<RemindersStackParamList, 'ReminderList'>

const CATEGORIES: ReminderCategory[] = ['rent', 'health', 'pet', 'finance', 'document', 'memorial']

export const ReminderListScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProp>()

  const [selectedCategory, setSelectedCategory] = useState<ReminderCategory | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  // 查询提醒列表
  const { data, isLoading, isError, refetch } = useReminders({
    category: selectedCategory || undefined,
    is_active: !showCompleted,
    page: 1,
    page_size: 50,
  })

  // 完成提醒
  const completeMutation = useCompleteReminder()

  // 导航到详情
  const handleReminderPress = (id: string) => {
    navigation.navigate('ReminderDetail', { id })
  }

  // 完成提醒
  const handleCompleteReminder = async (id: string) => {
    try {
      await completeMutation.mutateAsync({ id })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 导航到创建页面
  const handleCreateReminder = () => {
    const params = selectedCategory ? { category: selectedCategory } : {}
    navigation.navigate('CreateReminder', params as any)
  }

  // 渲染分类筛选
  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <TouchableOpacity
        style={[styles.categoryItem(theme), !selectedCategory && styles.categoryItemActive(theme)]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text style={styles.categoryItemText(theme, !selectedCategory)}>全部</Text>
      </TouchableOpacity>

      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.categoryItem(theme), selectedCategory === category && styles.categoryItemActive(theme)]}
          onPress={() => setSelectedCategory(category)}
        >
          <CategoryIcon category={category} size="sm" showBackground={false} />
        </TouchableOpacity>
      ))}
    </View>
  )

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  const reminders = data?.items || []

  return (
    <View style={styles.container(theme)}>
      {/* 分类筛选 */}
      {renderCategoryFilter()}

      {/* 工具栏 */}
      <View style={styles.toolbar(theme)}>
        <TouchableOpacity onPress={() => setShowCompleted(!showCompleted)}>
          <Text style={styles.toolbarText(theme)}>{showCompleted ? '隐藏已完成' : '显示已完成'}</Text>
        </TouchableOpacity>

        <Text style={styles.toolbarText(theme)}>共 {data?.total || 0} 条</Text>
      </View>

      {/* 列表 */}
      {reminders.length === 0 ? (
        <EmptyState
          title="暂无提醒"
          description="点击下方按钮创建您的第一个提醒"
          emoji="📭"
          actionText="创建提醒"
          onAction={handleCreateReminder}
          fullScreen
        />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReminderCard
              reminder={item}
              onPress={() => handleReminderPress(item.id)}
              onComplete={() => handleCompleteReminder(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 创建按钮 */}
      <View style={styles.fab()}>
        <Button variant="primary" size="lg" onPress={handleCreateReminder}>
          + 创建提醒
        </Button>
      </View>
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  } as ViewStyle,

  categoryItem: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
  }),

  categoryItemActive: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    backgroundColor: theme.colors.primary,
  }),

  categoryItemText: (theme: ReturnType<typeof useTheme>, isActive: boolean): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: isActive ? '#FFFFFF' : theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  toolbar: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.backgroundSecondary,
  }),

  toolbarText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  }),

  listContent: {
    padding: 16,
  } as ViewStyle,

  fab: (): ViewStyle => ({
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  }),
}
