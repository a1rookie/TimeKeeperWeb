/**
 * 家庭组相关 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { familyService } from '@infrastructure/services/family.service'
import type {
  CreateFamilyGroupRequest,
  UpdateFamilyGroupRequest,
  InviteMemberRequest,
  RespondInvitationRequest,
  RemoveMemberRequest,
} from '@entities/family'

// Query Keys
export const familyKeys = {
  all: ['family'] as const,
  groups: () => [...familyKeys.all, 'groups'] as const,
  group: (id: number) => [...familyKeys.all, 'group', id] as const,
  members: (groupId: number) => [...familyKeys.all, 'members', groupId] as const,
  invitations: () => [...familyKeys.all, 'invitations'] as const,
}

/**
 * 获取我的家庭组列表
 */
export const useMyFamilyGroups = () => {
  return useQuery({
    queryKey: familyKeys.groups(),
    queryFn: async () => {
      const response = await familyService.getMyFamilyGroups()
      return response.data
    },
  })
}

/**
 * 获取家庭组详情
 */
export const useFamilyGroup = (id: number) => {
  return useQuery({
    queryKey: familyKeys.group(id),
    queryFn: async () => {
      const response = await familyService.getFamilyGroup(id)
      return response.data
    },
    enabled: !!id,
  })
}

/**
 * 获取家庭组成员列表
 */
export const useFamilyMembers = (familyGroupId: number) => {
  return useQuery({
    queryKey: familyKeys.members(familyGroupId),
    queryFn: async () => {
      const response = await familyService.getFamilyMembers(familyGroupId)
      return response.data
    },
    enabled: !!familyGroupId,
  })
}

/**
 * 获取待处理邀请
 */
export const usePendingInvitations = () => {
  return useQuery({
    queryKey: familyKeys.invitations(),
    queryFn: async () => {
      const response = await familyService.getPendingInvitations()
      return response.data
    },
  })
}

/**
 * 创建家庭组
 */
export const useCreateFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFamilyGroupRequest) => familyService.createFamilyGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
      Alert.alert('成功', '家庭组创建成功')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '创建家庭组失败，请重试'
      Alert.alert('创建失败', message)
    },
  })
}

/**
 * 更新家庭组
 */
export const useUpdateFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFamilyGroupRequest }) =>
      familyService.updateFamilyGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.group(variables.id) })
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
      Alert.alert('成功', '家庭组信息已更新')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '更新家庭组失败，请重试'
      Alert.alert('更新失败', message)
    },
  })
}

/**
 * 删除家庭组
 */
export const useDeleteFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => familyService.deleteFamilyGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
      Alert.alert('成功', '家庭组已删除')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '删除家庭组失败，请重试'
      Alert.alert('删除失败', message)
    },
  })
}

/**
 * 邀请成员
 */
export const useInviteMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InviteMemberRequest) => familyService.inviteMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.members(variables.familyGroupId) })
      Alert.alert('成功', '邀请已发送')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '邀请成员失败，请重试'
      Alert.alert('邀请失败', message)
    },
  })
}

/**
 * 响应邀请
 */
export const useRespondInvitation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RespondInvitationRequest) => familyService.respondInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.invitations() })
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
      Alert.alert('成功', '邀请已响应')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '响应邀请失败，请重试'
      Alert.alert('响应失败', message)
    },
  })
}

/**
 * 移除成员
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RemoveMemberRequest) => familyService.removeMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.members(variables.familyGroupId) })
      Alert.alert('成功', '成员已移除')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '移除成员失败，请重试'
      Alert.alert('移除失败', message)
    },
  })
}

/**
 * 退出家庭组
 */
export const useLeaveFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (familyGroupId: number) => familyService.leaveFamilyGroup(familyGroupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
      Alert.alert('成功', '已退出家庭组')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '退出家庭组失败，请重试'
      Alert.alert('退出失败', message)
    },
  })
}
