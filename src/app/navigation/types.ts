/**
 * 导航类型定义
 * 定义所有路由参数类型，实现类型安全的导航
 */

import type { Reminder } from '@entities/reminder'

/**
 * 认证流程路由参数
 */
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
}

/**
 * 主要功能路由参数
 */
export type MainTabParamList = {
  RemindersTab: undefined
  FamilyTab: undefined
  ProfileTab: undefined
}

/**
 * 提醒模块路由参数
 */
export type RemindersStackParamList = {
  ReminderList: undefined
  ReminderDetail: { id: number }
  CreateReminder: { category?: Reminder['category'] }
  EditReminder: { id: number }
  CompletionRecords: { id: number }
}

/**
 * 家庭模块路由参数
 */
export type FamilyStackParamList = {
  FamilyList: undefined
  FamilyDetail: { familyGroupId: number }
  CreateFamily: undefined
  EditFamily: { familyGroupId: number }
  InviteMember: { familyGroupId: number }
  Invitations: undefined
}

/**
 * 个人中心路由参数
 */
export type ProfileStackParamList = {
  ProfileHome: undefined
  EditProfile: undefined
  Settings: undefined
  About: undefined
}

/**
 * 模板模块路由参数
 */
export type TemplatesStackParamList = {
  TemplateMarket: undefined
  TemplateDetail: { id: number }
  MyTemplates: undefined
  CreateTemplate: undefined
}

/**
 * 根导航路由参数
 */
export type RootStackParamList = {
  // 认证流程
  Auth: undefined
  // 主应用
  Main: undefined
  // 模板页面
  TemplateMarket: undefined
  TemplateDetail: { id: number }
  MyTemplates: undefined
  CreateTemplate: undefined
  // 全局模态
  TemplateModal: { templateId: number }
  VoiceInputModal: undefined
}

/**
 * 深度链接配置
 */
export const LinkingConfiguration = {
  prefixes: ['timekeeper://', 'https://timekeeper.app'],
  config: {
    screens: {
      Auth: {
        path: 'auth',
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        path: '',
        screens: {
          RemindersTab: {
            path: 'reminders',
            screens: {
              ReminderList: '',
              ReminderDetail: 'detail/:id',
              CreateReminder: 'create',
              EditReminder: 'edit/:id',
              CompletionRecords: 'completions/:id',
            },
          },
          FamilyTab: {
            path: 'family',
            screens: {
              FamilyList: '',
              FamilyDetail: 'detail/:id',
              CreateFamily: 'create',
              InviteMember: 'invite/:familyId',
            },
          },
          ProfileTab: {
            path: 'profile',
            screens: {
              ProfileHome: '',
              EditProfile: 'edit',
              Settings: 'settings',
              About: 'about',
            },
          },
        },
      },
      TemplateModal: 'template/:templateId',
      VoiceInputModal: 'voice-input',
    },
  },
}
