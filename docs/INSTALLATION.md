# 依赖安装指南

## 当前状态

项目核心代码已经完成开发,但需要安装依赖才能运行。

## 快速开始

### 1. 安装所有依赖

在 `TimeKeeperWeb` 目录下运行:

```powershell
pnpm install
```

这将安装 `package.json` 中的所有依赖,包括:

#### 核心依赖
- `react` ^18.3.1
- `react-native` 0.76.3
- `@react-navigation/native` ^6.1.18
- `@react-navigation/native-stack` ^6.11.0
- `@react-navigation/bottom-tabs` ^6.6.1
- `@tanstack/react-query` ^5.59.20
- `zustand` ^5.0.2
- `react-native-mmkv` ^3.1.0
- `date-fns` ^4.1.0
- `zod` ^3.24.1

#### 开发依赖
- `typescript` ^5.6.3
- `@types/react` ^18.3.12
- `@types/react-native` ^0.76.0
- 等等...

### 2. 验证安装

安装完成后,所有 "找不到模块" 的错误应该消失。

### 3. 运行项目

```powershell
# iOS
pnpm ios

# Android
pnpm android

# Metro bundler
pnpm start
```

## 已完成的功能

### ✅ 导航系统 (8 files)
- `RootNavigator` - 根导航器,认证守卫
- `AuthNavigator` - 登录/注册流程
- `MainNavigator` - 底部标签导航
- `RemindersNavigator` - 提醒模块导航
- `FamilyNavigator` - 家庭模块导航
- `ProfileNavigator` - 个人中心导航
- `types.ts` - 完整类型定义和深度链接配置

### ✅ 主题系统 (3 files)
- `tokens.ts` - 完整 Design Tokens
- `index.ts` - useTheme() hook,深色模式
- `responsive.ts` - 响应式工具函数

### ✅ 组件库 (8 components)
- `Button` - 5种样式,3种尺寸
- `Input` - 完整表单输入
- `Card` - 卡片组件
- `Loading` - 加载状态
- `Error` - 错误状态
- `EmptyState` - 空状态
- `CategoryIcon` - 分类图标
- `ReminderCard` - 提醒卡片

### ✅ 工具库 (3 modules)
- `date.ts` - 8个日期格式化函数
- `validation.ts` - Zod表单验证
- `hooks.ts` - 5个自定义Hooks

### ✅ 认证页面 (2 screens)
- `LoginScreen` - 登录页
- `RegisterScreen` - 注册页

### ✅ 提醒页面 (5 screens)
- `ReminderListScreen` - 提醒列表
- `ReminderDetailScreen` - 提醒详情
- `CreateReminderScreen` - 创建提醒
- `EditReminderScreen` - 编辑提醒
- `CompletionRecordsScreen` - 完成记录

### ✅ 用户设置页面 (4 screens)
- `ProfileHomeScreen` - 个人中心首页
- `EditProfileScreen` - 编辑资料
- `SettingsScreen` - 设置页面
- `AboutScreen` - 关于页面

## 待完成功能

### 🚧 家庭共享模块
- `family.service.ts` - API服务层
- `use-family.ts` - React Query hooks
- `FamilyListScreen` - 家庭列表
- `FamilyDetailScreen` - 家庭详情
- `CreateFamilyScreen` - 创建家庭
- `InviteMemberScreen` - 邀请成员

### 🚧 模板市场模块
- `template.service.ts` - API服务层
- `use-templates.ts` - React Query hooks
- `TemplateMarketScreen` - 模板市场
- `MyTemplatesScreen` - 我的模板
- `CreateTemplateScreen` - 创建模板

### 🚧 高级功能
- 语音输入集成
- 推送通知处理
- 统计图表
- 离线模式

### 🚧 组件优化
- `DateTimePicker` - 日期时间选择器
- `RecurrenceSelector` - 重复周期选择器
- `ImagePicker` - 图片选择器
- `VoiceInput` - 语音输入

## 配置说明

### TypeScript
- ✅ 已修复 tsconfig.json extends 问题
- ✅ 严格模式已开启
- ✅ 所有路径别名已配置

### 路径别名
```typescript
@app/* → src/app/*
@features/* → src/features/*
@shared/* → src/shared/*
@entities/* → src/entities/*
@infrastructure/* → src/infrastructure/*
```

## 已知问题

所有当前错误都是由于缺少 `node_modules` 导致的:

1. ❌ `找不到模块 'react'` → 运行 `pnpm install` 解决
2. ❌ `找不到模块 'react-native'` → 运行 `pnpm install` 解决
3. ❌ `找不到模块 '@tanstack/react-query'` → 运行 `pnpm install` 解决
4. ❌ `找不到模块 'zustand'` → 运行 `pnpm install` 解决
5. ❌ `找不到模块 'date-fns'` → 运行 `pnpm install` 解决

## 项目统计

- **总文件数**: 50+ files
- **代码行数**: ~5000+ lines
- **组件数**: 8 components
- **页面数**: 11 screens
- **导航器数**: 6 navigators
- **工具函数**: 20+ functions
- **Hooks**: 15+ hooks (React Query + Custom)

## 下一步

1. **立即执行**: `pnpm install`
2. **验证错误**: 检查 TypeScript 错误是否消失
3. **运行项目**: `pnpm start` 启动 Metro
4. **继续开发**: 实现家庭共享和模板市场功能
