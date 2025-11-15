/**
 * 创建提醒页面
 */

import React, { useState } from 'react'
import { View, ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { getCategoryName } from '@shared/components/CategoryIcon'
import { useCreateReminder } from '../hooks/use-reminders'
import { validateField, reminderTitleSchema, reminderDescriptionSchema } from '@shared/utils/validation'
import type { RemindersStackParamList } from '@app/navigation/types'
import type { ReminderCategory } from '@entities/reminder'

type CreateReminderRouteProp = RouteProp<RemindersStackParamList, 'CreateReminder'>
type NavigationProp = NativeStackNavigationProp<RemindersStackParamList, 'CreateReminder'>

const CATEGORIES: ReminderCategory[] = ['rent', 'health', 'pet', 'finance', 'document', 'memorial']

export const CreateReminderScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<CreateReminderRouteProp>()
  const navigation = useNavigation<NavigationProp>()

  const createMutation = useCreateReminder()

  // 表单状态
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReminderCategory>(route.params?.category || 'rent')
  const [remindTime, setRemindTime] = useState('')
  const [amount, setAmount] = useState('')

  // 错误状态
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

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

    if (!remindTime) {
      // TODO: 显示日期时间选择器错误
      return
    }

    setTitleError('')
    setDescriptionError('')

    try {
      await createMutation.mutateAsync({
        title,
        ...(description ? { description } : {}),
        category,
        recurrenceType: 'none',
        recurrenceConfig: { time: remindTime },
        remindAdvanceDays: 0,
        ...(amount ? { amount: parseFloat(amount) } : {}),
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

        {/* 金额输入(仅财务和房租类别) */}
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
          loading={createMutation.isPending}
          disabled={!title || !remindTime}
          style={styles.submitButton}
        >
          创建提醒
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
