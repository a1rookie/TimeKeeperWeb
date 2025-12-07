/**
 * 模板相关 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { templateService } from '@infrastructure/services/template.service'
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  UseTemplateRequest,
  TemplateQueryParams,
} from '@entities/template'

// Query keys
const templateKeys = {
  all: ['templates'] as const,
  public: () => [...templateKeys.all, 'public'] as const,
  my: () => [...templateKeys.all, 'my'] as const,
  favorites: () => [...templateKeys.all, 'favorites'] as const,
  detail: (id: number) => [...templateKeys.all, id] as const,
}

/**
 * 获取公共模板列表
 */
export function usePublicTemplates(params?: TemplateQueryParams) {
  return useQuery({
    queryKey: templateKeys.public(),
    queryFn: () => templateService.getPublicTemplates(params),
  })
}

/**
 * 获取用户的自定义模板
 */
export function useMyTemplates() {
  return useQuery({
    queryKey: templateKeys.my(),
    queryFn: () => templateService.getMyTemplates(),
  })
}

/**
 * 获取模板详情
 */
export function useTemplate(id: number) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templateService.getTemplate(id),
    enabled: !!id,
  })
}

/**
 * 获取收藏的模板
 */
export function useFavoriteTemplates() {
  return useQuery({
    queryKey: templateKeys.favorites(),
    queryFn: () => templateService.getFavoriteTemplates(),
  })
}

/**
 * 创建模板
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.my() })
      Alert.alert('成功', '模板创建成功')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '创建模板失败，请重试'
      Alert.alert('创建失败', message)
    },
  })
}

/**
 * 更新模板
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateRequest }) =>
      templateService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.my() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) })
      Alert.alert('成功', '模板已更新')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '更新模板失败，请重试'
      Alert.alert('更新失败', message)
    },
  })
}

/**
 * 删除模板
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => templateService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.my() })
      Alert.alert('成功', '模板已删除')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '删除模板失败，请重试'
      Alert.alert('删除失败', message)
    },
  })
}

/**
 * 使用模板创建提醒
 */
export function useTemplateToReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UseTemplateRequest) => templateService.useTemplate(data),
    onSuccess: () => {
      // 刷新提醒列表
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      Alert.alert('成功', '提醒已创建')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '使用模板失败，请重试'
      Alert.alert('创建失败', message)
    },
  })
}

/**
 * 点赞模板
 */
export function useLikeTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => templateService.likeTemplate(id),
    onSuccess: (_: unknown, id: number) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) })
      Alert.alert('成功', '点赞成功')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '点赞失败，请重试'
      Alert.alert('点赞失败', message)
    },
  })
}

/**
 * 取消点赞
 */
export function useUnlikeTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => templateService.unlikeTemplate(id),
    onSuccess: (_: unknown, id: number) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) })
      Alert.alert('成功', '点赞已取消')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '取消点赞失败，请重试'
      Alert.alert('取消失败', message)
    },
  })
}

/**
 * 收藏模板
 */
export function useFavoriteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => templateService.favoriteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      Alert.alert('成功', '已收藏模板')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '收藏失败，请重试'
      Alert.alert('收藏失败', message)
    },
  })
}

/**
 * 取消收藏
 */
export function useUnfavoriteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => templateService.unfavoriteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      Alert.alert('成功', '已取消收藏')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '取消收藏失败，请重试'
      Alert.alert('取消失败', message)
    },
  })
}
