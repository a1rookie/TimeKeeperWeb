/**
 * 设置页面
 */

import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle, Switch } from 'react-native'
import { useTheme } from '@shared/theme'
import { Card } from '@shared/components'
import { useAppStore } from '@app/providers/app.store'

interface SettingItemProps {
  title: string
  value?: string | boolean
  type?: 'text' | 'switch'
  onValueChange?: (value: boolean) => void
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  value,
  type = 'text',
  onValueChange,
}) => {
  const theme = useTheme()

  return (
    <View style={styles.settingItem(theme)}>
      <Text style={styles.settingItemTitle(theme)}>{title}</Text>
      {type === 'text' && typeof value === 'string' && (
        <Text style={styles.settingItemValue(theme)}>{value}</Text>
      )}
      {type === 'switch' && typeof value === 'boolean' && (
        <Switch value={value} onValueChange={onValueChange} />
      )}
    </View>
  )
}

export const SettingsScreen: React.FC = () => {
  const theme = useTheme()

  const isDarkMode = useAppStore((state) => state.theme === 'dark')
  const language = useAppStore((state) => state.language)

  // 切换深色模式
  const handleToggleDarkMode = (value: boolean) => {
    useAppStore.getState().setTheme(value ? 'dark' : 'light')
  }

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 外观设置 */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle(theme)}>外观</Text>
        <SettingItem
          title="深色模式"
          value={isDarkMode}
          type="switch"
          onValueChange={handleToggleDarkMode}
        />
      </Card>

      {/* 语言设置 */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle(theme)}>语言</Text>
        <SettingItem
          title="当前语言"
          value={language === 'zh' ? '简体中文' : 'English'}
          type="text"
        />
      </Card>

      {/* 通知设置 */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle(theme)}>通知</Text>
        <SettingItem title="推送通知" value={true} type="switch" />
        <SettingItem title="短信提醒" value={true} type="switch" />
        <SettingItem title="语音电话" value={false} type="switch" />
      </Card>

      {/* 数据与隐私 */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle(theme)}>数据与隐私</Text>
        <SettingItem title="清除缓存" value="点击清除" type="text" />
        <SettingItem title="数据备份" value="未备份" type="text" />
      </Card>
    </ScrollView>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  content: {
    padding: 16,
  } as ViewStyle,

  section: {
    marginBottom: 16,
    padding: 0,
  } as ViewStyle,

  sectionTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  }),

  settingItem: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  }),

  settingItemTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 15,
    color: theme.colors.text,
  }),

  settingItemValue: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),
}
