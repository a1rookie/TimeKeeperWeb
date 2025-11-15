/**
 * 我的模板页面
 */

import React from 'react'
import {
  View,
  Text,
  FlatList,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Loading, Error, EmptyState, Card, Button } from '@shared/components'
import { useMyTemplates, useDeleteTemplate } from '../hooks/use-templates'
import type { UserCustomTemplate } from '@entities/template'
import type { RootStackParamList } from '@app/navigation/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const MyTemplatesScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProp>()

  // 查询我的模板
  const { data: templates, isLoading, isError, refetch } = useMyTemplates()
  const deleteMutation = useDeleteTemplate()

  // 处理创建模板
  const handleCreateTemplate = () => {
    navigation.navigate('CreateTemplate')
  }

  // 处理模板点击
  const handleTemplatePress = (template: UserCustomTemplate) => {
    navigation.navigate('TemplateDetail', { id: template.id })
  }

  // 处理删除模板
  const handleDeleteTemplate = (template: UserCustomTemplate) => {
    Alert.alert('删除模板', `确定要删除"${template.title}"吗?`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(template.id)
          } catch (error) {
            // 错误已在 mutation 中处理
          }
        },
      },
    ])
  }

  // 渲染模板卡片
  const renderTemplate = ({ item }: { item: UserCustomTemplate }) => (
    <Card style={styles.templateCard}>
      <TouchableOpacity onPress={() => handleTemplatePress(item)}>
        <View style={styles.templateHeader}>
          <Text style={styles.templateTitle(theme)}>{item.title}</Text>
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
      </TouchableOpacity>

      <View style={styles.actions}>
        <Button
          variant="outline"
          size="sm"
          onPress={() => handleDeleteTemplate(item)}
          style={styles.actionButton}
        >
          删除
        </Button>
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
          title="还没有模板"
          description="从提醒创建模板,或手动创建新模板"
          emoji="📝"
          actionText="创建模板"
          onAction={handleCreateTemplate}
        />
      </View>
    )
  }

  return (
    <View style={styles.container(theme)}>
      {/* 模板列表 */}
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 创建按钮 */}
      <View style={styles.fab}>
        <Button variant="primary" size="lg" fullWidth onPress={handleCreateTemplate}>
          + 创建模板
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

  templateDescription: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  }),

  templateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  stat: {
    marginRight: 16,
  } as ViewStyle,

  statText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
  }),

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
  } as ViewStyle,

  actionButton: {
    minWidth: 80,
  } as ViewStyle,

  fab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  } as ViewStyle,
}
