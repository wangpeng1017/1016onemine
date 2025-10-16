# 智慧矿山平台

这是一个基于React + TypeScript + Ant Design构建的智慧矿山平台应用，提供全面的矿山监测、安全预警和数据管理功能。

## 功能特性

### 🎯 核心功能模块

- **数据上报** - 监测数据上报记录查询和管理
- **监测数据** - 多种传感器数据的实时展示和历史查询
- **告警记录** - 告警信息管理和处理流程
- **设备管理** - 监测设备的配置和状态管理
- **模型管理** - AI预测模型的管理和运行
- **阈值设置** - 各类传感器的预警和危险阈值配置

### 📊 监测数据类型

- 雷达位移数据
- 土压力数据
- 裂缝计数据
- 地下水位数据
- 雨量计数据
- 爆破振动数据

### 🎨 UI特性

- 现代化的管理后台界面设计
- 响应式布局，支持多种屏幕尺寸
- 丰富的数据可视化图表
- 直观的数据表格和操作界面
- 完整的CRUD操作流程

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **路由管理**: React Router 6
- **图表库**: ECharts + echarts-for-react
- **构建工具**: Create React App
- **样式方案**: CSS + Ant Design主题

## 项目结构

```
smart-mining-platform/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 通用组件
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.tsx # 主布局
│   ├── pages/             # 页面组件
│   │   ├── DataReporting.tsx      # 数据上报
│   │   ├── MonitoringData.tsx     # 监测数据
│   │   ├── AlarmRecords.tsx       # 告警记录
│   │   ├── DeviceManagement.tsx   # 设备管理
│   │   ├── ModelManagement.tsx    # 模型管理
│   │   └── ThresholdSettings.tsx  # 阈值设置
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 全局样式
│   └── index.tsx          # 应用入口
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
└── README.md             # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm start
# 或
yarn start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建文件将输出到 `build/` 目录

## Vercel部署

### 方法一：通过Vercel CLI

1. 安装Vercel CLI
```bash
npm i -g vercel
```

2. 在项目根目录运行
```bash
vercel
```

3. 按照提示完成部署配置

### 方法二：通过Git集成

1. 将代码推送到GitHub仓库
2. 在Vercel控制台导入项目
3. 配置构建设置：
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. 点击Deploy完成部署

### 环境变量配置

如需配置环境变量，在Vercel项目设置中添加：

```
REACT_APP_API_BASE_URL=your_api_url
REACT_APP_VERSION=1.0.0
```

## 功能说明

### 数据上报模块
- 展示设备数据上报记录
- 支持按设备名称、数据类型、时间范围筛选
- 提供数据详情查看和下载功能

### 监测数据模块
- 多标签页展示不同类型的监测数据
- 实时数据图表展示
- 历史数据表格查询
- 支持数据导出功能

### 告警记录模块
- 告警信息的分级管理
- 告警处理流程跟踪
- 支持告警状态更新和处理

### 设备管理模块
- 设备信息的增删改查
- 设备状态监控
- 设备分类管理

### 模型管理模块
- AI模型的上传和管理
- 模型性能监控
- 模型版本控制

### 阈值设置模块
- 各类传感器阈值配置
- 预警和危险级别设置
- 阈值规则管理

## 数据说明

当前版本使用模拟数据进行演示，实际部署时需要：

1. 替换API接口调用
2. 配置真实的数据源
3. 调整数据格式和字段映射
4. 添加用户认证和权限控制

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 开发说明

### 添加新页面

1. 在 `src/pages/` 目录创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在 `src/layouts/MainLayout.tsx` 中添加菜单项

### 自定义主题

修改 `src/App.css` 中的CSS变量来自定义主题色彩。

### 添加新的图表

使用ECharts配置对象创建图表，参考 `MonitoringData.tsx` 中的实现。

## 许可证

MIT License

## 部署状态

✅ **项目构建成功** - 所有依赖已正确安装，TypeScript编译无错误
✅ **生产构建完成** - build文件夹已生成，可直接部署到Vercel
✅ **Vercel部署修复** - 移除了冲突的vercel.json配置，让Vercel自动检测Create React App
✅ **代码质量优化** - 修复了未使用的导入警告
✅ **响应式设计** - 支持桌面和移动设备访问
✅ **模拟数据完整** - 所有功能模块都有完整的演示数据

## 部署到Vercel

### 快速部署

1. 将项目推送到GitHub仓库
2. 在Vercel控制台点击"New Project"
3. 导入GitHub仓库
4. Vercel会自动检测到这是一个Create React App项目
5. 点击"Deploy"即可完成部署

### 自动配置

Vercel会自动检测到这是一个Create React App项目并使用以下配置：
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

无需手动配置，Vercel会自动处理所有设置。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: support@example.com
- 项目地址: https://github.com/your-username/mine-monitoring-demo
