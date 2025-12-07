/**
 * 家庭组详情页面
 */

import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Loading, Error, Card, Button } from '@shared/components'
import {
  useFamilyGroup,
  useFamilyMembers,
  useDeleteFamilyGroup,
  useLeaveFamilyGroup,
} from '../hooks/use-family'
import { formatDateTime } from '@shared/utils/date'
import type { FamilyStackParamList } from '@app/navigation/types'
import type { FamilyMember } from '@entities/family'

type FamilyDetailRouteProp = RouteProp<FamilyStackParamList, 'FamilyDetail'>
type NavigationProp = NativeStackNavigationProp<FamilyStackParamList, 'FamilyDetail'>

export const FamilyDetailScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<FamilyDetailRouteProp>()
  const navigation = useNavigation<NavigationProp>()

  const { familyGroupId } = route.params

  // 查询家庭组详情
  const { data: familyGroup, isLoading, isError, refetch } = useFamilyGroup(familyGroupId)

  // 查询成员列表
  const { data: members } = useFamilyMembers(familyGroupId)

  // 删除家庭组
  const deleteMutation = useDeleteFamilyGroup()

  // 退出家庭组
  const leaveMutation = useLeaveFamilyGroup()

  // 处理邀请成员
  const handleInviteMember = () => {
    navigation.navigate('InviteMember', { familyGroupId })
  }

  // 处理删除
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(familyGroupId)
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 处理退出
  const handleLeave = async () => {
    try {
      await leaveMutation.mutateAsync(familyGroupId)
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError || !familyGroup) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  const isOwner = true // TODO: 根据实际用户判断

  return (
    <ScrollView style={styles.container(theme)} contentContainerStyle={styles.content}>
      {/* 家庭组信息 */}
      <Card style={styles.infoCard}>
        <Text style={styles.groupName(theme)}>{familyGroup.name}</Text>
        {familyGroup.description && (
          <Text style={styles.groupDescription(theme)}>{familyGroup.description}</Text>
        )}
        <Text style={styles.timestamp(theme)}>创建于 {formatDateTime(familyGroup.created_at)}</Text>
      </Card>

      {/* 成员列表 */}
      <Card style={styles.membersCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle(theme)}>成员 ({members?.length || 0})</Text>
          <Button variant="ghost" size="sm" onPress={handleInviteMember}>
            邀请
          </Button>
        </View>

        {members && members.length > 0 ? (
          <View>
            {members.map((member: FamilyMember) => (
              <View key={member.id} style={styles.memberItem(theme)}>
                <View>
                  <Text style={styles.memberName(theme)}>{member.nickname || '未知'}</Text>
                  <Text style={styles.memberRole(theme)}>
                    {member.role === 'admin'
                      ? '管理员'
                      : member.role === 'member'
                        ? '成员'
                        : '访客'}
                  </Text>
                </View>
                <Text style={styles.memberJoinTime(theme)}>
                  {formatDateTime(member.joined_at, 'yyyy-MM-dd')}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText(theme)}>暂无成员</Text>
        )}
      </Card>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        {isOwner ? (
          <>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => navigation.navigate('EditFamily', { familyGroupId })}
              style={styles.actionButton}
            >
              编辑家庭组
            </Button>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onPress={handleDelete}
              loading={deleteMutation.isPending}
              style={styles.actionButton}
            >
              删除家庭组
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleLeave}
            loading={leaveMutation.isPending}
          >
            退出家庭组
          </Button>
        )}
      </View>
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
    marginBottom: 16,
  } as ViewStyle,

  groupName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  groupDescription: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  }),

  timestamp: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textTertiary,
  }),

  membersCard: {
    marginBottom: 16,
  } as ViewStyle,

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as ViewStyle,

  sectionTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  }),

  memberItem: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  }),

  memberName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 4,
  }),

  memberRole: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
  }),

  memberJoinTime: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textTertiary,
  }),

  emptyText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  }),

  actions: {
    marginTop: 8,
  } as ViewStyle,

  actionButton: {
    marginBottom: 12,
  } as ViewStyle,
}
