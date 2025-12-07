/**
 * 提醒相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
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
export const useReminder = (id: number) => {
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
      Alert.alert('成功', '提醒创建成功')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '创建提醒失败，请重试'
      Alert.alert('创建失败', message)
    },
  })
}

/**
 * 更新提醒
 */
export const useUpdateReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReminderRequest }) =>
      reminderService.updateReminder(id, data),
    onSuccess: (_: unknown, variables: { id: number; data: UpdateReminderRequest }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.detail(variables.id) })
      Alert.alert('成功', '提醒更新成功')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '更新提醒失败，请重试'
      Alert.alert('更新失败', message)
    },
  })
}

/**
 * 删除提醒
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => reminderService.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
      Alert.alert('成功', '提醒已删除')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '删除提醒失败，请重试'
      Alert.alert('删除失败', message)
    },
  })
}

/**
 * 标记提醒完成
 */
export const useCompleteReminder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes, amount }: { id: number; notes?: string; amount?: number }) =>
      reminderService.completeReminder(id, notes, amount),
    onSuccess: (_: unknown, variables: { id: number; notes?: string; amount?: number }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.completions(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.statistics })
      Alert.alert('成功', '提醒已完成')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '完成提醒失败，请重试'
      Alert.alert('完成失败', message)
    },
  })
}

/**
 * 获取提醒完成记录
 */
export const useReminderCompletions = (reminderId: number) => {
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
