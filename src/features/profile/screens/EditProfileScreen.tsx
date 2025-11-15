/**
 * 编辑资料页面
 */

import React, { useState, useEffect } from 'react'
import { ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useAuthStore } from '@app/providers/auth.store'
import { useUpdateUser } from '../../auth/hooks/use-auth'
import { validateField } from '@shared/utils/validation'
import { z } from 'zod'

const nicknameSchema = z
  .string()
  .min(1, '昵称不能为空')
  .max(20, '昵称不能超过20个字符')

export const EditProfileScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  const user = useAuthStore((state) => state.user)
  const updateMutation = useUpdateUser()

  // 表单状态
  const [nickname, setNickname] = useState('')

  // 错误状态
  const [nicknameError, setNicknameError] = useState('')

  // 初始化表单
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
    }
  }, [user])

  // 处理提交
  const handleSubmit = async () => {
    // 验证表单
    const nicknameValidation = validateField(nicknameSchema, nickname)

    if (!nicknameValidation.success) {
      setNicknameError(nicknameValidation.error || '')
      return
    }

    setNicknameError('')

    try {
      await updateMutation.mutateAsync({
        nickname,
      })
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container(theme)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* 表单 */}
        <Input
          label="昵称"
          placeholder="请输入昵称"
          value={nickname}
          onChangeText={setNickname}
          error={nicknameError}
          required
          containerStyle={styles.input}
        />

        {/* TODO: 头像上传 */}

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit}
          loading={updateMutation.isPending}
          disabled={!nickname}
          style={styles.submitButton}
        >
          保存修改
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  content: {
    padding: 16,
  } as ViewStyle,

  input: {
    marginBottom: 16,
  } as ViewStyle,

  submitButton: {
    marginTop: 8,
  } as ViewStyle,
}
