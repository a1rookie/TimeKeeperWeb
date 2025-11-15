/**
 * 邀请成员页面
 */

import React, { useState } from 'react'
import { Text, ScrollView, ViewStyle, TextStyle, KeyboardAvoidingView, Platform } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { useTheme } from '@shared/theme'
import { Button, Input, Card } from '@shared/components'
import { useInviteMember } from '../hooks/use-family'
import { validateField, phoneSchema } from '@shared/utils/validation'
import type { FamilyStackParamList } from '@app/navigation/types'

type InviteMemberRouteProp = RouteProp<FamilyStackParamList, 'InviteMember'>

export const InviteMemberScreen: React.FC = () => {
  const theme = useTheme()
  const route = useRoute<InviteMemberRouteProp>()
  const navigation = useNavigation()

  const { familyGroupId } = route.params

  const inviteMutation = useInviteMember()

  // 表单状态
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // 处理提交
  const handleSubmit = async () => {
    // 验证手机号
    const phoneValidation = validateField(phoneSchema, phone)

    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error || '')
      return
    }

    setPhoneError('')

    try {
      await inviteMutation.mutateAsync({
        familyGroupId,
        phone,
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
        {/* 说明卡片 */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle(theme)}>邀请说明</Text>
          <Text style={styles.infoText(theme)}>
            输入要邀请的用户手机号,系统将向其发送邀请通知。受邀用户可在"我的邀请"中查看并接受邀请。
          </Text>
        </Card>

        {/* 表单 */}
        <Input
          label="手机号"
          placeholder="请输入受邀用户的手机号"
          value={phone}
          onChangeText={setPhone}
          error={phoneError}
          keyboardType="phone-pad"
          required
          containerStyle={styles.input}
        />

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit}
          loading={inviteMutation.isPending}
          disabled={!phone}
          style={styles.submitButton}
        >
          发送邀请
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

  infoCard: {
    marginBottom: 24,
    backgroundColor: '#E3F2FD',
  } as ViewStyle,

  infoTitle: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  infoText: (theme: ReturnType<typeof useTheme>): TextStyle => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }),

  input: {
    marginBottom: 16,
  } as ViewStyle,

  submitButton: {
    marginTop: 8,
  } as ViewStyle,
}
