/**
 * 编辑家庭组页面
 */

import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  Text,
  TextStyle,
} from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useFamilyGroup, useUpdateFamilyGroup } from '../hooks/use-family'
import { validateField } from '@shared/utils/validation'
import { z } from 'zod'
import type { FamilyStackParamList } from '@app/navigation/types'

type EditFamilyRouteProp = RouteProp<FamilyStackParamList, 'EditFamily'>

const familyNameSchema = z
  .string()
  .min(1, '家庭组名称不能为空')
  .max(20, '家庭组名称不能超过20个字符')

const familyDescriptionSchema = z
  .string()
  .max(100, '描述不能超过100个字符')

export const EditFamilyScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<EditFamilyRouteProp>()
  const navigation = useNavigation()

  const { familyGroupId } = route.params

  const { data: family, isLoading } = useFamilyGroup(familyGroupId)
  const updateMutation = useUpdateFamilyGroup()

  // 表单状态
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // 错误状态
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  // 初始化表单
  useEffect(() => {
    if (family) {
      setName(family.name)
      setDescription(family.description || '')
    }
  }, [family])

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
      await updateMutation.mutateAsync({
        id: familyGroupId,
        data: {
          name,
          ...(description ? { description } : {}),
        },
      })
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loading(theme)}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText(theme)}>加载中...</Text>
      </View>
    )
  }

  if (!family) {
    return (
      <View style={styles.loading(theme)}>
        <Text style={styles.loadingText(theme)}>家庭组不存在</Text>
      </View>
    )
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
          loading={updateMutation.isPending}
          disabled={!name}
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

  loading: (theme: ReturnType<typeof useTheme>): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  }),

  loadingText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),

  input: {
    marginBottom: 16,
  } as ViewStyle,

  submitButton: {
    marginTop: 8,
  } as ViewStyle,
}
