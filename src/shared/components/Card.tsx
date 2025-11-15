/**
 * Card 组件 - 通用卡片容器
 */

import React from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'
import { useTheme } from '@shared/theme'

export interface CardProps {
  /** 子组件 */
  children: React.ReactNode
  /** 是否可点击 */
  pressable?: boolean
  /** 点击事件 */
  onPress?: () => void
  /** 自定义样式 */
  style?: ViewStyle
  /** 是否显示阴影 */
  shadow?: boolean
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  pressable = false,
  onPress,
  style,
  shadow = true,
  padding = 'md',
}) => {
  const theme = useTheme()

  const paddingStyles: Record<NonNullable<CardProps['padding']>, ViewStyle> = {
    none: { padding: 0 },
    sm: { padding: theme.spacing.sm },
    md: { padding: theme.spacing.md },
    lg: { padding: theme.spacing.lg },
  }

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...paddingStyles[padding],
    ...(shadow && theme.shadows.md),
  }

  if (pressable || onPress) {
    return (
      <TouchableOpacity style={[cardStyle, style]} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    )
  }

  return <View style={[cardStyle, style]}>{children}</View>
}
