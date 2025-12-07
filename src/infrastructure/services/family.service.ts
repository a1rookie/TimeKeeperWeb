/**
 * 家庭组 API 服务
 */

import { apiClient } from '@infrastructure/api/client'
import type { ApiResponse } from '@shared/types/api'
import type {
  FamilyGroup,
  FamilyMember,
  FamilyInvitation,
  CreateFamilyGroupRequest,
  UpdateFamilyGroupRequest,
  InviteMemberRequest,
  RespondInvitationRequest,
  RemoveMemberRequest,
} from '@entities/family'

export const familyService = {
  /**
   * 获取我的家庭组列表
   */
  getMyFamilyGroups: async (): Promise<ApiResponse<FamilyGroup[]>> => {
    return apiClient.get<FamilyGroup[]>('/api/v1/family/groups/my')
  },

  /**
   * 获取家庭组详情
   */
  getFamilyGroup: async (id: string): Promise<ApiResponse<FamilyGroup>> => {
    return apiClient.get<FamilyGroup>(`/api/v1/family/groups/${id}`)
  },

  /**
   * 创建家庭组
   */
  createFamilyGroup: async (data: CreateFamilyGroupRequest): Promise<ApiResponse<FamilyGroup>> => {
    return apiClient.post<FamilyGroup>('/api/v1/family/groups', data)
  },

  /**
   * 更新家庭组
   */
  updateFamilyGroup: async (
    id: string,
    data: UpdateFamilyGroupRequest
  ): Promise<ApiResponse<FamilyGroup>> => {
    return apiClient.put<FamilyGroup>(`/api/v1/family/groups/${id}`, data)
  },

  /**
   * 删除家庭组
   */
  deleteFamilyGroup: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/v1/family/groups/${id}`)
  },

  /**
   * 获取家庭组成员列表
   */
  getFamilyMembers: async (familyGroupId: string): Promise<ApiResponse<FamilyMember[]>> => {
    return apiClient.get<FamilyMember[]>(`/api/v1/family/groups/${familyGroupId}/members`)
  },

  /**
   * 邀请成员加入家庭组
   */
  inviteMember: async (data: InviteMemberRequest): Promise<ApiResponse<FamilyInvitation>> => {
    return apiClient.post<FamilyInvitation>('/api/v1/family-invitations', data)
  },

  /**
   * 获取我的待处理邀请
   */
  getPendingInvitations: async (): Promise<ApiResponse<FamilyInvitation[]>> => {
    return apiClient.get<FamilyInvitation[]>('/api/v1/family-invitations/pending')
  },

  /**
   * 响应邀请(接受/拒绝)
   */
  respondInvitation: async (data: RespondInvitationRequest): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/v1/family-invitations/respond', data)
  },

  /**
   * 移除家庭组成员
   */
  removeMember: async (data: RemoveMemberRequest): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/v1/family/groups/remove-member', data)
  },

  /**
   * 退出家庭组
   */
  leaveFamilyGroup: async (familyGroupId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/api/v1/family/groups/${familyGroupId}/leave`)
  },
}
