# React Native 前端开发规范

# TimeKeeper - React Native 前端开发规范 (鸭子模型版)

> **🎯 核心理念: "薄前端，厚后端" - 前后端职责清晰分离**
> 

## 📋 架构全景图

### 🏗️ 职责边界清晰划分

```tsx
// ✅ 前端职责 (React Native - 展示层)
interface FrontendResponsibilities {
  UI渲染和交互: "仅处理用户界面逻辑"
  本地状态管理: "UI状态、缓存、用户偏好"
  API调用封装: "请求发送、响应处理、错误展示"
  数据展示格式化: "日期格式、数字格式、文本处理"
  推送通知处理: "接收通知、展示提醒、用户交互"
  前端表单验证: "输入格式、必填校验、用户体验"
}

// ✅ 后端职责 (FastAPI - 业务层)  
interface BackendResponsibilities {
  数据库操作: "所有CRUD、事务、数据一致性"
  业务逻辑处理: "周期计算、提醒调度、复杂算法"
  权限认证: "用户登录、token管理、权限控制"
  推送任务调度: "定时任务、批量推送、任务队列"
  数据验证: "业务规则校验、数据完整性检查"
  第三方集成: "支付、短信、邮件等外部服务"
}
```

<aside>
💡

**鸭子模型核心思想**

- 如果它走路像鸭子，叫声像鸭子，那它就是鸭子
- 前端看起来像展示层，行为像展示层，那它就只做展示
- 后端看起来像业务层，行为像业务层，那它就只做业务
- **边界清晰，职责单一，避免越界**
</aside>

---

## 🚀 技术栈架构 (2025最新)

### 核心技术选型

```json
{
  "基础框架": "React Native 0.75+ (最新稳定版)",
  "开发语言": "TypeScript 5.3+ (最严格类型检查)",
  "包管理器": "pnpm 8.10+ (性能最优，磁盘空间小)",
  "状态管理": "Zustand 4.4+ (轻量) + TanStack Query 5.8+ (服务端)",
  "UI框架": "Tamagui 1.98+ (性能最佳) / NativeBase 3.4+",
  "导航路由": "React Navigation 6.1+ (生态最完善)",
  "网络请求": "@tanstack/react-query 5.8+ (缓存王者)",
  "本地存储": "react-native-mmkv 2.12+ (性能提升30倍)",
  "动画引擎": "React Native Reanimated 3.8+ (60fps保证)",
  "表单处理": "react-hook-form 7.49+ + zod 3.22+ (类型安全)",
  "测试框架": "Jest 29.7+ + @testing-library/react-native 12.4+",
  "E2E测试": "Maestro 1.36+ (替代Detox，更稳定)",
  "开发调试": "Flipper 0.212+ / Reactotron 3.6+"
}
```

### 🏛️ DDD分层架构

```tsx
// ✅ 领域驱动设计 - 清晰分层
src/
├── app/                    # 应用层 - 全局配置
│   ├── providers/         # 全局状态提供者
│   ├── navigation/        # 路由配置
│   └── App.tsx           # 应用入口
├── features/              # 特性层 - 按业务模块划分
│   ├── auth/             # 认证模块
│   ├── reminders/        # 提醒模块  
│   ├── profile/          # 用户模块
│   └── notifications/    # 通知模块
├── shared/               # 共享层 - 通用组件和工具
│   ├── components/       # UI组件库
│   ├── hooks/           # 通用Hooks
│   ├── utils/           # 工具函数
│   └── types/           # 通用类型
├── entities/            # 实体层 - 业务实体定义
├── infrastructure/      # 基础设施层 - 外部依赖
│   ├── api/            # API客户端
│   ├── storage/        # 存储适配器
│   └── services/       # 外部服务
└── __tests__/          # 测试文件
```

---

## 📐 核心编码规范

### TypeScript 严格模式

```tsx
// ✅ tsconfig.json - 最严格配置
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true
  }
}

// ✅ 高质量类型定义
interface User {
  readonly id: string
  email: string
  name: string
  avatar?: string
  readonly createdAt: Date
}

type ReminderStatus = 'pending' | 'completed' | 'cancelled'

// 泛型约束 + 条件类型
type ApiResponse<T extends Record<string, unknown>> = {
  data: T
  status: 'success' | 'error'
  message?: string
}
```

