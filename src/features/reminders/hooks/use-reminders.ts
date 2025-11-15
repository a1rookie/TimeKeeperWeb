/**
 * 提醒相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reminderService } from '@infrastructure/services/reminder.service'
import { queryKeys } from '@app/providers/query-client'
import type { CreateReminderRequest, UpdateReminderRequest } from '@entities/reminder'

/**
 * 获取提醒列表
 */
export const useReminders = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.reminders.list(filters),
    queryFn: () => reminderService.getReminders(filters as any),
  })
}

/**
 * 获取提醒详情
 */
export const useReminder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.reminders.detail(id),
    queryFn: () => reminderService.getReminderById(id),
    enabled: !!id,
  })
}

/**
 * 创建提醒
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReminderRequest) => reminderService.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
    },
  })
}

/**
 * 更新提醒
 */
export const useUpdateReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderRequest }) =>
      reminderService.updateReminder(id, data),
    onSuccess: (_: unknown, variables: { id: string; data: UpdateReminderRequest }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.detail(variables.id) })
    },
  })
}

/**
 * 删除提醒
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reminderService.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
    },
  })
}

/**
 * 标记提醒完成
 */
export const useCompleteReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes, amount }: { id: string; notes?: string; amount?: number }) =>
      reminderService.completeReminder(id, notes, amount),
    onSuccess: (_: unknown, variables: { id: string; notes?: string; amount?: number }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.completions(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.statistics })
    },
  })
}

/**
 * 获取提醒完成记录
 */
export const useReminderCompletions = (reminderId: string) => {
  return useQuery({
    queryKey: queryKeys.reminders.completions(reminderId),
    queryFn: () => reminderService.getReminderCompletions(reminderId),
    enabled: !!reminderId,
  })
}

/**
 * 获取提醒统计
 */
export const useReminderStatistics = () => {
  return useQuery({
    queryKey: queryKeys.reminders.statistics,
    queryFn: () => reminderService.getReminderStatistics(),
  })
}
