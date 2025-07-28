# 魅恋奇趣时尚电商应用 - 使用说明书

## 项目概述

本项目是一个基于 Next.js 框架开发的现代化时尚电商网站，集成了多种功能模块，为用户提供优雅的购物体验。

## 功能特性

### 1. 核心功能
- **响应式设计**: 完美适配桌面、平板和移动设备
- **产品展示**: 精美的产品图片展示和详情页面
- **购物车功能**: 添加商品、修改数量、删除商品
- **用户认证**: 注册、登录、个人信息管理
- **订单管理**: 下单、支付、订单跟踪
- **搜索功能**: 商品搜索和筛选
- **收藏功能**: 收藏喜欢的商品

### 2. 技术特性
- **Next.js 13.4**: 最新的 React 框架，支持服务端渲染
- **Tailwind CSS**: 实用优先的 CSS 框架
- **响应式设计**: 移动优先的设计理念
- **SEO 优化**: 内置 SEO 最佳实践
- **性能优化**: 图片懒加载、代码分割

## 安装指南

### 系统要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **解压应用包**
   ```bash
   unzip meilian-fashion-app.zip
   cd meilian-fashion-app
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **配置环境变量**
   创建 `.env.local` 文件并添加以下配置：
   ```
   NEXT_PUBLIC_API_URL=你的API地址
   DATABASE_URL=你的数据库连接字符串
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## 项目结构

```
meilian-fashion-app/
├── pages/              # 页面组件
│   ├── index.js       # 首页
│   ├── products/      # 产品相关页面
│   ├── cart/          # 购物车页面
│   └── user/          # 用户相关页面
├── components/         # 可复用组件
│   ├── Layout/        # 布局组件
│   ├── Product/       # 产品组件
│   └── Common/        # 通用组件
├── styles/            # 样式文件
├── public/            # 静态资源
├── lib/               # 工具函数
└── api/               # API 路由

```

## 使用指南

### 1. 添加新产品
- 登录管理员账户
- 进入产品管理页面
- 点击"添加新产品"
- 填写产品信息并上传图片

### 2. 管理订单
- 在管理面板查看所有订单
- 更新订单状态
- 处理退款请求

### 3. 自定义样式
- 修改 `styles/globals.css` 更改全局样式
- 使用 Tailwind CSS 类名自定义组件样式
- 在 `tailwind.config.js` 中配置主题

## 部署指南

### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 点击部署

### 自托管部署
1. 构建生产版本
   ```bash
   npm run build
   ```
2. 启动生产服务器
   ```bash
   npm start
   ```

## 常见问题

### Q: 如何修改网站标题和 Logo？
A: 在 `pages/_app.js` 中修改网站标题，在 `public/` 目录替换 logo 文件。

### Q: 如何添加支付功能？
A: 集成支付宝或微信支付 SDK，在 `pages/api/payment/` 创建支付接口。

### Q: 如何优化性能？
A: 使用 Next.js 的图片优化组件，启用静态生成，配置 CDN。

## 技术支持

- 邮箱：support@meilian.com
- 文档：https://docs.meilian.com
- GitHub：https://github.com/meilian/fashion-app

## 更新日志

### v1.0.0 (2025-01-19)
- 初始版本发布
- 基础电商功能实现
- 响应式设计完成

---

感谢使用魅恋奇趣时尚电商应用！如有任何问题，请随时联系我们。