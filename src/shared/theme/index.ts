/**
 * 主题系统
 * 根据深色/浅色模式提供对应的主题变量
 */

import { useAppStore } from '@app/providers/app.store'
import { useColorScheme } from 'react-native'
import { colors, spacing, typography, borderRadius, shadows, zIndex, duration } from './tokens'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface Theme {
  colors: {
    primary: string
    primaryDark: string
    primaryLight: string
    secondary: string
    background: string
    backgroundSecondary: string
    backgroundTertiary: string
    text: string
    textSecondary: string
    textTertiary: string
    textDisabled: string
    border: string
    borderLight: string
    success: string
    warning: string
    error: string
    info: string
    // 提醒分类色
    category: typeof colors.category
  }
  spacing: typeof spacing
  typography: typeof typography
  borderRadius: typeof borderRadius
  shadows: typeof shadows
  zIndex: typeof zIndex
  duration: typeof duration
}

/**
 * 浅色主题
 */
export const lightTheme: Theme = {
  colors: {
    primary: colors.primary[500],
    primaryDark: colors.primary[700],
    primaryLight: colors.primary[300],
    secondary: colors.secondary[500],
    background: colors.background.light.primary,
    backgroundSecondary: colors.background.light.secondary,
    backgroundTertiary: colors.background.light.tertiary,
    text: colors.text.light.primary,
    textSecondary: colors.text.light.secondary,
    textTertiary: colors.text.light.tertiary,
    textDisabled: colors.text.light.disabled,
    border: colors.grey[300],
    borderLight: colors.grey[200],
    success: colors.success.main,
    warning: colors.warning.main,
    error: colors.error.main,
    info: colors.info.main,
    category: colors.category,
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  duration,
}

/**
 * 深色主题
 */
export const darkTheme: Theme = {
  colors: {
    primary: colors.primary[400],
    primaryDark: colors.primary[300],
    primaryLight: colors.primary[500],
    secondary: colors.secondary[400],
    background: colors.background.dark.primary,
    backgroundSecondary: colors.background.dark.secondary,
    backgroundTertiary: colors.background.dark.tertiary,
    text: colors.text.dark.primary,
    textSecondary: colors.text.dark.secondary,
    textTertiary: colors.text.dark.tertiary,
    textDisabled: colors.text.dark.disabled,
    border: colors.grey[700],
    borderLight: colors.grey[800],
    success: colors.success.light,
    warning: colors.warning.light,
    error: colors.error.light,
    info: colors.info.light,
    category: colors.category,
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  duration,
}

/**
 * 主题 Hook
 * 根据用户设置自动切换主题
 */
export const useTheme = (): Theme => {
  const themeMode = useAppStore((state: { theme: ThemeMode }) => state.theme)
  const systemColorScheme = useColorScheme()

  // 确定最终使用的主题
  const resolvedMode = themeMode === 'system' ? systemColorScheme : themeMode

  return resolvedMode === 'dark' ? darkTheme : lightTheme
}
