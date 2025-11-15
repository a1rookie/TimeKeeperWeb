/**
 * 个人中心主页
 */

import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Card, Button } from '@shared/components'
import { useAuthStore } from '@app/providers/auth.store'
import type { ProfileStackParamList, RootStackParamList } from '@app/navigation/types'
import type { CompositeNavigationProp } from '@react-navigation/native'

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>,
  NativeStackNavigationProp<RootStackParamList>
>

interface MenuItemProps {
  title: string
  onPress: () => void
  rightText?: string
}

const MenuItem: React.FC<MenuItemProps> = ({ title, onPress, rightText }) => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.menuItem(theme)} onPress={onPress}>
      <Text style={styles.menuItemTitle(theme)}>{title}</Text>
      <View style={styles.menuItemRight}>
        {rightText && <Text style={styles.menuItemRightText(theme)}>{rightText}</Text>}
        <Text style={styles.menuItemArrow(theme)}>›</Text>
      </View>
    </TouchableOpacity>
  )
}

export const ProfileHomeScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProp>()

  const user = useAuthStore((state) => state.user)

  // 导航到编辑资料
  const handleEditProfile = () => {
    navigation.navigate('EditProfile')
  }

  // 导航到设置
  const handleSettings = () => {
    navigation.navigate('Settings')
  }

  // 导航到关于
  const handleAbout = () => {
    navigation.navigate('About')
  }

  // 导航到模板市场
  const handleTemplateMarket = () => {
    navigation.navigate('TemplateMarket')
  }

  // 导航到我的模板
  const handleMyTemplates = () => {
    navigation.navigate('MyTemplates')
  }

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 用户信息卡片 */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar(theme)}>
          <Text style={styles.avatarText(theme)}>
            {user?.nickname?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.nickname(theme)}>{user?.nickname || '未设置昵称'}</Text>
        <Text style={styles.phone(theme)}>{user?.phone || '未知手机号'}</Text>
      </Card>

      {/* 功能菜单 */}
      <Card style={styles.menuCard}>
        <MenuItem title="📝 模板市场" onPress={handleTemplateMarket} />
        <MenuItem title="📋 我的模板" onPress={handleMyTemplates} />
      </Card>

      {/* 设置菜单 */}
      <Card style={styles.menuCard}>
        <MenuItem title="编辑资料" onPress={handleEditProfile} />
        <MenuItem title="设置" onPress={handleSettings} />
        <MenuItem title="关于我们" onPress={handleAbout} />
      </Card>

      {/* 退出登录按钮 */}
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onPress={() => {
          useAuthStore.getState().clearAuth()
        }}
        style={styles.logoutButton}
      >
        退出登录
      </Button>
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

  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  } as ViewStyle,

  avatar: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  }),

  avatarText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
  }),

  nickname: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 20,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  phone: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  menuCard: {
    marginBottom: 16,
    padding: 0,
  } as ViewStyle,

  menuItem: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  }),

  menuItemTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    color: theme.colors.text,
  }),

  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  menuItemRightText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  }),

  menuItemArrow: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 24,
    color: theme.colors.textTertiary,
  }),

  logoutButton: {
    marginTop: 16,
  } as ViewStyle,
}
