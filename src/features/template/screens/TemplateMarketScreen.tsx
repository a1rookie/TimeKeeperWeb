/**
 * 模板市场页面
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Loading, Error, EmptyState, Card } from '@shared/components'
import { usePublicTemplates } from '../hooks/use-templates'
import type { ReminderTemplate } from '@entities/template'
import type { RootStackParamList } from '@app/navigation/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const TemplateMarketScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProp>()

  // 查询公共模板
  const { data: templates, isLoading, isError, refetch } = usePublicTemplates()

  // 分类过滤
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 处理模板点击
  const handleTemplatePress = (template: ReminderTemplate) => {
    navigation.navigate('TemplateDetail', { id: template.id })
  }

  // 渲染模板卡片
  const renderTemplate = ({ item }: { item: ReminderTemplate }) => (
    <Card style={styles.templateCard} onPress={() => handleTemplatePress(item)}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle(theme)}>{item.title}</Text>
        {item.isSystem && (
          <View style={styles.systemBadge(theme)}>
            <Text style={styles.systemBadgeText()}>官方</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.templateDescription(theme)} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.templateFooter}>
        <View style={styles.stat}>
          <Text style={styles.statText(theme)}>👍 {item.likeCount || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statText(theme)}>📊 {item.usageCount || 0} 次使用</Text>
        </View>
      </View>
    </Card>
  )

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  // 空状态
  if (!templates || templates.length === 0) {
    return (
      <View style={styles.container(theme)}>
        <EmptyState
          title="暂无模板"
          description="还没有公开的模板"
          emoji="📝"
        />
      </View>
    )
  }

  return (
    <View style={styles.container(theme)}>
      {/* 分类标签 */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryTab(theme),
            selectedCategory === 'all' && styles.categoryTabActive(theme),
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[
              styles.categoryTabText(theme),
              selectedCategory === 'all' && styles.categoryTabTextActive(theme),
            ]}
          >
            全部
          </Text>
        </TouchableOpacity>
      </View>

      {/* 模板列表 */}
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  } as ViewStyle,

  categoryTab: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: theme.colors.backgroundSecondary,
  }),

  categoryTabActive: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    backgroundColor: theme.colors.primary,
  }),

  categoryTabText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  categoryTabTextActive: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  }),

  listContent: {
    padding: 16,
  } as ViewStyle,

  templateCard: {
    marginBottom: 12,
  } as ViewStyle,

  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,

  templateTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  }),

  systemBadge: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  }),

  systemBadgeText: (): TextStyle => ({
    fontSize: 12,
    color: '#FFFFFF',
  }),

  templateDescription: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  }),

  templateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  stat: {
    marginRight: 16,
  } as ViewStyle,

  statText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
  }),
}
