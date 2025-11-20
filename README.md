# TimeKeeper Mobile - React Native 前端

> 🎯 基于 "薄前端，厚后端" 架构设计的智能周期提醒应用

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## 📱 项目简介

TimeKeeper Mobile 是一款帮助用户管理生活中重要周期性事件的智能提醒应用。采用最新的 React Native 技术栈和 DDD 分层架构，确保代码质量和可维护性。

### ✅ 开发状态

**核心功能已完成开发** (2025年11月16日)
- ✅ 21个完整页面
- ✅ 8个可复用组件
- ✅ 4个服务层
- ✅ 100+ 类型定义
- ✅ 0 TypeScript 错误
- 详见 [开发完成报告](./DEVELOPMENT_COMPLETED.md)

### ✨ 核心特性

- 🔄 **智能周期管理**: 支持日/周/月/年等多种复杂周期类型
- 🎯 **场景模板**: 6 大预设场景（居住/健康/宠物/财务/证件/纪念）
- 🔔 **多渠道提醒**: APP 推送、短信、微信、语音电话
- 👨‍👩‍👧 **家庭共享**: 多成员提醒共享，老年关怀特色功能
- 🎤 **语音输入**: AI 智能解析，快速创建提醒
- 📊 **数据统计**: 完成率分析、趋势洞察

---

## 🏗️ 技术架构

### 核心技术栈 (2025 最新)

```json
{
  "基础框架": "React Native 0.78.3",
  "开发语言": "TypeScript 5.6+",
  "包管理器": "npm (推荐) / pnpm 8.15+",
  "React版本": "React 19.2.0",
  "状态管理": "Zustand 5.0 (客户端) + TanStack Query 5.59 (服务端)",
  "UI框架": "Tamagui 1.112 (性能最佳)",
  "导航路由": "React Navigation 6.1+",
  "网络请求": "Native Fetch API",
  "本地存储": "react-native-mmkv 3.1 (性能提升30倍)",
  "动画引擎": "React Native Reanimated 3.19.4",
  "表单处理": "React Hook Form 7.49 + Zod 3.23",
  "测试框架": "Jest 29.7 + Testing Library 12.7"
}
```

### DDD 分层架构

```
src/
├── app/                    # 应用层 - 全局配置
│   ├── providers/         # 状态管理 (Zustand/React Query)
│   ├── navigation/        # 路由配置
│   └── App.tsx           # 应用入口
├── features/              # 特性层 - 按业务模块划分
│   ├── auth/             # 认证模块 (登录/注册)
│   ├── reminders/        # 提醒模块 (CRUD/完成)
│   ├── profile/          # 用户模块 (设置/信息)
│   └── notifications/    # 通知模块
├── shared/               # 共享层 - 通用组件和工具
│   ├── components/       # UI 组件库
│   ├── hooks/           # 通用 Hooks
│   ├── utils/           # 工具函数
│   └── types/           # 通用类型
├── entities/            # 实体层 - 业务实体定义
│   ├── user.ts          # 用户实体
│   ├── reminder.ts      # 提醒实体
│   ├── template.ts      # 模板实体
│   └── family.ts        # 家庭组实体
└── infrastructure/      # 基础设施层 - 外部依赖
    ├── api/            # API 客户端
    ├── storage/        # 存储适配器
    ├── services/       # 业务服务封装
    └── config.ts       # 环境配置
```

---

## 🚀 快速开始

### 前置要求

