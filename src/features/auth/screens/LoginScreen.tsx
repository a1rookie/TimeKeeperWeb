/**
 * 登录页面
 */

import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useLogin, useSendSmsCode } from '../hooks/use-auth'
import { useCountdown } from '@shared/utils/hooks'
import { validateField, phoneSchema, smsCodeSchema } from '@shared/utils/validation'
import { useNavigation } from '@react-navigation/native'

export const LoginScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation()
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [codeError, setCodeError] = useState('')

  const [countdown, startCountdown] = useCountdown(60)
  const canSendSms = countdown === 0 || countdown === 60

  const loginMutation = useLogin()
  const sendSmsMutation = useSendSmsCode()

  // 发送短信验证码
  const handleSendSmsCode = async () => {
    // 验证手机号
    const validation = validateField(phoneSchema, phone)
    if (!validation.success) {
      setPhoneError(validation.error || '')
      return
    }
    setPhoneError('')

    try {
      await sendSmsMutation.mutateAsync({ phone, purpose: 'login' })
      startCountdown()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 登录
  const handleLogin = async () => {
    // 验证表单
    const phoneValidation = validateField(phoneSchema, phone)
    const codeValidation = validateField(smsCodeSchema, smsCode)

    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error || '')
      return
    }
    if (!codeValidation.success) {
      setCodeError(codeValidation.error || '')
      return
    }

    setPhoneError('')
    setCodeError('')

    try {
      await loginMutation.mutateAsync({ phone, sms_code: smsCode })
      // 登录成功后会自动跳转到主页(RootNavigator 会响应 isAuthenticated 变化)
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container(theme)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent as any}>
        {/* Logo 区域 */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>⏰</Text>
          <Text style={styles.appName(theme)}>TimeKeeper</Text>
          <Text style={styles.slogan(theme)}>您的智能周期提醒助手</Text>
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

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            loading={loginMutation.isPending}
            disabled={!phone || !smsCode}
            style={styles.loginButton}
          >
            登录
          </Button>

          {/* 注册提示 */}
          <Text style={styles.registerHint(theme)}>
            还没有账号?{' '}
            <Text
              style={styles.registerLink(theme)}
              onPress={() => navigation.navigate('Register' as never)}
            >
              立即注册
            </Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoSection: {
    alignItems: 'center' as const,
    marginBottom: 48,
  },

  logo: {
    fontSize: 80,
    marginBottom: 16,
  },

  appName: (theme: ReturnType<typeof useTheme>) => ({
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: 8,
  }),

  slogan: (theme: ReturnType<typeof useTheme>) => ({
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
    marginBottom: 24,
  },

  smsCodeInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },

  smsButton: {
    marginTop: 24,
    minWidth: 120,
  },

  loginButton: {
    marginBottom: 16,
  },

  registerHint: (theme: ReturnType<typeof useTheme>) => ({
    textAlign: 'center' as const,
    fontSize: 14,
    color: theme.colors.textSecondary,
  }),

  registerLink: (theme: ReturnType<typeof useTheme>) => ({
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  }),
}
