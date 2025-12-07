/**
 * 登录页面 - 简化版设计
 */

import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '@shared/theme'
import { Button, Input } from '@shared/components'
import { useLogin, useSendSmsCode } from '../hooks/use-auth'
import { useCountdown } from '@shared/utils/hooks'
import { validateField, phoneSchema, smsCodeSchema } from '@shared/utils/validation'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

type LoginMode = 'password' | 'sms'

export const LoginScreen: React.FC = () => {
  const theme = useTheme()
  const navigation = useNavigation()
  
  // 共享状态
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loginMode, setLoginMode] = useState<LoginMode>('password')

  // 密码登录状态
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 短信验证码登录状态
  const [smsCode, setSmsCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [countdown, startCountdown, resetCountdown] = useCountdown(60)
  const canSendSms = countdown === 0

  const loginMutation = useLogin()
  const sendSmsMutation = useSendSmsCode()

  // 页面聚焦时重置倒计时和表单
  useFocusEffect(
    React.useCallback(() => {
      resetCountdown()
      setSmsCode('')
      setPassword('')
      setPhoneError('')
      setPasswordError('')
      setCodeError('')
    }, [resetCountdown])
  )

  // 切换登录模式
  const switchLoginMode = (mode: LoginMode) => {
    setLoginMode(mode)
    setPhoneError('')
    setPasswordError('')
    setCodeError('')
  }

  // 密码登录处理
  const handlePasswordLogin = async () => {
    const phoneValidation = validateField(phoneSchema, phone)
    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error ?? '')
      return
    }

    if (!password) {
      setPasswordError('请输入密码')
      return
    }

    setPhoneError('')
    setPasswordError('')

    try {
      await loginMutation.mutateAsync({
        phone,
        password,
      })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 发送短信验证码
  const handleSendSmsCode = async () => {
    const phoneValidation = validateField(phoneSchema, phone)
    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error ?? '')
      return
    }

    setPhoneError('')

    try {
      await sendSmsMutation.mutateAsync({
        phone,
        purpose: 'login',
      })
      startCountdown()
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  // 短信验证码登录处理
  const handleSmsCodeLogin = async () => {
    const phoneValidation = validateField(phoneSchema, phone)
    if (!phoneValidation.success) {
      setPhoneError(phoneValidation.error ?? '')
      return
    }

    const codeValidation = validateField(smsCodeSchema, smsCode)
    if (!codeValidation.success) {
      setCodeError(codeValidation.error ?? '')
      return
    }

    setPhoneError('')
    setCodeError('')

    try {
      await loginMutation.mutateAsync({
        phone,
        sms_code: smsCode,
      })
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  }

  const styles = getStyles(theme)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo 区域 */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>⏰</Text>
          <Text style={styles.appName}>TimeKeeper</Text>
          <Text style={styles.slogan}>您的智能周期提醒助手</Text>
        </View>

        {/* 登录表单 */}
        <View style={styles.formCard}>
          {/* 密码登录 */}
          {loginMode === 'password' && (
            <>
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

              <Input
                label="密码"
                placeholder="请输入密码"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                containerStyle={styles.input}
              />

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={handlePasswordLogin}
                loading={loginMutation.isPending}
                disabled={!phone || !password}
                style={styles.loginButton}
              >
                登录
              </Button>

              {/* 切换按钮 */}
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => switchLoginMode('sms')}
                style={styles.switchButton}
              >
                切换验证码登录
              </Button>
            </>
          )}

          {/* 短信验证码登录 */}
          {loginMode === 'sms' && (
            <>
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
                  {canSendSms ? '获取验证码' : `${countdown}s`}
                </Button>
              </View>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleSmsCodeLogin}
                loading={loginMutation.isPending}
                disabled={!phone || !smsCode}
                style={styles.loginButton}
              >
                登录
              </Button>

              {/* 切换按钮 */}
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => switchLoginMode('password')}
                style={styles.switchButton}
              >
                切换密码登录
              </Button>
            </>
          )}
        </View>

        {/* 注册提示 */}
        <View style={styles.footerSection}>
          <Text style={styles.registerHint}>
            还没有账号？{' '}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register' as never)}
            >
              立即注册
            </Text>
          </Text>
          <View style={styles.agreementContainer}>
            <Text style={styles.agreementHint}>注册或登录表示您同意</Text>
            <View style={styles.agreementLinksRow}>
              <Text style={styles.agreementLink}>服务条款</Text>
              <Text style={styles.agreementDivider}>和</Text>
              <Text style={styles.agreementLink}>隐私政策</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 24,
      justifyContent: 'flex-start',
    },

    // Logo 区域
    logoSection: {
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 40,
    },

    logo: {
      fontSize: 56,
      marginBottom: 16,
    },

    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },

    slogan: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: '400',
      letterSpacing: 0.3,
    },

    // 表单卡片
    formCard: {
      marginBottom: 32,
    },

    input: {
      marginBottom: 16,
    },

    smsCodeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 24,
      gap: 8,
    },

    smsCodeInput: {
      flex: 1,
      marginBottom: 0,
    },

    smsButton: {
      marginTop: 24,
      minWidth: 100,
      paddingHorizontal: 12,
    },

    loginButton: {
      marginBottom: 12,
      height: 56,
      borderRadius: 10,
      justifyContent: 'center',
      paddingVertical: 8,
    },

    switchButton: {
      height: 44,
      borderRadius: 10,
      marginBottom: 0,
    },

    // 页脚样式
    footerSection: {
      alignItems: 'center',
      marginTop: 24,
      paddingTop: 20,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    registerHint: {
      textAlign: 'center',
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      fontWeight: '500',
      lineHeight: 20,
    },

    registerLink: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 14,
    },

    agreementContainer: {
      width: '100%',
    },

    agreementHint: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '400',
      marginBottom: 6,
    },

    agreementLinksRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },

    agreementLink: {
      color: theme.colors.primary,
      fontWeight: '500',
      fontSize: 12,
      textDecorationLine: 'underline',
    },

    agreementDivider: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '400',
    },
  })
