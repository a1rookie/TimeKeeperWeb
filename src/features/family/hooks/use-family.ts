/**
 * 家庭组相关 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  group: (id: string) => [...familyKeys.all, 'group', id] as const,
  members: (groupId: string) => [...familyKeys.all, 'members', groupId] as const,
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
export const useFamilyGroup = (id: string) => {
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
export const useFamilyMembers = (familyGroupId: string) => {
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
    },
  })
}

/**
 * 更新家庭组
 */
export const useUpdateFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFamilyGroupRequest }) =>
      familyService.updateFamilyGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.group(variables.id) })
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
    },
  })
}

/**
 * 删除家庭组
 */
export const useDeleteFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => familyService.deleteFamilyGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
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
    },
  })
}

/**
 * 退出家庭组
 */
export const useLeaveFamilyGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (familyGroupId: string) => familyService.leaveFamilyGroup(familyGroupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.groups() })
    },
  })
}
