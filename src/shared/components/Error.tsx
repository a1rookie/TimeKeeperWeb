/**
 * Error 组件 - 错误状态
 */

import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@shared/theme'
import { Button } from './Button'

export interface ErrorProps {
  /** 错误标题 */
  title?: string
  /** 错误信息 */
  message?: string
  /** 重试按钮文本 */
  retryText?: string
  /** 重试回调 */
  onRetry?: () => void
  /** 是否全屏 */
  fullScreen?: boolean
  /** 自定义样式 */
  style?: ViewStyle
}

export const Error: React.FC<ErrorProps> = ({
  title = '出错了',
  message = '请稍后重试',
  retryText = '重试',
  onRetry,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme()

  return (
    <View style={[styles.container(theme, fullScreen), style]}>
      <Text style={styles.emoji}>😢</Text>
      <Text style={styles.title(theme)}>{title}</Text>
      <Text style={styles.message(theme)}>{message}</Text>
      {onRetry && (
        <Button variant="primary" onPress={onRetry} style={styles.button}>
          {retryText}
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
    fontSize: 48,
    marginBottom: 16,
  } as TextStyle,

  title: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  }),

  message: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  }),

  button: {
    marginTop: 16,
  } as ViewStyle,
}
