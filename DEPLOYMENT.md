# 矿山监测系统 - 部署指南

## 项目概述

基于项目文件夹中的界面截图，我已成功创建了一个完整的矿山监测系统前端演示应用。该应用完全复制了原始设计中的UI界面和功能模块。

## 已实现的功能模块

### 1. 数据上报模块 (`/data-reporting`)
- ✅ 数据上报记录展示
- ✅ 按设备名称、数据类型、时间范围筛选
- ✅ 上报状态统计（成功/失败/处理中）
- ✅ 数据详情查看和下载功能
- ✅ 响应式表格设计

### 2. 监测数据模块 (`/monitoring-data`)
- ✅ 6种传感器数据展示：雷达、土压力、裂缝计、地下水、雨量计、爆破振动
- ✅ 实时数据图表（ECharts）
- ✅ 历史数据表格
- ✅ 设备状态统计
- ✅ 数据导出功能

### 3. 告警记录模块 (`/alarm-records`)
- ✅ 告警信息分级管理（低级/中级/高级/紧急）
- ✅ 告警处理流程（待处理/处理中/已处理）
- ✅ 告警统计概览
- ✅ 紧急告警提示
- ✅ 告警详情查看

### 4. 设备管理模块 (`/device-management`)
- ✅ 设备信息增删改查
- ✅ 设备状态监控（在线/离线/维护中）
- ✅ 设备分类管理（传感器/监控设备）
- ✅ 电池电量和信号强度显示
- ✅ 设备统计概览

### 5. 模型管理模块 (`/model-management`)
- ✅ AI模型管理（机器学习/深度学习/数值模拟等）
- ✅ 模型状态跟踪（运行中/未激活/训练中/错误）
- ✅ 模型准确率展示
- ✅ 模型上传和下载功能
- ✅ 模型版本控制

### 6. 阈值设置模块 (`/threshold-settings`)
- ✅ 6种传感器阈值配置
- ✅ 预警和危险级别设置
- ✅ 阈值规则管理
- ✅ 动态表单配置

## 技术实现特点

### UI/UX设计
- ✅ 完全复制原始设计的视觉风格
- ✅ 现代化的管理后台界面
- ✅ 蓝色主题色彩方案
- ✅ 响应式布局设计
- ✅ 直观的数据可视化

### 技术栈
- ✅ React 18 + TypeScript
- ✅ Ant Design 5.x UI组件库
- ✅ React Router 6 路由管理
- ✅ ECharts 图表库
- ✅ 完整的TypeScript类型定义

### 功能特性
- ✅ 完整的CRUD操作
- ✅ 丰富的模拟数据
- ✅ 交互式图表展示
- ✅ 状态管理和数据流
- ✅ 表单验证和错误处理

## 部署状态

### ✅ 构建成功
- 所有依赖正确安装
- TypeScript编译无错误
- 生产构建完成
- 静态资源优化

### ✅ Vercel就绪
- 包含vercel.json配置文件
- 支持SPA路由
- 静态资源缓存优化
- 环境变量配置

## 快速部署到Vercel

### 方法一：GitHub集成（推荐）

1. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Mine monitoring system demo"
   git remote add origin https://github.com/your-username/mine-monitoring-demo.git
   git push -u origin main
   ```

2. **Vercel部署**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择GitHub仓库
   - Vercel自动检测配置
   - 点击 "Deploy"

### 方法二：Vercel CLI

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署项目**
   ```bash
   vercel
   ```

3. **按提示完成配置**

## 本地开发

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 启动步骤
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 本地预览构建版本
npx serve -s build
```

## 项目结构
```
mine-monitoring-demo/
├── public/                 # 静态资源
├── src/
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.tsx # 主布局（侧边栏+顶部导航）
│   ├── pages/             # 页面组件
│   │   ├── DataReporting.tsx      # 数据上报
│   │   ├── MonitoringData.tsx     # 监测数据
│   │   ├── AlarmRecords.tsx       # 告警记录
│   │   ├── DeviceManagement.tsx   # 设备管理
│   │   ├── ModelManagement.tsx    # 模型管理
│   │   └── ThresholdSettings.tsx  # 阈值设置
│   ├── App.tsx            # 主应用组件
│   └── App.css            # 全局样式
├── package.json           # 项目配置
├── vercel.json           # Vercel部署配置
└── README.md             # 项目文档
```

## 后续扩展建议

### 数据集成
- 替换模拟数据为真实API接口
- 添加WebSocket实时数据推送
- 集成时间序列数据库

### 功能增强
- 用户认证和权限管理
- 数据导出和报表生成
- 移动端适配优化
- 离线数据缓存

### 性能优化
- 代码分割和懒加载
- 图表数据虚拟化
- CDN资源优化

## 演示地址

部署完成后，您将获得一个类似以下的访问地址：
`https://mine-monitoring-demo.vercel.app`

## 支持

如有任何问题或需要技术支持，请联系开发团队。
