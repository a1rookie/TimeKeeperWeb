/**
 * 模板相关 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  detail: (id: string) => [...templateKeys.all, id] as const,
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
export function useTemplate(id: string) {
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
    },
  })
}

/**
 * 更新模板
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateRequest }) =>
      templateService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.my() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) })
    },
  })
}

/**
 * 删除模板
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.my() })
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
    },
  })
}

/**
 * 点赞模板
 */
export function useLikeTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.likeTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) })
    },
  })
}

/**
 * 取消点赞
 */
export function useUnlikeTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.unlikeTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) })
    },
  })
}

/**
 * 收藏模板
 */
export function useFavoriteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.favoriteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
    },
  })
}

/**
 * 取消收藏
 */
export function useUnfavoriteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.unfavoriteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: templateKeys.public() })
    },
  })
}