- **Node.js 18+** 
- **npm** (推荐) 或 pnpm 8.15+
- **React Native 开发环境** ([官方文档](https://reactnative.dev/docs/environment-setup))
  - **iOS**: Xcode 14+, CocoaPods (仅 macOS)
  - **Android**: Android Studio, JDK 17+

> **💡 重要提示**: 
> - Windows 用户请务必先查看 [Windows 环境配置指南](./docs/WINDOWS_SETUP.md)
> - 推荐使用 **npm** 而非 pnpm (避免符号链接问题)

### 安装步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd TimeKeeperWeb
```

#### 2. 安装依赖

```bash
# 推荐使用 npm (避免 Windows 符号链接问题)
npm install

# 或使用 pnpm
pnpm install
```

#### 3. 配置 Android 环境 (Windows 用户必读)

**方式一：自动配置 (推荐)**

在 `android` 目录创建 `local.properties` 文件：

```properties
# android/local.properties
sdk.dir=D:\\Android\\SDK
```

**方式二：环境变量配置**

确保设置以下环境变量：
- `ANDROID_HOME=D:\Android\SDK`
- `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot`

详细配置请查看 [Windows 配置指南](./docs/WINDOWS_SETUP.md)

#### 4. iOS 配置 (仅 macOS)

```bash
cd ios && pod install && cd ..
```

#### 5. 启动应用

**Android 开发 (推荐流程)**

```bash
# 第一步：启动 Metro Bundler (终端 1)
npm start

# 第二步：启动 Android 模拟器
# 打开 Android Studio -> Device Manager -> 启动模拟器

# 第三步：运行应用 (终端 2)
npm run android
```

**首次构建说明:**
- Android 首次构建需要 10-15 分钟（下载依赖和编译 C++）
- 构建完成后会自动安装到模拟器并启动
- 后续热更新只需 2-3 秒

**iOS 开发 (仅 macOS)**

```bash
# 启动 Metro
npm start

# 运行 iOS (另一个终端)
npm run ios
```

### 开发调试技巧

**重新加载应用:**
```bash
# 方式 1: 在模拟器中按 R 键 (Android) 或 Cmd+R (iOS)
# 方式 2: 在 Metro 终端按 r 键
# 方式 3: 摇晃设备，打开开发菜单，点击 Reload
```

**清理缓存:**
```bash
# 清理 Metro 缓存
npm start -- --reset-cache

# 清理 Gradle 缓存 (Android)
cd android && .\gradlew clean && cd ..

# 清理 iOS 缓存
cd ios && xcodebuild clean && cd ..
```

**完全重置:**
```bash
# 删除所有缓存和依赖
rm -rf node_modules android/.gradle ios/Pods
npm install
cd ios && pod install && cd ..
```

### 快速问题排查

- ❌ **Metro 连接失败**: 
  - 检查是否有多个 Metro 进程：`taskkill /F /IM node.exe`
  - 重启 Metro: `npm start -- --reset-cache`
  
- ❌ **Android 构建失败**: 
  - 检查 `JAVA_HOME` 和 `ANDROID_HOME` 环境变量
  - 删除 `android/.gradle` 文件夹后重试
  - 查看 [Windows 配置指南](./docs/WINDOWS_SETUP.md)

- ❌ **应用显示空白**: 
  - 确保 Metro Bundler 正在运行
  - 在模拟器中按 R 键重新加载
  - 检查 Metro 终端是否有错误信息

- ❌ **端口 8081 被占用**: 
  ```bash
  # Windows
  netstat -ano | findstr :8081
  taskkill /PID <进程ID> /F
  
  # macOS/Linux
  lsof -ti:8081 | xargs kill
  ```

- ❌ **符号链接错误 (pnpm)**: 
  - 改用 npm: `npm install`
  - 或创建 `.npmrc`: `node-linker=hoisted`

---

## 📐 开发规范

### TypeScript 严格模式

项目启用了最严格的 TypeScript 配置，确保类型安全：

```typescript
// tsconfig.json 核心配置
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noImplicitOverride": true
}
```

### 代码风格

- ✅ 使用 Prettier 自动格式化 (`pnpm format`)
- ✅ 使用 ESLint 代码检查 (`pnpm lint`)
- ✅ 使用函数式编程范式，避免类组件
- ✅ 使用 TypeScript 类型推导，避免 `any`
- ✅ 组件拆分：展示组件 + 容器组件 + 页面组件

### Git 提交规范

```bash
# 格式: <type>(<scope>): <subject>

feat(auth): 实现手机号登录功能
fix(reminder): 修复周期计算错误
docs(readme): 更新安装说明
style(ui): 统一按钮样式
refactor(api): 重构 API 客户端
test(reminder): 添加提醒列表测试
chore(deps): 升级依赖版本
```

---

## 🧪 测试

### 运行测试

```bash
# 单元测试
pnpm test

# 测试覆盖率
pnpm test --coverage

# 监听模式
pnpm test:watch
```

### 测试目标

- 单元测试覆盖率 > 80%
- 关键业务逻辑 100% 覆盖
- 所有 API 服务层测试完整

---

## 📱 构建发布

### Android 构建

```bash
# Debug 构建 (开发测试)
cd android
gradlew assembleDebug
cd ..

# 输出位置: android/app/build/outputs/apk/debug/app-debug.apk

# Release 构建 (生产发布 - 需要配置签名)
cd android
gradlew assembleRelease
cd ..
```

**Windows 用户:**
```powershell
cd android
.\gradlew.bat assembleDebug
cd ..
```

**首次构建时间**: 10-15 分钟 (下载依赖 + C++ 编译)  
**后续构建**: 2-5 分钟

### iOS 构建 (仅 macOS)

```bash
# 使用 Xcode
cd ios
xcodebuild -workspace TimeKeeperTemp.xcworkspace \
           -scheme TimeKeeperTemp \
           -configuration Release
```

或直接在 Xcode 中打开 `ios/TimeKeeperTemp.xcworkspace` 进行构建

---

## 🗂️ 项目状态

### ✅ 已完成

- [x] 项目框架搭建和配置
- [x] DDD 分层架构设计
- [x] TypeScript 严格模式配置
- [x] API 客户端封装
- [x] MMKV 本地存储适配
- [x] Zustand 状态管理
- [x] TanStack Query 数据管理
- [x] 实体类型定义 (User/Reminder/Template/Family)
- [x] 用户服务和提醒服务封装
- [x] 认证相关 Hooks
- [x] 提醒相关 Hooks

### 🚧 进行中

- [ ] 导航路由配置
- [ ] UI 组件库开发
- [ ] 认证模块页面
- [ ] 提醒核心功能页面
- [ ] 主题系统实现

### 📋 待开发

- [ ] 家庭共享功能
- [ ] 模板分享功能
- [ ] 语音输入集成
- [ ] 推送通知处理
- [ ] 数据统计分析
- [ ] E2E 测试

---

## 📚 相关文档

- [React Native 前端开发规范](./.github/React%20Native%20前端开发规范.md) - 详细的架构设计和编码规范
- [后端 API 文档](../TimeKeeper/README.md) - FastAPI 后端服务文档
- [业务流程设计](../TimeKeeper/周期提醒APP%20-%20完整业务流程设计.md) - 完整的业务流程说明

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 👥 联系方式

- 项目地址: [GitHub](https://github.com/your-repo/timekeeper)
- 问题反馈: [Issues](https://github.com/your-repo/timekeeper/issues)

---

<div align="center">

**打造最简单、最好用的周期提醒工具!** 🎉

Made with ❤️ using React Native

</div>
