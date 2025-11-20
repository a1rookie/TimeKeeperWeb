# TimeKeeper Android 构建指南 (使用 Docker)

## 前提条件
- 已安装 Docker Desktop for Windows
- 已安装 Node.js 和 pnpm

## 🚀 快速开始

### 1. 启动 Metro Bundler
在 PowerShell 中运行：
```powershell
pnpm start
```
保持此终端窗口打开。

### 2. 构建并运行 Android 应用

**打开新的 PowerShell 窗口**，有两种方式：

#### 方式 A: 使用提供的脚本（推荐）

```powershell
# 清理构建
.\docker-gradlew.ps1 clean

# 构建 Debug 版本（默认）
.\docker-gradlew.ps1

# 或指定任务
.\docker-gradlew.ps1 assembleDebug
.\docker-gradlew.ps1 assembleRelease
```

#### 方式 B: 直接使用 Docker 命令

```powershell
# 清理构建
docker run -it --rm -v ${PWD}:/app -w /app eclipse-temurin:17-jdk bash -c "cd android && chmod +x gradlew && ./gradlew clean"

# 构建 Debug 版本
docker run -it --rm -v ${PWD}:/app -w /app eclipse-temurin:17-jdk bash -c "cd android && chmod +x gradlew && ./gradlew assembleDebug"
```

#### 方式 C: 进入 Docker 容器交互式操作

```powershell
# 进入容器
docker run -it --rm -v ${PWD}:/app -w /app eclipse-temurin:17-jdk bash

# 在容器内执行（注意：在 bash 提示符下）
cd android
chmod +x gradlew
./gradlew clean
./gradlew assembleDebug
exit
```

### 3. 安装到设备/模拟器

构建完成后，在 PowerShell 中运行：
```powershell
pnpm android
```

或者手动安装 APK：
```powershell
# APK 位置
# Debug: android\app\build\outputs\apk\debug\app-debug.apk
# Release: android\app\build\outputs\apk\release\app-release.apk

# 使用 adb 安装
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

## 📝 常用命令

### Gradle 任务
```powershell
.\docker-gradlew.ps1 clean              # 清理构建
.\docker-gradlew.ps1 assembleDebug      # 构建 Debug APK
.\docker-gradlew.ps1 assembleRelease    # 构建 Release APK
.\docker-gradlew.ps1 installDebug       # 构建并安装 Debug 版本
.\docker-gradlew.ps1 installRelease     # 构建并安装 Release 版本
.\docker-gradlew.ps1 tasks              # 查看所有可用任务
```

### Metro 命令
```powershell
pnpm start                              # 启动 Metro
pnpm start -- --reset-cache             # 启动并重置缓存
```

### React Native 命令
```powershell
pnpm android                            # 运行 Android 应用
pnpm ios                                # 运行 iOS 应用（仅 Mac）
```

## 🐛 常见问题

### 1. Docker 挂载路径问题
如果看到 "cannot execute: required file not found"：
- 确保当前目录在项目根目录
- 检查 Docker Desktop 是否正在运行
- 确认文件共享设置（Docker Desktop -> Settings -> Resources -> File Sharing）

### 2. gradlew 权限问题
如果看到 "Permission denied"：
```powershell
docker run -it --rm -v ${PWD}:/app -w /app eclipse-temurin:17-jdk bash -c "cd android && chmod +x gradlew && ./gradlew --version"
```

### 3. 端口占用
如果 Metro 报告端口被占用：
```powershell
# 查找占用 8081 端口的进程
netstat -ano | findstr :8081

# 结束进程（替换 <PID> 为实际进程ID）
taskkill /PID <PID> /F
```

### 4. 内存不足
如果构建时内存不足，编辑 `android/gradle.properties`：
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

## 🔧 故障排除

### 检查 Docker 环境
```powershell
# 验证 Docker 是否运行
docker --version
docker ps

# 测试 Java 环境
docker run -it --rm eclipse-temurin:17-jdk java -version
```

### 检查 Android SDK
```powershell
# 如果安装了本地 Android SDK
$env:ANDROID_HOME
adb version
```

### 查看构建日志
```powershell
# 使用 --stacktrace 查看详细错误
.\docker-gradlew.ps1 assembleDebug --stacktrace

# 或使用 --info 查看更多信息
.\docker-gradlew.ps1 assembleDebug --info
```

## 📱 设备连接

### 使用 Android 模拟器
1. 启动 Android Studio 的 AVD Manager
2. 启动一个模拟器
3. 运行 `pnpm android`

### 使用真实设备
1. 启用开发者选项和 USB 调试
2. 连接设备到电脑
3. 运行 `adb devices` 确认设备已连接
4. 运行 `pnpm android`

## 🎯 完整工作流程示例

```powershell
# 终端 1: 启动 Metro
pnpm start

# 终端 2: 构建和运行
.\docker-gradlew.ps1 clean
.\docker-gradlew.ps1 assembleDebug
pnpm android

# 或者一条命令搞定（在 Docker 容器内）
docker run -it --rm -v ${PWD}:/app -w /app eclipse-temurin:17-jdk bash -c "cd android && chmod +x gradlew && ./gradlew clean assembleDebug"
```

## 🔗 相关文档
- [React Native 文档](https://reactnative.dev/docs/environment-setup)
- [Docker 文档](https://docs.docker.com/)
- [Gradle 文档](https://docs.gradle.org/)
