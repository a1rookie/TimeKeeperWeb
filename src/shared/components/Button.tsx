/**
 * Button 组件 - 通用按钮
 */

import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,

  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import { useTheme } from '@shared/theme'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends TouchableOpacityProps {
  /** 按钮文本 */
  children: string
  /** 按钮样式变体 */
  variant?: ButtonVariant
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否全宽 */
  fullWidth?: boolean
  /** 自定义样式 */
  style?: ViewStyle
  /** 文本样式 */
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const theme = useTheme()

  // 计算按钮样式
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }

    // 尺寸样式
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        minHeight: 32,
      },
      md: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 44,
      },
      lg: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 52,
      },
    }

    // 变体样式
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.backgroundSecondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: theme.colors.error,
      },
    }

    // 禁用样式
    const disabledStyle: ViewStyle = {
      opacity: 0.5,
    }

    // 全宽样式
    const fullWidthStyle: ViewStyle = fullWidth ? { width: '100%' } : {}

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && disabledStyle),
      ...fullWidthStyle,
    }
  }

  // 计算文本样式
  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      sm: {
        fontSize: theme.typography.fontSize.sm,
      },
      md: {
        fontSize: theme.typography.fontSize.base,
      },
      lg: {
        fontSize: theme.typography.fontSize.lg,
      },
    }

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeight.semibold,
      },
      secondary: {
        color: theme.colors.text,
        fontWeight: theme.typography.fontWeight.medium,
      },
      outline: {
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.medium,
      },
      ghost: {
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.regular,
      },
      danger: {
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeight.semibold,
      },
    }

    return {
      ...sizeStyles[size],
      ...variantTextStyles[variant],
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}
