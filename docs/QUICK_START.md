# TimeKeeper 快速启动指南

> 💡 本指南帮助你快速启动 TimeKeeper 移动应用（React Native 0.78.3 + React 19）

## 📋 前置要求检查

在开始之前，确保已安装：

- ✅ **Node.js 18+** - [下载](https://nodejs.org/)
- ✅ **JDK 17** - [Eclipse Adoptium](https://adoptium.net/)
- ✅ **Android Studio** - [下载](https://developer.android.com/studio)
- ✅ **Android SDK** (通过 Android Studio 安装)

**Windows 用户必读**: 请先查看 [Windows 环境配置指南](./WINDOWS_SETUP.md)

---

## 🚀 快速启动 (3 步)

### 步骤 1: 安装依赖（首次运行）

```powershell
# 进入项目目录
cd TimeKeeperWeb

# 安装依赖（推荐使用 npm）
npm install
```

**首次安装时间**: 约 3-5 分钟

### 步骤 2: 配置 Android SDK 路径

创建文件 `android/local.properties`:

```properties
# android/local.properties
sdk.dir=D:\\Android\\SDK
```

或设置环境变量：
```powershell
$env:ANDROID_HOME="D:\Android\SDK"
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
```

### 步骤 3: 启动应用

**终端 1 - 启动 Metro Bundler:**
```powershell
npm start
```

**终端 2 - 启动 Android 模拟器并运行应用:**
```powershell
# 打开 Android Studio -> Device Manager -> 启动模拟器

# 运行应用（首次会自动编译和安装）
npm run android
```

✅ **完成！** 应用将在 10-15 分钟后首次启动（后续只需 2-3 秒）

---

## 🎯 日常开发流程

### 每次开发时

1. **启动 Metro** (如果还没启动):
```powershell
npm start
```

2. **在模拟器中重新加载**:
   - 按 `R` 键 (Android)
   - 或在 Metro 终端按 `r`
   - 或摇晃设备打开开发菜单，点击 Reload

### 清理缓存（遇到问题时）

```powershell
# 清理 Metro 缓存
npm run start:clean

# 清理 Android 构建缓存
cd android
.\gradlew.bat clean
cd ..

# 完全重置
rm -rf node_modules android\.gradle
npm install
```

---

## 🔧 常用命令

```powershell
# === 开发 ===
npm start                      # 启动 Metro Bundler
npm run android                # 运行 Android 应用
npm run ios                    # 运行 iOS 应用 (仅 macOS)
npm run start:clean            # 启动 Metro (清理缓存)

# === 构建 ===
npm run build:android          # 构建 Debug APK
npm run build:android:release  # 构建 Release APK
npm run build:ios              # 构建 iOS (仅 macOS)

# === 测试和代码质量 ===
npm test                       # 运行测试
npm run test:watch             # 监听模式运行测试
npm run lint                   # 代码检查
npm run type-check             # TypeScript 类型检查
npm run format                 # 格式化代码

# === 清理 ===
npm run clean                  # 清理构建缓存
```

---

## 🔍 启动后端服务（可选）

如果需要连接本地后端：

```powershell
# 在另一个终端
cd ..\TimeKeeper

# 激活虚拟环境
.\.venv\Scripts\Activate.ps1

# 启动后端
python main.py
```

后端服务: `http://localhost:8000`  
API 文档: `http://localhost:8000/docs`

---

## ✅ 验证启动成功

启动成功后，你应该看到：

### 1. Metro 终端显示:
```
Welcome to Metro v0.81.5
Fast - Scalable - Integrated

INFO  Dev server ready. Press Ctrl+C to exit.
```

### 2. Android 模拟器显示登录界面:
- Logo: ⏰ 图标
- 标题: **TimeKeeper - 家庭提醒助手**
- 手机号输入框
- 验证码输入框和"获取验证码"按钮
- 绿色"登录"按钮
- "还没有账号？立即注册"链接

### 3. 应用日志显示:
```
Running "TimeKeeperTemp" with {"rootTag":11,"initialProps":{},"fabric":true}
```

---

## 🐛 常见问题排查

### Metro 连接失败
```powershell
# 检查是否有多个 Metro 进程
Get-Process -Name "node" | Where-Object {$_.Path -like "*TimeKeeperWeb*"}

# 关闭所有 node 进程
taskkill /F /IM node.exe

# 重新启动
npm start -- --reset-cache
```

### 应用显示空白屏幕
```powershell
# 1. 确保 Metro 正在运行
# 2. 在模拟器中按 R 键重新加载
# 3. 或打开开发菜单 (Ctrl+M / Cmd+M)，点击 Reload
```

### Android 构建失败
```powershell
# 清理 Gradle 缓存
cd android
.\gradlew.bat clean
rm -rf .gradle
cd ..

# 重新构建
npm run android
```

### 端口 8081 被占用
```powershell
# 查找占用进程
netstat -ano | findstr :8081

# 关闭进程 (替换 <PID> 为实际进程ID)
taskkill /PID <PID> /F
```

### 符号链接错误 (pnpm)
如果使用 pnpm 遇到符号链接问题：

```powershell
# 方案 1: 改用 npm
npm install

# 方案 2: 配置 pnpm
echo "node-linker=hoisted" > .npmrc
pnpm install
```

---

## 📚 延伸阅读

- [完整 README](../README.md) - 项目架构和详细说明
- [Windows 配置指南](./WINDOWS_SETUP.md) - Windows 环境配置
- [开发完成报告](./DEVELOPMENT_COMPLETED.md) - 已完成功能列表
- [运行指南](./RUN_GUIDE.md) - 更多运行选项

---

## 🎉 开始开发

现在你已经成功启动了 TimeKeeper 应用！

**下一步**:
- 📱 查看登录界面，测试输入交互
- 🔍 浏览项目代码结构 (`src/` 目录)
- 🛠️ 开始实现新功能或修复问题
- 📖 阅读 [开发规范](../.github/React%20Native%20前端开发规范.md)

**准备好了吗？让我们开始构建吧！** 🚀
