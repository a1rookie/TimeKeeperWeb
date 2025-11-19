# TimeKeeper 项目启动指南

## 🚀 快速启动前后端服务

### 步骤 1: 启动后端服务

```powershell
# 在第一个终端中
cd d:\pygithub\TimeKeeper\TimeKeeper

# 激活虚拟环境
.\.venv\Scripts\Activate.ps1

# 启动后端服务
python main.py
```

后端服务将运行在: `http://localhost:8000`

### 步骤 2: 安装前端依赖（首次运行）

```powershell
# 在第二个终端中
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# 安装依赖（首次运行）
pnpm install

# 或使用 npm
npm install
```

### 步骤 3: 配置环境变量

```powershell
# 复制环境变量模板
copy .env.example .env

# .env 文件内容：
# API_BASE_URL=http://localhost:8000
# API_TIMEOUT=10000
# NODE_ENV=development
```

### 步骤 4: 启动前端服务

```powershell
# 启动 Metro bundler
pnpm start

# 在第三个终端运行应用
cd d:\pygithub\TimeKeeper\TimeKeeperWeb

# iOS
pnpm ios

# Android
pnpm android

# 或使用 Expo（如果需要）
npx expo start
```

---

## 📝 验证后端 API

后端启动后，访问以下地址验证：

- API 文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/api/v1/debug/health
- 就绪检查: http://localhost:8000/api/v1/debug/readiness

---

## 🔧 常见问题

### 问题 1: 后端虚拟环境未激活

```powershell
# PowerShell 执行策略问题
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 然后再激活
.\.venv\Scripts\Activate.ps1
```

### 问题 2: 前端依赖安装失败

```powershell
# 清除缓存
pnpm store prune

# 重新安装
pnpm install
```

### 问题 3: Metro bundler 缓存问题

```powershell
# 清除缓存重启
pnpm start --reset-cache
```

---

## 🎯 当前项目状态

### ✅ 已完成
- [x] 项目框架搭建
- [x] DDD 分层架构
- [x] API 客户端封装
- [x] 状态管理（Zustand + TanStack Query）
- [x] 实体类型定义
- [x] 服务层封装

### 🚧 待开发
- [ ] 导航路由配置
- [ ] 认证模块页面
- [ ] 提醒核心功能页面
- [ ] 共享组件库
- [ ] 主题系统

---

**准备好了吗？让我们开始开发！** 🚀
