/**
 * 创建模板页面
 */

import React, { useState } from 'react'
import {
  ScrollView,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useCreateTemplate } from '../hooks/use-templates'
import { validateField } from '@shared/utils/validation'
import { z } from 'zod'

const templateNameSchema = z
  .string()
  .min(1, '模板名称不能为空')
  .max(30, '模板名称不能超过30个字符')

const templateDescriptionSchema = z
  .string()
  .max(200, '描述不能超过200个字符')

export const CreateTemplateScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  const createMutation = useCreateTemplate()

  // 表单状态
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 错误状态
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  // 处理提交
  const handleSubmit = async () => {
    // 验证表单
    const titleValidation = validateField(templateNameSchema, title)
    const descriptionValidation = description
      ? validateField(templateDescriptionSchema, description)
      : { success: true }

    if (!titleValidation.success) {
      setTitleError(titleValidation.error || '')
      return
    }
    if (!descriptionValidation.success) {
      setDescriptionError(descriptionValidation.error || '')
      return
    }

    setTitleError('')
    setDescriptionError('')

    try {
      await createMutation.mutateAsync({
        title,
        ...(description ? { description } : {}),
        category: 'other',
        recurrenceType: 'none',
        recurrenceConfig: {},
        remindAdvanceDays: 0,
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
          label="模板名称"
          placeholder="请输入模板名称"
          value={title}
          onChangeText={setTitle}
          error={titleError}
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
          disabled={!title}
          style={styles.submitButton}
        >
          创建模板
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
