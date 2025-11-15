/**
 * CategoryIcon - 提醒分类图标组件
 */

import React from 'react'
import { View, Text, ViewStyle } from 'react-native'
import { useTheme } from '@shared/theme'
import type { ReminderCategory } from '@entities/reminder'

export interface CategoryIconProps {
  /** 分类类型 */
  category: ReminderCategory
  /** 图标大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否显示背景 */
  showBackground?: boolean
  /** 自定义样式 */
  style?: ViewStyle
}

// 分类图标映射
const CATEGORY_ICONS: Record<ReminderCategory, string> = {
  rent: '🏠',
  health: '💊',
  pet: '🐕',
  finance: '💰',
  document: '📄',
  memorial: '🌸',
  other: '📌',
}

// 分类名称映射
const CATEGORY_NAMES: Record<ReminderCategory, string> = {
  rent: '房租',
  health: '健康',
  pet: '宠物',
  finance: '财务',
  document: '证件',
  memorial: '纪念日',
  other: '其他',
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  showBackground = true,
  style,
}) => {
  const theme = useTheme()

  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  }

  const containerSize = sizes[size]
  const iconSize = iconSizes[size]
  const categoryColor = theme.colors.category[category]

  const containerStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius: theme.borderRadius.md,
    backgroundColor: showBackground ? `${categoryColor}20` : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <View style={[containerStyle, style]}>
      <Text style={{ fontSize: iconSize }}>{CATEGORY_ICONS[category]}</Text>
    </View>
  )
}

/** 获取分类名称 */
export const getCategoryName = (category: ReminderCategory): string => {
  return CATEGORY_NAMES[category]
}

/** 获取分类图标 */
export const getCategoryIcon = (category: ReminderCategory): string => {
  return CATEGORY_ICONS[category]
}
