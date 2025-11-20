/**
 * 创建家庭组页面
 */

import React, { useState } from 'react'
import { ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useCreateFamilyGroup } from '../hooks/use-family'
import { validateField } from '@shared/utils/validation'
import { z } from 'zod'

const familyNameSchema = z
  .string()
  .min(1, '家庭组名称不能为空')
  .max(20, '家庭组名称不能超过20个字符')

const familyDescriptionSchema = z.string().max(100, '描述不能超过100个字符')

export const CreateFamilyScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  const createMutation = useCreateFamilyGroup()

  // 表单状态
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // 错误状态
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  // 处理提交
  const handleSubmit = async () => {
    // 验证表单
    const nameValidation = validateField(familyNameSchema, name)
    const descriptionValidation = description
      ? validateField(familyDescriptionSchema, description)
      : { success: true }

    if (!nameValidation.success) {
      setNameError(nameValidation.error || '')
      return
    }
    if (!descriptionValidation.success) {
      setDescriptionError(descriptionValidation.error || '')
      return
    }

    setNameError('')
    setDescriptionError('')

    try {
      await createMutation.mutateAsync({
        name,
        ...(description ? { description } : {}),
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
          label="家庭组名称"
          placeholder="请输入家庭组名称"
          value={name}
          onChangeText={setName}
          error={nameError}
          required
          containerStyle={styles.input}
        />

        <Input
          label="描述"
          placeholder="请输入描述(可选)"
          value={description}
          onChangeText={setDescription}
          error={descriptionError}
          multiline
          numberOfLines={4}
          containerStyle={styles.input}
        />

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit}
          loading={createMutation.isPending}
          disabled={!name}
          style={styles.submitButton}
        >
          创建家庭组
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
