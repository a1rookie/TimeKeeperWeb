/**
 * 环境配置管理
 * 统一管理应用的环境变量和配置
 */

interface EnvironmentConfig {
  apiBaseUrl: string
  apiTimeout: number
  environment: 'development' | 'staging' | 'production'
  enableDevTools: boolean
  enableMockData: boolean
  jpushAppKey?: string
}

const getDevApiBaseUrl = (): string => {
  // 在 Android 模拟器中访问宿主机请使用 10.0.2.2
  // 在其他环境（iOS 模拟器 / 真实设备 / 浏览器）保留 localhost
  let base = 'http://localhost:8000'
  try {
    // 使用 require 避免在非 RN 环境导入失败
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Platform } = require('react-native')
    if (Platform && Platform.OS === 'android') {
      base = 'http://10.0.2.2:8000'
    }
  } catch (e) {
    // ignore - fallback to localhost
  }
  return base
}

const ENV_CONFIG = {
  development: {
    apiBaseUrl: getDevApiBaseUrl(),
    apiTimeout: 10000,
    environment: 'development' as const,
    enableDevTools: true,
    enableMockData: false,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.timekeeper.com',
    apiTimeout: 10000,
    environment: 'staging' as const,
    enableDevTools: true,
    enableMockData: false,
  },
  production: {
    apiBaseUrl: 'https://api.timekeeper.com',
    apiTimeout: 15000,
    environment: 'production' as const,
    enableDevTools: false,
    enableMockData: false,
  },
}

const getCurrentEnv = (): keyof typeof ENV_CONFIG => {
  // 在 React Native 中，使用 __DEV__ 全局变量判断环境
  if (__DEV__) {
    return 'development'
  }
  return 'production'
}

export const config: EnvironmentConfig = ENV_CONFIG[getCurrentEnv()]

export default config
