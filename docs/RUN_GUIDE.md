# TimeKeeper 运行指南

## 📱 运行项目

### 前置条件

1. **Node.js**: >= 18
2. **pnpm**: >= 8.0
3. **React Native 开发环境**:
   - **iOS**: macOS + Xcode 14+ + CocoaPods
   - **Android**: Android Studio + JDK 17

### 第一次运行

#### 1. 安装依赖

```bash
cd TimeKeeperWeb
pnpm install
```

#### 2. iOS 配置

```bash
cd ios
pod install
cd ..
```

#### 3. 启动 Metro

```bash
pnpm start
```

#### 4. 运行应用

**iOS (需要 macOS)**:
```bash
# 默认模拟器
pnpm ios

# 指定模拟器
pnpm ios --simulator="iPhone 15 Pro"

# 真机 (需要配置开发者证书)
pnpm ios --device
```

**Android**:
```bash
# 默认设备
pnpm android

# 指定设备
pnpm android --deviceId=<device-id>

# 查看连接的设备
adb devices
```

## 🔧 常见问题

### 1. CLI 命令报错

**问题**: `react-native depends on @react-native-community/cli`

**解决**: 已修复,`pnpm install` 即可

### 2. Metro 缓存问题

```bash
pnpm start --reset-cache
```

### 3. iOS CocoaPods 问题

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### 4. Android Gradle 问题

```bash
cd android
./gradlew clean
cd ..
```

### 5. TypeScript 服务器卡死

VS Code: `Cmd/Ctrl + Shift + P` -> `TypeScript: Restart TS Server`

### 6. 端口占用

```bash
# 杀掉占用 8081 端口的进程
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

## 🏗️ 构建发布版本

### iOS

```bash
cd ios
xcodebuild -workspace TimeKeeper.xcworkspace -scheme TimeKeeper -configuration Release
```

或使用 Xcode:
1. 打开 `ios/TimeKeeper.xcworkspace`
2. 选择 `Product` -> `Archive`
3. 上传到 App Store Connect

### Android

```bash
cd android
./gradlew assembleRelease
```

APK 位置: `android/app/build/outputs/apk/release/app-release.apk`

## 📝 开发命令

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 格式化
pnpm format

# 测试
pnpm test

# 测试覆盖率
pnpm test --coverage

# 清理构建
pnpm clean
```

## 🐛 调试

### React Native Debugger

1. 安装 React Native Debugger
2. 在模拟器中按 `Cmd + D` (iOS) 或 `Cmd + M` (Android)
3. 选择 "Debug"

### Flipper

1. 安装 Flipper
2. 运行应用
3. Flipper 自动连接

### Chrome DevTools

1. 运行应用
2. 按 `Cmd + D` (iOS) 或 `Cmd + M` (Android)
3. 选择 "Debug with Chrome"

## 📱 设备测试

### iOS 真机

1. 连接 iPhone
2. 在 Xcode 中选择设备
3. 配置开发者证书
4. 运行 `pnpm ios --device`

### Android 真机

1. 开启开发者模式和 USB 调试
2. 连接设备
3. 运行 `adb devices` 确认连接
4. 运行 `pnpm android`

## 🚀 性能优化

### 启用 Hermes

Hermes 已默认启用 (React Native 0.76+)

### 启用新架构

1. 编辑 `ios/Podfile`:
```ruby
use_frameworks! :linkage => :static
$RNNewArchEnabled = true
```

2. 运行:
```bash
cd ios
RCT_NEW_ARCH_ENABLED=1 pod install
cd ..
```

3. 编辑 `android/gradle.properties`:
```properties
newArchEnabled=true
```

## 📚 相关资源

- [React Native 文档](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [开发完成报告](./DEVELOPMENT_COMPLETED.md)

---

**最后更新**: 2025年11月16日
