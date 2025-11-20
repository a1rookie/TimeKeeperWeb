/**
 * Input 组件 - 通用输入框
 */

import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '@shared/theme'

export interface InputProps extends TextInputProps {
  /** 标签文本 */
  label?: string
  /** 错误提示 */
  error?: string
  /** 帮助文本 */
  helperText?: string
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
  /** 是否必填 */
  required?: boolean
  /** 容器样式 */
  containerStyle?: ViewStyle
  /** 输入框样式 */
  inputStyle?: TextStyle
  /** 标签样式 */
  labelStyle?: TextStyle
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  ...rest
}) => {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const hasError = !!error

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 标签 */}
      {label && (
        <Text style={[styles.label(theme), labelStyle]}>
          {label}
          {required && <Text style={styles.required(theme)}> *</Text>}
        </Text>
      )}

      {/* 输入框容器 */}
      <View
        style={[
          styles.inputContainer(theme),
          isFocused && styles.inputContainerFocused(theme),
          hasError && styles.inputContainerError(theme),
        ]}
      >
        {/* 左侧图标 */}
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        {/* 输入框 */}
        <TextInput
          style={[styles.input(theme), inputStyle]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          {...rest}
        />

        {/* 右侧图标 */}
        {secureTextEntry ? (
          <TouchableOpacity style={styles.iconRight} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </View>

      {/* 错误提示 / 帮助文本 */}
      {(error || helperText) && (
        <Text style={[hasError ? styles.errorText(theme) : styles.helperText(theme)]}>
          {error || helperText}
        </Text>
      )}
    </View>
  )
}

const styles = {
  container: {
    marginBottom: 0,
  } as ViewStyle,

  label: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  }),

  required: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    color: theme.colors.error,
  }),

  inputContainer: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  }),

  inputContainerFocused: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    borderColor: theme.colors.primary,
  }),

  inputContainerError: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    borderColor: theme.colors.error,
  }),

  input: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  }),

  iconLeft: {
    marginRight: 8,
  } as ViewStyle,

  iconRight: {
    marginLeft: 8,
  } as ViewStyle,

  errorText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  }),

  helperText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  }),
}