### 函数式编程范式

```tsx
// ✅ 纯函数优先
const formatCurrency = (amount: number, currency = 'USD') => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

// 高阶函数 - 重试模式
const withRetry = <T>(fn: (...args: any[]) => Promise<T>, maxRetries = 3) => 
  async (...args: any[]): Promise<T> => {
    // 实现重试逻辑...
  }

// 函数组合模式
const pipe = <T>(...fns: Array<(arg: T) => T>) => 
  (value: T) => fns.reduce((acc, fn) => fn(acc), value)
```

---

## 🧩 组件开发模式

### 组件分层设计

```tsx
// ✅ 1. 展示组件 (Pure UI)
const ReminderCard = memo<Props>(({ reminder, onPress }) => {
  // 纯UI渲染，无业务逻辑
  return <Card>/* UI结构 */</Card>
})

// ✅ 2. 容器组件 (Data + Logic)
const ReminderListContainer = () => {
  const { data, isLoading } = useReminders() // 数据获取
  const navigation = useNavigation()         // 导航逻辑
  
  // 事件处理逻辑
  const handlePress = useCallback((id: string) => {
    navigation.navigate('ReminderDetail', { reminderId: id })
  }, [navigation])
  
  return <ReminderList data={data} onPress={handlePress} />
}

// ✅ 3. 页面组件 (Layout + Container)
const RemindersScreen = () => (
  <SafeAreaView>
    <Header title="我的提醒" />
    <ReminderListContainer />
    <FAB onPress={navigateToCreate} />
  </SafeAreaView>
)
```

### 高阶组件模式

```tsx
// ✅ 权限控制HOC
const withPermission = <P extends object>(
  Component: ComponentType<P>,
  permission: Permission
) => (props: P) => {
  const { hasPermission } = usePermissions()
  return hasPermission(permission) ? <Component {...props} /> : <UnauthorizedView />
}

// ✅ 错误边界HOC  
const withErrorBoundary = <P extends object>(Component: ComponentType<P>) => 
  (props: P) => (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Component {...props} />
    </ErrorBoundary>
  )
```

---

## 🗂️ 现代状态管理

### Zustand + TanStack Query 组合

```tsx
// ✅ 客户端状态 - Zustand (UI状态、用户偏好)
interface AppStore {
  theme: 'light' | 'dark' | 'system'
  language: string
  isOnboarded: boolean
  // Actions
  setTheme: (theme: ThemeMode) => void
  setLanguage: (lang: string) => void
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'zh',
      isOnboarded: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language })
    }),
    { name: 'app-store' }
  )
)

// ✅ 服务端状态 - TanStack Query (API数据)
const useReminders = (filters?: ReminderFilters) => 
  useQuery({
    queryKey: ['reminders', filters],
    queryFn: () => reminderService.getReminders(filters),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: (count, error) => error.status >= 500 && count < 3
  })

const useCreateReminder = () => 
  useMutation({
    mutationFn: reminderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders'])
      showToast('创建成功')
    }
  })
```

### 智能缓存策略

```tsx
// ✅ 分层缓存配置
const CACHE_STRATEGIES = {
  realtime: { staleTime: 0, gcTime: 1000 },           // 实时数据
  frequent: { staleTime: 30000, gcTime: 300000 },     // 频繁变化
  stable: { staleTime: 300000, gcTime: 1800000 },     // 相对稳定
  static: { staleTime: 3600000, gcTime: 86400000 }    // 静态数据
}

// 智能缓存Hook
const useSmartQuery = (key, queryFn, strategy = 'stable') =>
  useQuery({ queryKey: key, queryFn, ...CACHE_STRATEGIES[strategy] })
```

---

## 🌐 API集成架构

### 现代化API客户端

