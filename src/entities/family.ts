/**
 * 家庭组实体类型定义
 */

export type FamilyRole = 'admin' | 'member' | 'viewer'

export interface FamilyGroup {
  readonly id: number
  name: string
  description?: string
  creator_id: number
  is_active: boolean
  member_count?: number
  readonly created_at: string
  readonly updated_at: string
}

export interface FamilyMember {
  readonly id: number
  group_id: number
  user_id: number
  role: FamilyRole
  nickname?: string
  is_active: boolean
  readonly joined_at: string
  user_phone?: string
  user_nickname?: string
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
  readonly id: number
  family_group_id: number
  family_group_name: string
  sender_id: number
  receiver_id: number
  notification_type: string
  title: string
  content?: string
  related_reminder_id?: number
  related_completion_id?: number
  is_read: boolean
  read_at?: string
  readonly created_at: string
}

export interface InviteMemberRequest {
  familyGroupId: number
  phone: string
}

export interface RespondInvitationRequest {
  invitationId: number
  accept: boolean
}

export interface RemoveMemberRequest {
  familyGroupId: number
  userId: number
}
