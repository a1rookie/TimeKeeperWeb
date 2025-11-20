/**
 * 编辑提醒页面
 */

import React, { useState, useEffect } from 'react'
import { View, ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Button, Input, Loading, Error } from '@shared/components'
import { getCategoryName } from '@shared/components/CategoryIcon'
import { useReminder, useUpdateReminder } from '../hooks/use-reminders'
import {
  validateField,
  reminderTitleSchema,
  reminderDescriptionSchema,
} from '@shared/utils/validation'
import type { RemindersStackParamList } from '@app/navigation/types'
import type { ReminderCategory } from '@entities/reminder'

type EditReminderRouteProp = RouteProp<RemindersStackParamList, 'EditReminder'>
type NavigationProp = NativeStackNavigationProp<RemindersStackParamList, 'EditReminder'>

const CATEGORIES: ReminderCategory[] = ['rent', 'health', 'pet', 'finance', 'document', 'memorial']

export const EditReminderScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<EditReminderRouteProp>()
  const navigation = useNavigation<NavigationProp>()

  const { id } = route.params

  // 查询提醒详情
  const { data: reminder, isLoading, isError, refetch } = useReminder(id)

  // 更新提醒
  const updateMutation = useUpdateReminder()

  // 表单状态
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReminderCategory>('rent')
  const [remindTime, setRemindTime] = useState('')
  const [amount, setAmount] = useState('')

  // 错误状态
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  // 初始化表单
  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title)
      setDescription(reminder.description || '')
      setCategory(reminder.category)
      setRemindTime(reminder.nextRemindTime.toString())
      setAmount(reminder.amount?.toString() || '')
    }
  }, [reminder])

  // 处理提交
  const handleSubmit = async () => {
    // 验证表单
    const titleValidation = validateField(reminderTitleSchema, title)
    const descriptionValidation = description
      ? validateField(reminderDescriptionSchema, description)
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
      await updateMutation.mutateAsync({
        id,
        data: {
          title,
          ...(description ? { description } : {}),
          category,
          recurrenceConfig: { time: remindTime },
          ...(amount ? { amount: parseFloat(amount) } : {}),
        },
      })
      navigation.goBack()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 加载中
  if (isLoading) {
    return <Loading text="加载中..." fullScreen />
  }

  // 错误
  if (isError || !reminder) {
    return <Error title="加载失败" message="请稍后重试" onRetry={refetch} fullScreen />
  }

  return (
    <KeyboardAvoidingView
      style={styles.container(theme)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* 分类选择 */}
        <View style={styles.categorySection}>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setCategory(cat)}
              style={styles.categoryButton}
            >
              {getCategoryName(cat)}
            </Button>
          ))}
        </View>

        {/* 表单 */}
        <Input
          label="提醒标题"
          placeholder="请输入提醒标题"
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

        {/* TODO: 日期时间选择器 */}
        <Input
          label="提醒时间"
          placeholder="选择提醒时间"
          value={remindTime}
          onChangeText={setRemindTime}
          required
          containerStyle={styles.input}
        />

        {/* 金额输入 */}
        {(category === 'rent' || category === 'finance') && (
          <Input
            label="金额"
            placeholder="请输入金额(可选)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            containerStyle={styles.input}
          />
        )}

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit}
          loading={updateMutation.isPending}
          disabled={!title || !remindTime}
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

  categorySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  } as ViewStyle,

  categoryButton: {
    marginRight: 8,
    marginBottom: 8,
  } as ViewStyle,

  input: {
    marginBottom: 16,
  } as ViewStyle,

  submitButton: {
    marginTop: 8,
  } as ViewStyle,
}
