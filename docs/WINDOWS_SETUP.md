# Windows 环境 React Native 配置指南

## ⚠️ 重要提示

React Native 在 Windows 上主要支持 **Android 开发**。iOS 开发需要 macOS 系统。

## 🐳 推荐方案：使用 Docker（无需配置 JDK）

如果你不想安装 JDK 和配置环境变量，可以使用 Docker 方案：

```powershell
# 1. 安装 Docker Desktop for Windows
# 下载: https://www.docker.com/products/docker-desktop/

# 2. 确保已安装依赖
pnpm install

# 3. 使用 Docker 构建
.\docker-gradlew.ps1 clean
.\docker-gradlew.ps1 assembleDebug

# 4. 启动 Android Studio 模拟器，然后运行
pnpm android
```

**注意**: Docker 只用于构建，运行应用仍需 Android Studio 和模拟器。

## 📋 环境要求

### 必需软件

1. **Node.js** (>= 18)
   - 下载: https://nodejs.org/
   - 验证: `node --version`

2. **pnpm** (>= 8.0)
   ```powershell
   npm install -g pnpm
   pnpm --version
   ```

3. **JDK 17** (如果不使用 Docker，则必需)
   - **选项 A**: Microsoft Build of OpenJDK
     - 下载: https://learn.microsoft.com/zh-cn/java/openjdk/download
     - 选择 "OpenJDK 17 LTS" -> "Windows x64" -> "MSI installer"
     - 安装位置示例: `C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`
   
   - **选项 B**: Eclipse Temurin (推荐)
     - 下载: https://adoptium.net/zh-CN/temurin/releases/?version=17
     - 选择 "Windows x64 MSI"
     - 安装位置示例: `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot`
   
   - **配置环境变量** (管理员 PowerShell):
     ```powershell
     # 替换为你的实际安装路径
     $JDK_PATH = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
     [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $JDK_PATH, 'Machine')
     
     # 添加到 PATH
     $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
     if ($currentPath -notlike "*$JDK_PATH\bin*") {
         [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$JDK_PATH\bin", 'Machine')
     }
     ```
   
   - **重启 PowerShell** 并验证:
     ```powershell
     java -version
     # 应显示: openjdk version "17.0.x"
     ```

4. **Android Studio** (必需 - 用于模拟器和真机调试)
   - 下载: https://developer.android.com/studio
   - 安装时勾选:
     - ✅ Android SDK
     - ✅ Android SDK Platform
     - ✅ Android Virtual Device
   - 首次启动会自动下载必要组件

### Android SDK 配置

1. 打开 Android Studio
2. 点击 "More Actions" -> "SDK Manager"
3. 安装以下组件:
   - ✅ Android SDK Platform 34
   - ✅ Intel x86 Atom_64 System Image 或 Google APIs Intel x86 Atom System Image
   - ✅ Android SDK Build-Tools 34.0.0

4. 配置环境变量:
```powershell
# PowerShell (管理员权限)
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $ANDROID_HOME, 'Machine')
[System.Environment]::SetEnvironmentVariable('Path', "$env:Path;$ANDROID_HOME\platform-tools;$ANDROID_HOME\tools;$ANDROID_HOME\tools\bin", 'Machine')
```

5. 重启 PowerShell 验证:
```powershell
$env:ANDROID_HOME
adb --version
```

## 🚀 运行项目

### 1. 安装依赖

```powershell
cd TimeKeeperWeb
pnpm install
```

### 2. 启动 Android 模拟器

#### 方式 A: 使用 Android Studio (推荐)

1. **打开 Android Studio**
2. **不需要打开项目**，直接在欢迎界面
3. 点击右上角 **「...」(More Actions)** -> **「Virtual Device Manager」**
4. 如果没有设备，点击 **「Create Device」**:
   - 选择 "Phone" -> "Pixel 5" (推荐)
   - 选择系统镜像 "UpsideDownCake" (API 34) - 如果未下载会提示下载
   - 点击 "Finish"
5. 点击设备右侧的 **▶️ (Play)** 按钮启动模拟器
6. 等待模拟器完全启动（显示主屏幕）

#### 方式 B: 使用命令行

```powershell
# 查看可用模拟器
emulator -list-avds

# 启动指定模拟器
emulator -avd Pixel_5_API_34
```

**验证模拟器已连接**:
```powershell
adb devices
# 应显示: emulator-5554  device
```

### 3. 启动 Metro

```powershell
pnpm start
```

### 4. 运行应用 (新终端)

```powershell
pnpm android
```

## 🐛 常见问题

### 1. JAVA_HOME 未设置 或 adb 未找到

**错误**: 
- `ERROR: JAVA_HOME is not set`
- `'adb' 不是内部或外部命令`

**解决步骤**:

