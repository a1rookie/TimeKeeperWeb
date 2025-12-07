/**
 * TabIcon - 美化底部 Tab 的图标显示
 */
import React from 'react'
import { Text, ViewStyle } from 'react-native'
import { useTheme } from '@shared/theme'

export interface TabIconProps {
  icon: string
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: ViewStyle
}

export const TabIcon: React.FC<TabIconProps> = ({ icon, active = false, size = 'md', style }) => {
  const theme = useTheme()
  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 30,
  }

  const iconSize = iconSizes[size]

  // 不再使用圆形容器，仅渲染图标文字，选中时改变颜色
  return (
    <Text style={[{ fontSize: iconSize, color: active ? theme.colors.primary : theme.colors.textSecondary }, style as any]}>
      {icon}
    </Text>
  )
}

export default TabIcon