```tsx
// ✅ 类型安全的API客户端
class ApiClient {
  private baseURL: string
  private timeout = 10000
  
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${config.url}`, {
      method: config.method || 'GET',
      headers: await this.getHeaders(),
      body: [config.data](http://config.data) ? JSON.stringify([config.data](http://config.data)) : undefined,
      signal: AbortSignal.timeout(this.timeout)
    })
    
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status)
    }
    
    return response.json()
  }
  
  private async getHeaders() {
    const token = await secureStorage.getItem('auth_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }
}

// ✅ 服务层封装
class ReminderService {
  constructor(private apiClient: ApiClient) {}
  
  getReminders = (params?: GetParams) => 
    this.apiClient.request<Reminder[]>({ url: '/reminders', params })
    
  createReminder = (data: CreateReminderRequest) =>
    this.apiClient.request<Reminder>({ url: '/reminders', method: 'POST', data })
}
```

### 离线优先策略

```tsx
// ✅ 离线优先Hook
const useOfflineFirst = <T>(key: QueryKey, queryFn: QueryFunction<T>) => {
  const { isConnected } = useNetInfo()
  
  return useQuery({
    queryKey: key,
    queryFn: async (...args) => {
      // 离线时优先返回缓存
      if (!isConnected) {
        const cached = queryClient.getQueryData(key)
        if (cached) return cached
      }
      
      return queryFn(...args)
    },
    staleTime: isConnected ? 300000 : Infinity,
    retry: isConnected
  })
}
```

---

## 🧭 导航架构设计

### 类型安全的路由系统

```tsx
// ✅ 导航参数类型定义
type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainTabParamList>
  // 模态屏幕
  CreateReminder: { categoryId?: string }
  ReminderDetail: { reminderId: string }
}

// ✅ 类型安全的导航Hook
const useAppNavigation = () => useNavigation<NavigationProp<RootStackParamList>>()

// ✅ 导航服务
export const NavigationService = {
  navigate: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => navigationRef.current?.navigate(screen, params),
  
  goBack: () => navigationRef.current?.goBack()
}
```

### 深度链接配置

```tsx
// ✅ 链接配置 
const linkingConfig = {
  prefixes: ['timekeeper://'],
  config: {
    screens: {
      Main: {
        screens: {
          RemindersStack: {
            screens: {
              ReminderDetail: 'reminder/:reminderId'
            }
          }
        }
      }
    }
  }
}
```

---

## 🎨 主题系统设计

### Design Tokens架构

```tsx
// ✅ 设计令牌系统
interface ThemeTokens {
  colors: {
    primary: ColorScale    // 品牌主色
    gray: ColorScale       // 中性色阶
    semantic: {            // 语义色彩
      success: string
      warning: string
      error: string
    }
  }
  spacing: Record<string, number>  // 间距系统
  typography: TypographyScale      // 字体系统
  radii: Record<string, number>    // 圆角系统
}

