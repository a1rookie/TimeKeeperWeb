/**
 * 用户相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@infrastructure/services/user.service'
import { queryKeys } from '@app/providers/query-client'
import { useAuthStore } from '@app/providers/auth.store'
import { Alert } from 'react-native'
import type {
  LoginRequest,
  RegisterRequest,
  SendSmsCodeRequest,
  AuthResponse,
  User,
} from '@entities/user'

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
      Alert.alert('成功', '注册成功，欢迎使用 TimeKeeper！')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '注册失败，请重试'
      Alert.alert('注册失败', message)
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
      // 成功时静默设置认证信息，不弹出提示
      setAuth(authResponse.token, authResponse.user)
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '登录失败，请检查手机号和验证码'
      Alert.alert('登录失败', message)
    },
  })
}

/**
 * 发送短信验证码
 */
export const useSendSmsCode = () => {
  return useMutation({
    mutationFn: (data: SendSmsCodeRequest) => userService.sendSmsCode(data),
    onSuccess: () => {
      Alert.alert('成功', '验证码已发送，请查看短信')
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || '发送验证码失败，请重试'
      Alert.alert('发送失败', message)
    },
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
      Alert.alert('成功', '已退出登录')
    },
    onError: (error: any) => {
      const message = error?.message || '退出登录失败'
      Alert.alert('错误', message)
      // 即使失败也要清除本地认证信息
      clearAuth()
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
      Alert.alert('成功', '信息更新成功')
    },
    onError: (error: any) => {
      const message = error?.message || '更新失败，请重试'
      Alert.alert('更新失败', message)
    },
  })
}
