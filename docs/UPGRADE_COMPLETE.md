# React Native 0.78 升级完成总结

## ✅ 已解决的所有问题

### 1. React Native 版本升级
- **React**: 18.3.1 → 19.2.0
- **React Native**: 0.76.3 → 0.78.3
- **react-native-reanimated**: 3.16.4 → 3.19.4 (修复构建错误)
- **react-native-safe-area-context**: 4.12.0 → 5.6.2
- **react-native-screens**: 4.2.0 → 4.18.0

### 2. TypeScript 类型错误修复
- 修复 `useRef` React 19 兼容性问题
- 修复 `headers['Authorization']` 索引签名访问

### 3. Babel 配置优化
- 将 `react-native-reanimated/plugin` 移到 plugins 末尾（官方要求）

### 4. pnpm 符号链接问题
- **问题**: pnpm 默认使用符号链接，Docker 容器无法解析
- **解决**: 创建 `.npmrc` 文件，配置 `node-linker=hoisted`
- **结果**: node_modules 使用扁平结构，Docker 可正常访问

### 5. Docker + Gradle 构建问题
- **问题 1**: gradlew CRLF 换行符导致 "not found" 错误
  - **解决**: 在容器内使用 `sed` 转换换行符
  
- **问题 2**: React Native 0.78 需要 Node.js (npx) 来运行 autolink
  - **解决**: 使用 `reactnativecommunity/react-native-android` 镜像（包含 JDK + Node.js）

### 6. PowerShell 脚本编码问题
- **问题**: 中文注释导致乱码
- **解决**: 使用英文注释

---

## 🚀 如何使用

### 前提条件
1. 安装 Docker Desktop for Windows
2. 安装 Node.js 和 pnpm
3. 已运行 `pnpm install`

### 构建 Android 应用

**终端 1 - 启动 Metro:**
```powershell
pnpm start
```

**终端 2 - 构建:**
```powershell
# 清理构建
.\docker-gradlew.ps1 clean

# 构建 Debug APK
.\docker-gradlew.ps1 assembleDebug

# 构建 Release APK
.\docker-gradlew.ps1 assembleRelease

# 带额外参数
.\docker-gradlew.ps1 assembleDebug --stacktrace
```

**安装到设备:**
```powershell
pnpm android
```

---

## 📁 新增/修改的文件

### 配置文件
- `.npmrc` - 配置 pnpm 使用 hoisted 模式
- `babel.config.js` - Reanimated plugin 位置调整
- `package.json` - 所有依赖版本升级

### 脚本文件
- `docker-gradlew.ps1` - Docker + Gradle 构建脚本
- `docker-gradlew-alt.ps1` - 备用构建脚本
- `test-docker.ps1` - Docker 环境测试脚本

### 文档
- `docs/UPGRADE_SUMMARY.md` - 升级详细记录
- `docs/ANDROID_BUILD.md` - Android 构建完整指南

### 代码修复
- `src/shared/utils/hooks.ts` - useRef 类型修复
- `src/infrastructure/api/client.ts` - 索引签名修复

---

## 🐛 关键问题及解决方案

### 问题: "gradlew: not found" 即使文件存在
**原因**: Windows CRLF (\r\n) 换行符，Linux 无法识别  
**解决**: `sed -i 's/\r$//' gradlew` 转换为 LF (\n)

### 问题: pnpm 符号链接在 Docker 中失效
**原因**: pnpm 链接到 `/mnt/host/` 路径，Docker 容器无法访问  
**解决**: 使用 `.npmrc` 配置 `node-linker=hoisted`

### 问题: "Cannot run program npx"
**原因**: React Native 0.78 Gradle 需要 Node.js 运行 autolink  
**解决**: 使用 `reactnativecommunity/react-native-android` 镜像

### 问题: Gradle 插件找不到
**原因**: node_modules 结构问题  
**解决**: 挂载 `D:\` 到 `/mnt/host/d` + 使用 hoisted 模式

---

## 🔧 Docker 镜像说明

### 使用的镜像
```
reactnativecommunity/react-native-android:latest
```

### 包含的工具
- ✅ JDK 17
- ✅ Node.js
- ✅ npm / npx
- ✅ Android SDK
- ✅ Gradle

### 为什么不用 eclipse-temurin:17-jdk?
- ❌ 只有 JDK，没有 Node.js
- ❌ React Native 0.78 的 Gradle autolink 需要 npx

---

## 📊 验证清单

- [x] TypeScript 类型检查通过 (`pnpm run type-check`)
- [x] 依赖安装成功（使用 hoisted 模式）
- [x] Babel 配置正确
- [x] Docker 可以执行 gradlew
- [x] Gradle 可以解析 node_modules
- [x] gradlew --version 成功运行
- [ ] assembleDebug 构建成功（进行中）
- [ ] 应用成功运行

---

## 💡 重要提示

1. **首次构建会很慢**
   - Docker 需要下载镜像（~2GB）
   - Gradle 需要下载依赖

2. **D:\ 盘挂载**
   - 如果项目在其他盘（如 C:\），需修改脚本中的 `-v "D:\:/mnt/host/d"`

3. **pnpm 必须使用 hoisted 模式**
   - 否则 Docker 无法访问 node_modules 中的符号链接

4. **Windows 路径问题**
   - Docker 会自动将 `D:\path` 转换为 `/mnt/d/path`
   - 确保 Docker Desktop 的文件共享设置正确

---

## 🎯 成功标志

运行以下命令应该都成功：
```powershell
# 1. 类型检查
pnpm run type-check

# 2. Gradle 版本
.\docker-gradlew.ps1 --version

# 3. 清理构建
.\docker-gradlew.ps1 clean

# 4. 构建 APK
.\docker-gradlew.ps1 assembleDebug

# 5. 运行应用
pnpm android
```

---

## 📞 故障排除

### Docker 相关
```powershell
# 检查 Docker 是否运行
docker --version
docker ps

# 测试容器
docker run --rm hello-world

# 查看 Docker 磁盘使用
docker system df
```

### Gradle 相关
```powershell
# 查看详细错误
.\docker-gradlew.ps1 assembleDebug --stacktrace

# 查看所有任务
.\docker-gradlew.ps1 tasks

# 清理 Gradle 缓存（在容器内）
docker run --rm -v ${PWD}:/app -w /app reactnativecommunity/react-native-android bash -c "cd android && rm -rf .gradle build app/build"
```

### pnpm 相关
```powershell
# 验证 hoisted 模式
Get-Content .npmrc

# 检查 node_modules 结构
Test-Path node_modules/@react-native/gradle-plugin

# 重新安装
Remove-Item -Recurse -Force node_modules
pnpm install
```

---

**升级完成时间**: 2025年11月19日  
**最终版本**: React 19.2.0 + React Native 0.78.3  
**构建方式**: Docker (reactnativecommunity/react-native-android)
