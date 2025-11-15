/**
 * 家庭组实体类型定义
 */

export type FamilyRole = 'admin' | 'member' | 'viewer'

export interface FamilyGroup {
  readonly id: string
  name: string
  description?: string
  inviteCode: string
  memberCount?: number
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface FamilyMember {
  readonly id: string
  familyGroupId: string
  userId: string
  role: FamilyRole
  nickname?: string
  readonly joinedAt: Date
}

export interface CreateFamilyGroupRequest {
  name: string
  description?: string
}

export interface UpdateFamilyGroupRequest {
  name?: string
  description?: string
}

export interface UpdateFamilyMemberRequest {
  role: FamilyRole
}

export interface FamilyInvitation {
  readonly id: string
  familyGroupId: string
  familyGroupName: string
  inviterId: string
  inviterNickname: string
  inviterName?: string
  inviteePhone: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  readonly createdAt: Date
  readonly expiresAt: Date
}

export interface InviteMemberRequest {
  familyGroupId: string
  phone: string
}

export interface RespondInvitationRequest {
  invitationId: string
  accept: boolean
}

export interface RemoveMemberRequest {
  familyGroupId: string
  userId: string
}
