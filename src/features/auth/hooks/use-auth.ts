/**
 * 用户相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@infrastructure/services/user.service'
import { queryKeys } from '@app/providers/query-client'
import { useAuthStore } from '@app/providers/auth.store'
import type { LoginRequest, RegisterRequest, SendSmsCodeRequest, AuthResponse, User } from '@entities/user'

/**
 * 获取当前用户信息
 */
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: () => userService.getCurrentUser(),
    enabled: isAuthenticated,
  })
}

/**
 * 用户注册
 */
export const useRegister = () => {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterRequest) => userService.register(data),
    onSuccess: (authResponse: AuthResponse) => {
      setAuth(authResponse.token, authResponse.user)
    },
  })
}

/**
 * 用户登录
 */
export const useLogin = () => {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginRequest) => userService.login(data),
    onSuccess: (authResponse: AuthResponse) => {
      setAuth(authResponse.token, authResponse.user)
    },
  })
}

/**
 * 发送短信验证码
 */
export const useSendSmsCode = () => {
  return useMutation({
    mutationFn: (data: SendSmsCodeRequest) => userService.sendSmsCode(data),
  })
}

/**
 * 退出登录
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}

/**
 * 更新用户信息
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateUser(data),
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current })
    },
  })
}
