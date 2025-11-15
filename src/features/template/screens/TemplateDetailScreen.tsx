/**
 * 模板详情页面
 */

import React from 'react'
import {
  View,
  Text,
  ScrollView,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Card, Button } from '@shared/components'
import { useTemplate, useTemplateToReminder, useLikeTemplate } from '../hooks/use-templates'
import { formatDateTime } from '@shared/utils/date'
import type { RootStackParamList } from '@app/navigation/types'

type TemplateDetailRouteProp = RouteProp<RootStackParamList, 'TemplateDetail'>

export const TemplateDetailScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<TemplateDetailRouteProp>()
  const navigation = useNavigation()

  const { id } = route.params

  // 查询模板详情
  const { data: template, isLoading, isError, refetch } = useTemplate(id)
  const useTemplateMutation = useTemplateToReminder()
  const likeMutation = useLikeTemplate()

  // 处理使用模板
  const handleUseTemplate = async () => {
    try {
      await useTemplateMutation.mutateAsync({ templateId: id })
      Alert.alert('成功', '已从模板创建提醒', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 处理点赞
  const handleLike = async () => {
    try {
      await likeMutation.mutateAsync(id)
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loading(theme)}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText(theme)}>加载中...</Text>
      </View>
    )
  }

  if (isError || !template) {
    return (
      <View style={styles.loading(theme)}>
        <Text style={styles.loadingText(theme)}>模板不存在</Text>
        <Button variant="primary" onPress={() => refetch()} style={styles.retryButton}>
          重试
        </Button>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 模板信息 */}
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title(theme)}>{template.title}</Text>
          {template.isSystem && (
            <View style={styles.systemBadge(theme)}>
              <Text style={styles.systemBadgeText()}>官方</Text>
            </View>
          )}
        </View>

        {template.description && (
          <Text style={styles.description(theme)}>{template.description}</Text>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel(theme)}>点赞</Text>
            <Text style={styles.statValue(theme)}>{template.likeCount || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel(theme)}>使用次数</Text>
            <Text style={styles.statValue(theme)}>{template.usageCount || 0}</Text>
          </View>
        </View>
      </Card>

      {/* 模板配置 */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle(theme)}>模板配置</Text>

        <View style={styles.configRow}>
          <Text style={styles.configLabel(theme)}>分类</Text>
          <Text style={styles.configValue(theme)}>{template.category}</Text>
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel(theme)}>重复类型</Text>
          <Text style={styles.configValue(theme)}>{template.recurrenceType}</Text>
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel(theme)}>提前提醒</Text>
          <Text style={styles.configValue(theme)}>{template.remindAdvanceDays} 天</Text>
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel(theme)}>创建时间</Text>
          <Text style={styles.configValue(theme)}>{formatDateTime(template.createdAt)}</Text>
        </View>
      </Card>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          onPress={handleLike}
          loading={likeMutation.isPending}
          style={styles.actionButton}
        >
          👍 点赞
        </Button>
        <Button
          variant="primary"
          size="lg"
          onPress={handleUseTemplate}
          loading={useTemplateMutation.isPending}
          style={styles.actionButton}
        >
          使用模板
        </Button>
      </View>
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

  loading: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  }),

  loadingText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),

  retryButton: {
    marginTop: 16,
  } as ViewStyle,

  card: {
    marginBottom: 16,
  } as ViewStyle,

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  title: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 20,
    fontWeight: theme.typography.fontWeight.bold,
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

  description: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  }),

  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
  } as ViewStyle,

  stat: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,

  statLabel: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  }),

  statValue: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  }),

  sectionTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 16,
  }),

  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  configLabel: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  configValue: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  actions: {
    flexDirection: 'row',
    gap: 12,
  } as ViewStyle,

  actionButton: {
    flex: 1,
  } as ViewStyle,
}
