/**
 * React Query 配置和 Hooks
 * 管理服务端状态（API 数据）
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * 缓存策略配置
 */
export const CACHE_STRATEGIES = {
  realtime: {
    staleTime: 0,
    gcTime: 1000,
  },
  frequent: {
    staleTime: 30000, // 30秒
    gcTime: 300000, // 5分钟
  },
  stable: {
    staleTime: 300000, // 5分钟
    gcTime: 1800000, // 30分钟
  },
  static: {
    staleTime: 3600000, // 1小时
    gcTime: 86400000, // 24小时
  },
} as const

/**
 * 创建 Query Client 实例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...CACHE_STRATEGIES.stable,
      retry: (failureCount: number, error: unknown) => {
        // 仅在 5xx 错误时重试，最多 3 次
        const apiError = error as { code?: number }
        if (apiError?.code && apiError.code >= 500 && failureCount < 3) {
          return true
        }
        return false
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
})

/**
 * Query Keys 工厂函数
 * 统一管理所有查询的 key
 */
export const queryKeys = {
  // 用户相关
  user: {
    current: ['user', 'current'] as const,
  },

  // 提醒相关
  reminders: {
    all: ['reminders'] as const,
    list: (filters?: Record<string, unknown>) => ['reminders', 'list', filters] as const,
    detail: (id: string | number) => ['reminders', 'detail', id] as const,
    completions: (id: string | number) => ['reminders', 'completions', id] as const,
    statistics: ['reminders', 'statistics'] as const,
  },

  // 模板相关
  templates: {
    system: ['templates', 'system'] as const,
    custom: ['templates', 'custom'] as const,
    shared: ['templates', 'shared'] as const,
  },

  // 家庭组相关
  family: {
    groups: ['family', 'groups'] as const,
    detail: (id: string | number) => ['family', 'detail', id] as const,
    members: (groupId: string | number) => ['family', 'members', groupId] as const,
  },
} as const
