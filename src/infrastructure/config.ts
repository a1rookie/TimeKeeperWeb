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

const ENV_CONFIG = {
  development: {
    apiBaseUrl: 'http://localhost:8000',
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
