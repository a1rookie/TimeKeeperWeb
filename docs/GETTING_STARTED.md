# 🚀 TimeKeeper 前端项目 - 快速开始指南

## 📦 安装依赖

### 方式一：使用 pnpm（推荐）

```bash
# 如果还没有安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install

# iOS 需要额外安装 CocoaPods 依赖
cd ios
pod install
cd ..
```

### 方式二：使用 npm

```bash
npm install

# iOS 需要额外安装 CocoaPods 依赖
cd ios
pod install
cd ..
```

---

## ⚙️ 环境配置

### 1. 配置后端 API 地址

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# 修改 API_BASE_URL 为你的后端地址
```

`.env` 文件内容示例：

```bash
# 开发环境配置
API_BASE_URL=http://localhost:8000
API_TIMEOUT=10000
NODE_ENV=development
ENABLE_DEV_TOOLS=true
ENABLE_MOCK_DATA=false
```

### 2. 确保后端服务运行

TimeKeeper 前端需要连接到后端 API，请先启动后端服务：

```bash
# 进入后端项目目录
cd ../TimeKeeper

# 激活虚拟环境（Windows）
.venv\Scripts\activate

# 启动后端服务
python main.py
```

后端服务默认运行在 `http://localhost:8000`

---

## 🏃 运行项目

### iOS 开发

```bash
# 启动 Metro bundler
pnpm start

# 在另一个终端运行 iOS 模拟器
pnpm ios

# 或指定特定设备
pnpm ios --simulator="iPhone 15 Pro"
```

### Android 开发

```bash
# 启动 Metro bundler
pnpm start

# 在另一个终端运行 Android 模拟器
pnpm android

# 或指定特定设备
pnpm android --deviceId=<device-id>
```

---

## 🧪 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式（开发时使用）
pnpm test:watch

# 生成覆盖率报告
pnpm test --coverage
```

---

## 🔍 代码质量检查

```bash
# TypeScript 类型检查
pnpm type-check

# ESLint 代码检查
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix

# Prettier 代码格式化
pnpm format
```

---

## 📱 构建生产版本

### Android 构建

```bash
# Debug 版本
cd android
./gradlew assembleDebug

# Release 版本（需要配置签名）
./gradlew assembleRelease
```

生成的 APK 位于：`android/app/build/outputs/apk/`

### iOS 构建

```bash
# 使用 Xcode 打开项目
open ios/TimeKeeper.xcworkspace

# 或使用命令行构建
cd ios
xcodebuild -workspace TimeKeeper.xcworkspace \
           -scheme TimeKeeper \
           -configuration Release \
           -archivePath TimeKeeper.xcarchive \
           archive
```

---

## 🐛 常见问题

### 问题 1: Metro bundler 无法启动

```bash
# 清除缓存重新启动
pnpm start --reset-cache
```

### 问题 2: iOS Pod install 失败

```bash
# 更新 CocoaPods
gem install cocoapods

# 清理并重新安装
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### 问题 3: Android 构建失败

```bash
# 清理 Gradle 缓存
cd android
./gradlew clean

# 重新构建
./gradlew assembleDebug
```

### 问题 4: TypeScript 类型错误

目前项目中有一些类型错误是正常的，因为第三方库依赖尚未安装。

当你运行 `pnpm install` 后，这些错误会消失。

### 问题 5: 连接后端 API 失败

确保：
1. 后端服务正在运行 (`http://localhost:8000`)
2. `.env` 文件中的 `API_BASE_URL` 配置正确
3. iOS 模拟器使用 `localhost`，Android 模拟器使用 `10.0.2.2`（需要修改配置）

对于 Android 模拟器，修改 `.env`：

```bash
# Android 模拟器配置
API_BASE_URL=http://10.0.2.2:8000
```

---

## 📚 项目结构快速导航

```
TimeKeeperWeb/
├── src/
│   ├── app/                    # 应用层
│   │   ├── providers/         # 全局状态管理
│   │   └── App.tsx           # 应用入口
│   ├── features/              # 特性模块
│   │   ├── auth/             # 认证模块
│   │   └── reminders/        # 提醒模块
│   ├── shared/               # 共享组件和工具
│   ├── entities/             # 业务实体类型
│   └── infrastructure/       # 基础设施（API/存储）
├── __tests__/                # 测试文件
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 项目文档
```

---

## 🔄 开发工作流

### 1. 创建新功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发功能

- 编写代码
- 添加必要的测试
- 确保代码通过 lint 检查

### 3. 提交代码

```bash
# 检查代码质量
pnpm type-check
pnpm lint
pnpm test

# 提交
git add .
git commit -m "feat: 添加你的功能描述"
```

### 4. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

---

## 🎯 下一步

项目框架已经搭建完成，接下来可以：

1. **安装依赖**：`pnpm install`
2. **配置环境**：修改 `.env` 文件
3. **启动后端**：确保 API 服务可用
4. **运行应用**：`pnpm ios` 或 `pnpm android`
5. **开始开发**：从认证模块或提醒列表页面开始

---

## 📖 相关文档

- [项目总结](./PROJECT_SUMMARY.md) - 详细的架构设计和实现说明
- [开发规范](./.github/React%20Native%20前端开发规范.md) - 完整的开发规范
- [后端文档](../TimeKeeper/README.md) - FastAPI 后端服务文档

---

## 💬 获取帮助

如果遇到问题，可以：

1. 查看 [常见问题](#常见问题) 部分
2. 阅读 [项目文档](./README.md)
3. 提交 Issue 到 GitHub

---

**祝开发顺利！** 🎉
