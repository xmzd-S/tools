# Tauri + Vue + TypeScript 博客系统

一个基于 Tauri + Vue 3 + TypeScript 开发的现代化博客系统，提供完整的文章管理、分类功能、数据统计和响应式界面设计。

## ✨ 特性

- 📝 **文章管理** - 完整的博客文章创建、编辑、查看和删除功能
- 📁 **分类管理** - 灵活的分类系统，支持多级分类
- 📊 **数据统计** - 实时仪表板，展示文章、浏览量、点赞等统计数据
- 🔍 **搜索过滤** - 强大的搜索和筛选功能，支持关键词、分类、标签筛选
- 📱 **响应式设计** - 完美适配桌面、平板和移动设备
- ✨ **交互动画** - 流畅的动画效果，提升用户体验
- 🎨 **现代化UI** - 基于 Ant Design Vue 的精美界面设计
- 🚀 **高性能** - 基于 Vite 构建，快速开发和构建
- 🖥️ **跨平台** - 使用 Tauri 构建，支持 Windows、macOS 和 Linux

## 🛠️ 技术栈

### 前端
- **Vue 3.5.13** - 渐进式 JavaScript 框架
- **TypeScript 5.6.2** - JavaScript 的超集，提供类型安全
- **Vite 6.0.3** - 下一代前端构建工具
- **Pinia 3.0.4** - Vue 3 官方推荐的状态管理库
- **Vue Router 4.6.4** - Vue.js 官方路由管理器
- **Ant Design Vue 4.2.6** - 企业级 UI 设计语言和 Vue 实现

### 桌面应用
- **Tauri 2** - 使用 Rust 构建更小、更快的跨平台桌面应用

## 📁 项目结构

```
tauri-app/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 可复用组件
│   │   ├── BlogPostCard.vue      # 博客文章卡片组件
│   │   ├── BlogPostDetail.vue    # 博客文章详情组件
│   │   ├── ToolCard.vue          # 工具卡片组件
│   │   ├── ToolsSection.vue      # 工具区域组件
│   │   ├── AIChat.vue            # AI 聊天组件
│   │   └── JSONFormatter.vue     # JSON 格式化工具
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理
│   │   ├── blogStore.ts           # 博客文章状态
│   │   └── categoryStore.ts       # 分类状态
│   ├── views/               # 页面组件
│   │   ├── AboutView.vue          # 关于页面
│   │   ├── BlogListView.vue       # 博客列表页面
│   │   ├── CategoryListView.vue   # 分类列表页面
│   │   ├── DashboardView.vue      # 控制台页面
│   │   └── HomeView.vue           # 首页
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── public/                  # 公共资源
├── src-tauri/               # Tauri 后端代码
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
├── DEVELOPMENT.md           # 开发文档
└── README.md                # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm
- Rust (用于 Tauri 桌面应用)

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### Tauri 开发

```bash
npm run tauri dev
```

### Tauri 构建

```bash
npm run tauri build
```

## 📖 功能说明

### 首页
- 欢迎横幅和快速导航
- 快速访问卡片（博客文章、文章分类、控制台、关于我们）
- 最新文章展示
- 统计数据概览

### 博客文章
- 文章列表展示
- 搜索功能（关键词搜索）
- 筛选功能（按分类、标签）
- 侧边栏（最新文章、热门文章、文章分类、热门标签）
- 文章详情页面

### 分类管理
- 分类列表展示
- 分类卡片设计
- 分类统计信息
- 按分类筛选文章

### 控制台
- 数据统计卡片（文章总数、浏览量、点赞数、分类数量）
- 文章发布趋势图表
- 分类分布统计
- 最新文章列表
- 系统状态监控
- 快捷操作入口

### 关于我们
- 项目介绍
- 核心特性展示
- 团队信息

## 🎨 设计规范

### 颜色主题
- **主色调**: `#667eea` - `#764ba2` (渐变紫色)
- **背景色**: `#f8fafc` (浅灰背景)
- **卡片背景**: `#ffffff` (白色)
- **文字色**: `#1e293b` (深灰)
- **次要文字**: `#64748b` (中灰)

### 响应式断点
- **桌面**: > 1200px
- **平板**: 768px - 1200px
- **移动**: < 768px

## 📚 文档

详细的开发文档请参阅 [DEVELOPMENT.md](./DEVELOPMENT.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Tauri](https://tauri.app/)
- [Ant Design Vue](https://antdv.com/)
- [Vite](https://vitejs.dev/)

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件

---

**注意**: 这是一个演示项目，目前使用模拟数据。在生产环境中，您需要集成后端 API 来实现真实的数据持久化。
