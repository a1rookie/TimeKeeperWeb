/**
 * 家庭组列表页面
 */

import React from 'react'
import { View, Text, FlatList, ViewStyle, TextStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Loading, Error, EmptyState, Card, Button } from '@shared/components'
import { useMyFamilyGroups, usePendingInvitations } from '../hooks/use-family'
import type { FamilyStackParamList } from '@app/navigation/types'
import type { FamilyGroup } from '@entities/family'

type NavigationProp = NativeStackNavigationProp<FamilyStackParamList, 'FamilyList'>

export const FamilyListScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProp>()

  // 查询家庭组列表
  const { data: familyGroups, isLoading, isError, refetch } = useMyFamilyGroups()

  // 查询待处理邀请
  const { data: invitations } = usePendingInvitations()

  // 导航到家庭详情
  const handleGroupPress = (group: FamilyGroup) => {
    navigation.navigate('FamilyDetail', { familyGroupId: group.id })
  }

  // 导航到创建家庭
  const handleCreateFamily = () => {
    navigation.navigate('CreateFamily')
  }

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  // 空状态
  if (!familyGroups || familyGroups.length === 0) {
    return (
      <View style={styles.container(theme)}>
        <EmptyState
          title="还没有家庭组"
          description="创建家庭组,与家人共享提醒"
          emoji="👨‍👩‍👧‍👦"
          actionText="创建家庭组"
          onAction={handleCreateFamily}
        />
      </View>
    )
  }

  return (
    <View style={styles.container(theme)}>
      {/* 待处理邀请提示 */}
      {invitations && invitations.length > 0 && (
        <Card style={styles.invitationBanner} onPress={() => navigation.navigate('Invitations')}>
          <Text style={styles.invitationText(theme)}>
            您有 {invitations.length} 个待处理的家庭邀请
          </Text>
        </Card>
      )}

      {/* 家庭组列表 */}
      <FlatList
        data={familyGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.groupCard} onPress={() => handleGroupPress(item)}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName(theme)}>{item.name}</Text>
              <Text style={styles.memberCount(theme)}>{item.member_count || 0} 成员</Text>
            </View>
            {item.description && (
              <Text style={styles.groupDescription(theme)}>{item.description}</Text>
            )}
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 创建按钮 */}
      <View style={styles.fab}>
        <Button variant="primary" size="lg" fullWidth onPress={handleCreateFamily}>
          + 创建家庭组
        </Button>
      </View>
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  invitationBanner: {
    margin: 16,
    backgroundColor: '#FFF3CD',
  } as ViewStyle,

  invitationText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium,
  }),

  listContent: {
    padding: 16,
  } as ViewStyle,

  groupCard: {
    marginBottom: 12,
  } as ViewStyle,

  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,

  groupName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  }),

  memberCount: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  groupDescription: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }),

  fab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  } as ViewStyle,
}
