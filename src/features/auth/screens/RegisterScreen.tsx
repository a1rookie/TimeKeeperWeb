/**
 * 注册页面
 */

import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useRegister, useSendSmsCode } from '../hooks/use-auth'
import { useCountdown } from '@shared/utils/hooks'
import { validateField, phoneSchema, smsCodeSchema, nicknameSchema } from '@shared/utils/validation'
import { useFocusEffect } from '@react-navigation/native'

export const RegisterScreen: React.FC = () => {
  const theme = useTheme()
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nicknameError, setNicknameError] = useState('')

  const [countdown, startCountdown, resetCountdown] = useCountdown(60)
  const canSendSms = countdown === 0

  const registerMutation = useRegister()
  const sendSmsMutation = useSendSmsCode()

  // 页面聚焦时重置倒计时和表单
  useFocusEffect(
    React.useCallback(() => {
      resetCountdown()
      setSmsCode('')
      setPhoneError('')
      setCodeError('')
    }, [resetCountdown])
  )

  // 发送短信验证码
  const handleSendSmsCode = async () => {
    const validation = validateField(phoneSchema, phone)
    if (!validation.success) {
      setPhoneError(validation.error || '')
      return
    }
    setPhoneError('')
    try {
      await sendSmsMutation.mutateAsync({ phone })
      startCountdown()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 注册
  const handleRegister = async () => {
    // 验证表单
    const phoneValidation = validateField(phoneSchema, phone)
    const codeValidation = validateField(smsCodeSchema, smsCode)
    let passwordValidation: { success: boolean; error?: string } = { success: false, error: '' }
    
    if (!password || !confirmPassword) {
      passwordValidation = { success: false, error: '密码不能为空' }
    } else if (password.length < 6) {
      passwordValidation = { success: false, error: '密码至少6位' }
    } else if (password !== confirmPassword) {
      passwordValidation = { success: false, error: '两次密码输入不一致' }
    } else {
      passwordValidation = { success: true, error: '' }
    }

    const nicknameValidation = nickname
      ? validateField(nicknameSchema, nickname)
      : { success: true }

    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error || '')
      return
    }
    if (!codeValidation.success) {
      setCodeError(codeValidation.error || '')
      return
    }
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error || '')
      return
    }
    if (!nicknameValidation.success) {
      setNicknameError(nicknameValidation.error || '')
      return
    }

    setPhoneError('')
    setCodeError('')
    setPasswordError('')
    setNicknameError('')

    try {
      await registerMutation.mutateAsync({
        phone,
        password, // 使用用户设定的密码
        sms_code: smsCode, // 验证短信码
        ...(nickname ? { nickname } : {}),
      })
      // 注册成功后会自动跳转到主页
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container(theme)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 标题区域 */}
        <View style={styles.headerSection}>
          <Text style={styles.title(theme)}>欢迎注册</Text>
          <Text style={styles.subtitle(theme)}>创建账号,开始管理您的提醒</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection as any}>
          <Input
            label="手机号"
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            required
            containerStyle={styles.input}
          />

          <View style={styles.smsCodeRow}>
            <Input
              label="验证码"
              placeholder="请输入验证码"
              keyboardType="number-pad"
              maxLength={6}
              value={smsCode}
              onChangeText={setSmsCode}
              error={codeError}
              required
              containerStyle={styles.smsCodeInput}
            />
            <Button
              variant="outline"
              size="md"
              onPress={handleSendSmsCode}
              disabled={!canSendSms || sendSmsMutation.isPending}
              loading={sendSmsMutation.isPending}
              style={styles.smsButton}
            >
              {canSendSms ? '发送验证码' : `${countdown}秒后重试`}
            </Button>
          </View>

          <Input
            label="密码"
            placeholder="请输入密码（至少6位）"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            required
            containerStyle={styles.input}
          />

          <Input
            label="确认密码"
            placeholder="请再次输入密码"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={passwordError}
            required
            containerStyle={styles.input}
          />

          <Input
            label="昵称"
            placeholder="请输入昵称(可选)"
            maxLength={20}
            value={nickname}
            onChangeText={setNickname}
            error={nicknameError}
            containerStyle={styles.input}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleRegister}
            loading={registerMutation.isPending}
            disabled={!phone || !smsCode || !password || !confirmPassword}
            style={styles.registerButton}
          >
            注册
          </Button>

          {/* 服务条款提示 */}
          <Text style={styles.termsHint(theme)}>
            注册即表示同意 <Text style={styles.termsLink(theme)}>《用户协议》</Text>和
            <Text style={styles.termsLink(theme)}>《隐私政策》</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = {
  container: (theme: ReturnType<typeof useTheme>) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  headerSection: {
    marginBottom: 32,
  },

  title: (theme: ReturnType<typeof useTheme>) => ({
    fontSize: 28,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  subtitle: (theme: ReturnType<typeof useTheme>) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),

  formSection: {
    width: '100%',
  },

  input: {
    marginBottom: 16,
  },

  smsCodeRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 16,
  },

  smsCodeInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },

  smsButton: {
    minHeight: 36,
    marginTop: 24,
    minWidth: 120,
  },

  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },

  termsHint: (theme: ReturnType<typeof useTheme>) => ({
    textAlign: 'center' as const,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  }),

  termsLink: (theme: ReturnType<typeof useTheme>) => ({
    color: theme.colors.primary,
  }),
}
