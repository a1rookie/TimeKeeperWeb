# 🎯 TimeKeeper 启动命令速查表

## 快速启动（推荐）

### 方式 1: 一键启动所有服务 🚀

```powershell
cd d:\pygithub\TimeKeeper\TimeKeeperWeb
.\start-all.ps1
```

这会自动打开两个窗口：
- 窗口 1: 后端 API 服务
- 窗口 2: 前端 Metro Bundler

---

## 分步启动

### 步骤 1: 启动后端 📡

```powershell
# 新开一个 PowerShell 终端
cd d:\pygithub\TimeKeeper\TimeKeeper

# 激活虚拟环境
.\.venv\Scripts\Activate.ps1

# 启动后端
python main.py
```

✅ 成功标志：看到 "Uvicorn running on http://0.0.0.0:8000"

🔗 验证后端：http://localhost:8000/docs

---

### 步骤 2: 安装前端依赖（首次）📦

```powershell
# 新开一个 PowerShell 终端
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# 安装依赖
pnpm install

# 或使用 npm
npm install
```

⏱️ 预计时间：2-5 分钟

---

### 步骤 3: 启动前端 📱

```powershell
# 在前端目录
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# 启动 Metro
pnpm start

# 或
npm start
```

✅ 成功标志：看到 Metro Bundler 的二维码

---

### 步骤 4: 运行应用 🏃

打开新终端（保持 Metro 运行）：

```powershell
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# iOS (需要 Mac 和 Xcode)
pnpm ios

# Android (需要 Android Studio 和模拟器)
pnpm android

# 使用 Expo (如果配置了)
npx expo start
```

---

## 常用命令 🔧

### 后端命令

```powershell
# 查看 API 文档
start http://localhost:8000/docs

# 健康检查
curl http://localhost:8000/api/v1/debug/health

# 运行测试
cd d:\pygithub\TimeKeeper\TimeKeeper
pytest
```

### 前端命令

```powershell
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# 清除缓存重启
pnpm start --reset-cache

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test
```

---

## 常见问题解决 🐛

### 问题 1: PowerShell 执行策略错误

```powershell
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 问题 2: 后端端口被占用

```powershell
# 查找占用 8000 端口的进程
netstat -ano | findstr :8000

# 结束进程（替换 PID）
taskkill /PID <进程ID> /F
```

### 问题 3: Metro 缓存问题

```powershell
# 完全清除缓存
cd d:\pygithub\TimeKeeper\TimeKeeperWeb
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .metro-health-check*
pnpm install
pnpm start --reset-cache
```

### 问题 4: 依赖安装失败

```powershell
# 清除 pnpm 缓存
pnpm store prune

# 重新安装
pnpm install --force
```

---

## 开发工作流 💡

### 典型的一天

1. **早上启动**
   ```powershell
   cd d:\pygithub\TimeKeeper\TimeKeeperWeb
   .\start-all.ps1
   ```

2. **开发中**
   - 修改代码
   - 保存后自动热重载
   - 查看控制台错误

3. **提交前**
   ```powershell
   pnpm type-check  # TypeScript 检查
   pnpm lint        # ESLint 检查
   pnpm format      # 代码格式化
   pnpm test        # 运行测试
   ```

4. **提交代码**
   ```powershell
   git add .
   git commit -m "feat: 添加新功能"
   git push
   ```

---

## 调试技巧 🔍

### 后端调试

```powershell
# 查看实时日志
cd d:\pygithub\TimeKeeper\TimeKeeper
python main.py

# 使用调试器
python -m debugpy --listen 5678 main.py
```

### 前端调试

- **Chrome DevTools**: 
  - Metro 运行时按 `d` 打开开发者菜单
  - 选择 "Debug JS Remotely"
  
- **React Native Debugger**:
  ```powershell
  # 下载并安装
  choco install react-native-debugger
  ```

- **日志输出**:
  ```typescript
  console.log('调试信息')  // 在 Metro 终端查看
  ```

---

## 性能监控 📊

### 查看后端性能

```powershell
# 访问 Swagger UI
start http://localhost:8000/docs

# 查看数据库连接
start http://localhost:8000/api/v1/debug/readiness
```

### 查看前端性能

- 按 `Shift + M` 打开性能监控
- 使用 React DevTools Profiler
- 检查 Metro 的 Bundle 大小

---

## 快速重启 🔄

```powershell
# 停止所有服务
# 按 Ctrl+C 在各个终端

# 快速重启
cd d:\pygithub\TimeKeeper\TimeKeeperWeb
.\start-all.ps1
```

---

## 团队协作 👥

### 同步最新代码

```powershell
# 拉取最新代码
git pull

# 更新后端依赖
cd d:\pygithub\TimeKeeper\TimeKeeper
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 更新前端依赖
cd d:\pygithub\TimeKeeper\TimeKeeperWeb
pnpm install
```

---

**准备好开始开发了吗？运行 `.\start-all.ps1` 启动所有服务！** 🚀
