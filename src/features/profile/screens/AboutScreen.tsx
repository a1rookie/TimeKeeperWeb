/**
 * 关于页面
 */

import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle, Linking } from 'react-native'
import { useTheme } from '@shared/theme'
import { Card, Button } from '@shared/components'

const APP_VERSION = '1.0.0'

export const AboutScreen: React.FC = () => {
  const theme = useTheme()

  // 打开链接
  const handleOpenLink = (url: string) => {
    Linking.openURL(url)
  }

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 应用信息 */}
      <Card style={styles.infoCard}>
        <View style={styles.logo(theme)}>
          <Text style={styles.logoText()}>⏰</Text>
        </View>
        <Text style={styles.appName(theme)}>TimeKeeper</Text>
        <Text style={styles.appVersion(theme)}>版本 {APP_VERSION}</Text>
        <Text style={styles.appDescription(theme)}>
          智能周期提醒应用，让您不再忘记重要的事情
        </Text>
      </Card>

      {/* 链接 */}
      <Card style={styles.linksCard}>
        <Button
          variant="ghost"
          fullWidth
          onPress={() => handleOpenLink('https://example.com/privacy')}
          style={styles.linkButton}
        >
          隐私政策
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onPress={() => handleOpenLink('https://example.com/terms')}
          style={styles.linkButton}
        >
          服务条款
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onPress={() => handleOpenLink('https://example.com/contact')}
          style={styles.linkButton}
        >
          联系我们
        </Button>
      </Card>

      {/* 版权信息 */}
      <Text style={styles.copyright(theme)}>
        © 2024 TimeKeeper. All rights reserved.
      </Text>
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

  infoCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  } as ViewStyle,

  logo: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  }),

  logoText: (): TextStyle => ({
    fontSize: 48,
  }),

  appName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  appVersion: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  }),

  appDescription: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  }),

  linksCard: {
    marginBottom: 16,
    padding: 0,
  } as ViewStyle,

  linkButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  } as ViewStyle,

  copyright: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 32,
  }),
}
