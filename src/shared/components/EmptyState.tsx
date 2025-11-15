/**
 * EmptyState 组件 - 空状态
 */

import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@shared/theme'
import { Button } from './Button'

export interface EmptyStateProps {
  /** 空状态标题 */
  title?: string
  /** 空状态描述 */
  description?: string
  /** 表情符号 */
  emoji?: string
  /** 操作按钮文本 */
  actionText?: string
  /** 操作回调 */
  onAction?: () => void
  /** 是否全屏 */
  fullScreen?: boolean
  /** 自定义样式 */
  style?: ViewStyle
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description,
  emoji = '📭',
  actionText,
  onAction,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme()

  return (
    <View style={[styles.container(theme, fullScreen), style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title(theme)}>{title}</Text>
      {description && <Text style={styles.description(theme)}>{description}</Text>}
      {actionText && onAction && (
        <Button variant="primary" onPress={onAction} style={styles.button}>
          {actionText}
        </Button>
      )}
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>, fullScreen: boolean): ViewStyle => ({
    flex: fullScreen ? 1 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: fullScreen ? theme.colors.background : 'transparent',
  }),

  emoji: {
    fontSize: 64,
    marginBottom: 16,
  } as TextStyle,

  title: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  }),

  description: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  }),

  button: {
    marginTop: 16,
  } as ViewStyle,
}