#### 步骤 1: 查找并设置 JAVA_HOME

```powershell
# 查找所有 JDK 安装
Get-ChildItem "C:\Program Files" -Filter "*jdk*" -Directory -Recurse -Depth 2 | Where-Object { Test-Path "$($_.FullName)\bin\java.exe" } | Select-Object FullName

# 或者查找 Eclipse Adoptium
Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Filter "jdk*" -Directory 2>$null | Select-Object FullName

# 设置环境变量 (管理员 PowerShell，替换为实际路径)
$JDK_PATH = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $JDK_PATH, 'Machine')
[System.Environment]::SetEnvironmentVariable('Path', "$env:Path;$JDK_PATH\bin", 'Machine')

# 关闭并重新打开 PowerShell，然后验证
$env:JAVA_HOME
java -version
```

#### 步骤 2: 设置 ANDROID_HOME 和 adb

```powershell
# 设置 ANDROID_HOME (管理员 PowerShell)
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $ANDROID_HOME, 'Machine')

# 添加 adb 到 PATH
$androidPaths = "$ANDROID_HOME\platform-tools;$ANDROID_HOME\tools;$ANDROID_HOME\tools\bin;$ANDROID_HOME\emulator"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
[System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPaths", 'Machine')

# 关闭并重新打开 PowerShell，然后验证
$env:ANDROID_HOME
adb --version
emulator -version
```

#### 步骤 3: 如果还是不行，使用 Docker 方案

```powershell
# 使用 Docker 构建（不需要本地 JDK）
.\docker-gradlew.ps1 assembleDebug

# 然后手动安装到模拟器
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### 2. ANDROID_HOME 未设置

**错误**: `SDK location not found`

**解决**:
```powershell
# 设置环境变量
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $ANDROID_HOME, 'Machine')

# 添加到 PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPath = "$currentPath;$ANDROID_HOME\platform-tools;$ANDROID_HOME\tools"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')

# 重启 PowerShell 验证
$env:ANDROID_HOME
adb --version
```

### 3. Gradle 构建失败

```powershell
cd android
.\gradlew.bat clean
cd ..
```

### 4. 端口占用 (8081)

```powershell
# 查找占用端口的进程
netstat -ano | findstr :8081

# 杀死进程 (替换 <PID>)
taskkill /PID <PID> /F
```

### 5. Metro 缓存问题

```powershell
pnpm start --reset-cache
```

### 6. 模拟器连接问题

```powershell
# 查看连接的设备
adb devices

# 重启 ADB
adb kill-server
adb start-server
```

## 📱 真机调试

### Android 真机

1. 开启开发者选项:
   - 设置 -> 关于手机 -> 连续点击版本号 7 次

2. 开启 USB 调试:
   - 设置 -> 开发者选项 -> USB 调试

3. 连接设备:
```powershell
adb devices
# 应该显示你的设备
```

4. 运行应用:
```powershell
pnpm android
```

## 🏗️ 构建发布版本

### Android APK

```powershell
cd android
.\gradlew.bat assembleRelease
```

APK 位置: `android\app\build\outputs\apk\release\app-release.apk`

### Android App Bundle (AAB)

```powershell
cd android
.\gradlew.bat bundleRelease
```

AAB 位置: `android\app\build\outputs\bundle\release\app-release.aab`

## 📚 参考资源

- [React Native 官方文档](https://reactnative.dev/docs/environment-setup)
- [Android 开发者文档](https://developer.android.com/)
- [JDK 下载](https://learn.microsoft.com/zh-cn/java/openjdk/download)
- [Android Studio 下载](https://developer.android.com/studio)

## 💡 开发建议

### 使用 Android Studio

1. 打开 `android` 文件夹作为项目
2. 等待 Gradle 同步完成
3. 可以使用 Android Studio 的:
   - Logcat 查看日志
   - Layout Inspector 检查布局
   - Profiler 性能分析

### VSCode 插件推荐

- React Native Tools
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### 调试工具

1. **React Native Debugger**
   - 下载: https://github.com/jhen0409/react-native-debugger

2. **Flipper** (Meta 官方)
   - 下载: https://fbflipper.com/

3. **Chrome DevTools**
   - 在应用中按 `Ctrl + M` 打开开发菜单
   - 选择 "Debug"

## ⚠️ iOS 开发

iOS 应用只能在 macOS 上开发。如果需要 iOS 版本:

1. 使用 macOS 电脑或 Hackintosh
2. 安装 Xcode 14+
3. 安装 CocoaPods: `sudo gem install cocoapods`
4. 运行: `cd ios && pod install && cd .. && pnpm ios`

或者使用云服务:
- GitHub Actions (macOS runner)
- CircleCI
- Bitrise

---

**最后更新**: 2025年11月16日
