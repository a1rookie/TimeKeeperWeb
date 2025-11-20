/**
 * Loading 组件 - 加载状态
 */

import React from 'react'
import { View, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@shared/theme'

export interface LoadingProps {
  /** 加载文本 */
  text?: string
  /** 是否全屏 */
  fullScreen?: boolean
  /** 加载指示器大小 */
  size?: 'small' | 'large'
  /** 自定义样式 */
  style?: ViewStyle
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  fullScreen = false,
  size = 'large',
  style,
}) => {
  const theme = useTheme()

  return (
    <View style={[styles.container(theme, fullScreen), style]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && <Text style={styles.text(theme)}>{text}</Text>}
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>, fullScreen: boolean): ViewStyle => ({
    flex: fullScreen ? 1 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: fullScreen ? theme.colors.background : 'transparent',
  }),

  text: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  }),
}
