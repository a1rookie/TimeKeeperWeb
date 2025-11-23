/**
 * TimeKeeper - React Native 应用主入口
 * 提供全局 Provider 和应用初始化逻辑
 */

import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { queryClient } from './providers/query-client'
import { useAuthStore } from './providers/auth.store'

// 简化的登录页面组件
const SimpleLoginScreen = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  
  const handleLogin = () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入11位手机号')
      return
    }
    // 简化：任意验证码都可以登录（后续连接真实API）
    Alert.alert('登录成功', '欢迎使用 TimeKeeper！', [
      { text: '确定', onPress: onLoginSuccess }
    ])
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>⏰</Text>
        <Text style={styles.title}>TimeKeeper</Text>
        <Text style={styles.subtitle}>家庭提醒助手</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>手机号</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入手机号"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={11}
        />

        <View style={styles.codeRow}>
          <View style={styles.codeInputContainer}>
            <Text style={styles.label}>验证码</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入验证码"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
          </View>
          <TouchableOpacity 
            style={styles.codeButton}
            onPress={() => Alert.alert('提示', '验证码已发送！(开发模式)')}
          >
            <Text style={styles.codeButtonText}>获取验证码</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>还没有账号？立即注册</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>登录即表示同意服务协议和隐私政策</Text>
        <Text style={styles.version}>Version 0.1.0 • React Native 0.78.3 • React 19</Text>
      </View>
    </ScrollView>
  )
}

// 主页面组件
const MainScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>🎉 欢迎使用 TimeKeeper！</Text>
      <Text style={styles.mainSubtitle}>智能周期提醒助手</Text>
      
      <View style={styles.featureList}>
        <Text style={styles.featureItem}>✅ 完整的登录界面</Text>
        <Text style={styles.featureItem}>✅ 状态管理 (Zustand)</Text>
        <Text style={styles.featureItem}>✅ 数据管理 (React Query)</Text>
        <Text style={styles.featureItem}>✅ 导航系统 (React Navigation)</Text>
        <Text style={styles.featureItem}>🚧 提醒列表页面 (开发中)</Text>
        <Text style={styles.featureItem}>🚧 家庭管理功能 (开发中)</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  )
}

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLoginSuccess = () => {
    setAuth('mock-token', {
      id: '1',
      phone: '13800138000',
      nickname: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {!isAuthenticated ? (
            <SimpleLoginScreen onLoginSuccess={handleLoginSuccess} />
          ) : (
            <MainScreen onLogout={clearAuth} />
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  codeInputContainer: {
    flex: 1,
  },
  codeButton: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  codeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  loginButton: {
    height: 52,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  registerButtonText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  version: {
    fontSize: 11,
    color: '#bbb',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  featureList: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  logoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#666',
  },
})

export default App

export default App