// ✅ 响应式工具
const responsive = (styles: ResponsiveStyles) => {
  const { width } = useWindowDimensions()
  // 根据屏幕宽度返回对应样式
  return getResponsiveStyle(styles, width)
}
```

---

## ⚡ 性能优化策略

### 渲染优化模式

```tsx
// ✅ 组件记忆化
const ReminderCard = memo<Props>(({ reminder, onPress }) => {
  // 组件实现...
}, (prev, next) => [prev.reminder.id](http://prev.reminder.id) === [next.reminder.id](http://next.reminder.id))

// ✅ 列表虚拟化
const OptimizedList = ({ data }) => (
  <FlatList
    data={data}
    renderItem={MemoizedRenderItem}
    keyExtractor={keyExtractor}
    getItemLayout={getItemLayout}
    removeClippedSubviews
    maxToRenderPerBatch={10}
    windowSize={10}
  />
)

// ✅ 图片优化
const OptimizedImage = ({ source, style }) => {
  const { width } = useWindowDimensions()
  const optimizedUri = useMemo(() => 
    `${source.uri}?w=${width}&q=80`, [source.uri, width])
  
  return <FastImage source= uri: optimizedUri  style={style} />
}
```

### Bundle优化

```tsx
// ✅ 代码分割
const LazyScreen = lazy(() => import('../screens/HeavyScreen'))

// ✅ Tree-shaking友好导入
import { format, parseISO } from 'date-fns' // ✅ 按需导入
// import * as DateFns from 'date-fns'     // ❌ 全量导入
```

---

## 🧪 测试架构

### 测试金字塔

```tsx
// ✅ 单元测试 - 工具函数
describe('dateUtils', () => {
  it('should format date correctly', () => {
    expect(formatDate(testDate)).toBe('2025-11-15')
  })
})

// ✅ 组件测试
describe('ReminderCard', () => {
  it('should render reminder title', () => {
    render(<ReminderCard reminder={mockReminder} />)
    expect(screen.getByText('Test Reminder')).toBeVisible()
  })
})

// ✅ 集成测试 - API + Store
describe('Reminder Flow', () => {
  it('should create reminder successfully', async () => {
    // 测试完整的数据流...
  })
})

// ✅ E2E测试 - Maestro配置
appId: [com.timekeeper.app](http://com.timekeeper.app)
---
- tapOn: "创建提醒"
- inputText: "测试提醒"
- tapOn: "保存"
- assertVisible: "测试提醒"
```

---

## 🔒 安全架构

### 数据保护策略

```tsx
// ✅ 敏感数据加密存储
class SecureStorage {
  static async setSecureItem(key: string, value: string) {
    await Keychain.setInternetCredentials(key, key, value)
  }
  
  static async getSecureItem(key: string) {
    const credentials = await Keychain.getInternetCredentials(key)
    return credentials ? credentials.password : null
  }
}

// ✅ 生物识别认证
const useBiometricAuth = () => ({
  authenticate: async () => {
    const { success } = await BiometricAuth.simplePrompt({
      promptMessage: '请验证您的身份'
    })
    return success
  }
})
```

---

## 🚀 构建部署配置

### 环境配置管理

```tsx
// ✅ 多环境配置
const ENV_CONFIG = {
  development: {
    API_BASE_URL: '[http://localhost:8000](http://localhost:8000)',
    LOG_LEVEL: 'debug'
  },
  staging: {
    API_BASE_URL: '[https://staging-api.timekeeper.com](https://staging-api.timekeeper.com)',
    LOG_LEVEL: 'info'
  },
  production: {
    API_BASE_URL: '[https://api.timekeeper.com](https://api.timekeeper.com)', 
    LOG_LEVEL: 'error'
  }
}
```

### 构建脚本优化

```json
{
  "scripts": {
    "dev": "react-native start --reset-cache",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "xcodebuild -workspace ios/TimeKeeper.xcworkspace -scheme TimeKeeper -configuration Release",
    "test": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🎯 架构决策记录 (ADR)

### 关键技术选型理由

<aside>
🏗️

**为什么选择 Zustand over Redux?**

- ✅ 零样板代码，开发效率提升300%
- ✅ Bundle大小仅2KB vs Redux的46KB
- ✅ TypeScript支持更好，类型推导完整
- ⚠️ 生态相对较小，但核心功能足够

**为什么选择 TanStack Query over RTK Query?**

- ✅ 更强的缓存策略和背景同步能力
- ✅ 更好的离线支持和错误重试
- ✅ 独立于状态管理库，架构更灵活
- ⚠️ 学习曲线略陡，但投资回报率高

**为什么选择 MMKV over AsyncStorage?**

- ✅ 性能提升30倍，同步API避免竞态
- ✅ 支持加密存储，数据更安全
- ✅ 跨平台一致性更好
- ⚠️ 二进制依赖增加包体积，但性能收益巨大
</aside>

### 架构核心原则

1. **单一职责原则**: 每个模块只负责一个功能领域
2. **依赖倒置原则**: 高层模块不依赖低层模块，都依赖抽象
3. **开闭原则**: 对扩展开放，对修改封闭
4. **接口隔离原则**: 客户端不应依赖它不需要的接口
5. **里氏替换原则**: 子类型必须能够替换它们的基类型

---

## 📝 开发最佳实践总结

### ✅ 核心要点

- **前后端分离**: 严格遵循鸭子模型，前端只做展示，后端负责业务
- **类型安全**: 使用最严格的TypeScript配置，确保类型完整性
- **性能优先**: 选择性能最优的技术栈和实践方案
- **测试保障**: 完整的测试覆盖，从单元到E2E全链路
- **架构清晰**: DDD分层架构，模块边界明确，依赖关系清晰

### ⚠️ 架构风险控制

- **技术债务**: 定期重构，及时清理过时代码
- **性能监控**: 建立性能指标监控，及时发现瓶颈
- **安全防护**: 多层安全防护，保护用户数据安全
- **兼容性**: 确保跨平台兼容性，统一用户体验

这份规范是基于我多年架构经验的精华总结，每个设计决策都经过深思熟虑，确保项目的长期成功！🚀