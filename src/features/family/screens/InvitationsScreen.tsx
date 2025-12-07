/**
 * 邀请列表页面
 */

import React from 'react'
import { View, Text, FlatList, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@shared/theme'
import { Card, Button } from '@shared/components'
import { usePendingInvitations, useRespondInvitation } from '../hooks/use-family'
import { formatDateTime } from '@shared/utils/date'
import type { FamilyInvitation } from '@entities/family'

export const InvitationsScreen: React.FC = () => {
  const theme = useTheme()

  const { data: invitations, isLoading } = usePendingInvitations()
  const respondMutation = useRespondInvitation()

  // 处理接受邀请
  const handleAccept = async (invitationId: number) => {
    try {
      await respondMutation.mutateAsync({
        invitationId,
        accept: true,
      })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 处理拒绝邀请
  const handleReject = async (invitationId: number) => {
    try {
      await respondMutation.mutateAsync({
        invitationId,
        accept: false,
      })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 渲染邀请项
  const renderInvitation = ({ item }: { item: FamilyInvitation }) => (
    <Card style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Text style={styles.familyName(theme)}>{item.family_group_name}</Text>
        <Text style={styles.inviteTime(theme)}>{formatDateTime(item.created_at)}</Text>
      </View>

      <Text style={styles.inviterLabel(theme)}>邀请人</Text>
      <Text style={styles.inviterName(theme)}>{item.sender_id ? item.sender_id.toString() : '未知'}</Text>

      <View style={styles.actions}>
        <Button
          variant="outline"
          size="sm"
          onPress={() => handleReject(item.id)}
          disabled={respondMutation.isPending}
          style={styles.rejectButton}
        >
          拒绝
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={() => handleAccept(item.id)}
          loading={respondMutation.isPending}
          style={styles.acceptButton}
        >
          接受
        </Button>
      </View>
    </Card>
  )

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText(theme)}>暂无邀请</Text>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loading(theme)}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText(theme)}>加载中...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container(theme)}>
      <FlatList
        data={invitations}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  loading: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  }),

  loadingText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),

  list: {
    padding: 16,
  } as ViewStyle,

  invitationCard: {
    marginBottom: 12,
  } as ViewStyle,

  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  familyName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  }),

  inviteTime: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
  }),

  inviterLabel: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  }),

  inviterName: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
  }),

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  } as ViewStyle,

  rejectButton: {
    minWidth: 80,
  } as ViewStyle,

  acceptButton: {
    minWidth: 80,
  } as ViewStyle,

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  } as ViewStyle,

  emptyText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),
}
