# 安全管理中心 - 快速启动指南

## 🎉 已完成功能

### ✅ 核心模块 (3个)

1. **SafetyManagementHome** - 安全管理中心首页
   - 📊 关键指标展示(风险、隐患、培训、费用)
   - 📈 风险分级统计图表
   - 📉 隐患治理趋势分析
   - 📋 待办事项、培训完成情况
   - ⚠️ 证照到期预警

2. **StandardArchives** - 标准规范档案库
   - 📁 类别管理(树状结构)
   - 📄 规范管理(上传/预览/下载)
   - 📑 档案信息管理
   - 📊 统计分析

3. **DualPreventionMechanism** - 双重预防机制
   - 🔴 风险分级管控(四色图)
   - ⚠️ 隐患排查治理
   - 📈 趋势分析图表
   - ✅ 闭环管理流程

### ✅ 占位模块 (9个)

以下模块已创建占位页面,待进一步开发:
- SafetyStandardization - 安全生产标准化
- WorkPermit - 作业票证管理
- SafetyTraining - 安全培训
- TeamBuilding - 班组建设
- ContractorManagement - 承包商管理
- OccupationalHealth - 职业健康
- MonitoringControl - 监测监控一张图
- SafetyCost - 安全费用管理
- EmergencyManagement - 应急管理

### ✅ 路由和菜单配置

- ✓ App.tsx 路由配置完成
- ✓ leftMenuConfig.tsx 左侧菜单配置完成
- ✓ TopNavigation.tsx 顶部菜单配置完成

## 🚀 如何访问

### 1. 启动项目

```bash
cd E:\trae\1016onemine
npm start
```

### 2. 访问路径

浏览器访问: `http://localhost:3000`

**顶部菜单路径**: 智慧安全保障 → 安全管理中心

**直接访问URL**:
- 首页: `http://localhost:3000/safety-management/home`
- 标准规范档案库: `http://localhost:3000/safety-management/standard-archives`
- 双重预防机制: `http://localhost:3000/safety-management/dual-prevention`
- 其他模块: `http://localhost:3000/safety-management/[module-name]`

### 3. 导航结构

```
智慧矿山综管平台
└── 智慧安全保障
    └── 安全管理中心 ← 新增
        ├── 首页概览
        ├── 标准规范档案库
        ├── 安全生产标准化
        ├── 双重预防机制
        ├── 作业票证管理
        ├── 安全培训
        ├── 班组建设
        ├── 承包商管理
        ├── 职业健康
        ├── 监测监控一张图
        ├── 安全费用管理
        └── 应急管理
```

## 📂 文件结构

```
src/pages/safety-management/
├── SafetyManagementHome.tsx        ✅ 完整功能
├── StandardArchives.tsx            ✅ 完整功能
├── DualPreventionMechanism.tsx     ✅ 完整功能
├── SafetyStandardization.tsx       ⏳ 占位页面
├── WorkPermit.tsx                  ⏳ 占位页面
├── SafetyTraining.tsx              ⏳ 占位页面
├── TeamBuilding.tsx                ⏳ 占位页面
├── ContractorManagement.tsx        ⏳ 占位页面
├── OccupationalHealth.tsx          ⏳ 占位页面
├── MonitoringControl.tsx           ⏳ 占位页面
├── SafetyCost.tsx                  ⏳ 占位页面
├── EmergencyManagement.tsx         ⏳ 占位页面
├── index.tsx                       ✅ 模块导出
└── README.md                       ✅ 模块文档
```

## 🎨 主要功能特性

### 安全管理中心首页
- **4个关键指标卡片**: 实时显示风险、隐患、培训、费用数据
- **风险分级统计**: 饼图展示重大/较大/一般/低风险分布
- **隐患治理趋势**: 折线图展示隐患新增、治理、逾期趋势
- **待办事项**: 时间轴展示待处理任务
- **培训完成情况**: 表格展示各部门培训完成率
- **证照到期预警**: 提前预警即将到期的证照

### 标准规范档案库
- **规范管理**: 支持上传、预览、下载标准规范文件
- **类别管理**: 树状结构管理国家/行业/企业标准
- **档案信息**: 统一管理人员/设备/制度/预案档案
- **统计分析**: 档案数量、更新频率的可视化分析

### 双重预防机制
- **风险分级管控**:
  - 风险点录入和管理
  - 四色图可视化展示
  - 管控措施执行情况跟踪
  - 风险等级统计分析
  
- **隐患排查治理**:
  - 隐患上报和登记
  - 治理流程跟踪
  - 逾期督办提醒
  - 闭环率统计

## 📊 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5
- **图表库**: ECharts + echarts-for-react
- **路由**: React Router v6
- **状态管理**: React Hooks
- **构建工具**: Create React App

## 🔧 下一步开发建议

### 优先级1 - 核心功能 (推荐先开发)

1. **监测监控一张图** (核心)
   - 集成数字孪生三维地图
   - 多子系统数据融合
   - 实时预警功能

2. **应急管理** (核心)
   - 应急预案管理
   - 自动触发机制
   - 物资智能调度

3. **安全培训**
   - 一人一档管理
   - 在线学习考试
   - 证照管理和预警

### 优先级2 - 业务功能

4. **作业票证管理**
   - 票证生命周期管理
   - 审批流程
   - 电子签章

5. **安全生产标准化**
   - 在线考核表
   - 自动汇总计算
   - 问题转隐患

### 优先级3 - 支撑功能

6. **承包商管理**
7. **职业健康**
8. **班组建设**
9. **安全费用管理**

## 🐛 已知问题

- [ ] 占位页面需要完整开发
- [ ] 缺少后端API接口
- [ ] 文档预览功能需要集成PDF.js
- [ ] 数字孪生3D地图需要集成第三方引擎
- [ ] 电子签章需要集成第三方服务

## 📚 参考文档

- **PRD文档**: `智慧安全保障.md`
- **架构图**: 
  - `功能架构图.svg`
  - `业务流程图.svg`
  - `数据流向图.svg`
- **模块文档**: `src/pages/safety-management/README.md`
- **集成指南**: `SAFETY_INTEGRATION_GUIDE.md`

## 💡 开发技巧

### 快速创建新模块

使用现有模块作为模板:

```bash
# 复制SafetyManagementHome.tsx作为模板
cp src/pages/safety-management/SafetyManagementHome.tsx src/pages/safety-management/NewModule.tsx

# 修改组件名称和内容
# 在index.tsx中添加导出
# 在App.tsx中添加路由
# 在leftMenuConfig.tsx中添加菜单项
```

### 图表开发

使用ECharts官方示例快速开发:
https://echarts.apache.org/examples/zh/index.html

### 表格开发

参考Ant Design Table组件:
https://ant.design/components/table-cn

## 🎯 当前进度

- [x] 项目结构搭建 (100%)
- [x] 路由和菜单配置 (100%)
- [x] 核心模块开发 (25% - 3/12)
- [ ] 后端API对接 (0%)
- [ ] 数据联调测试 (0%)
- [ ] 功能完善优化 (0%)

**整体进度**: 约30%

## 📞 技术支持

如有问题,请查看:
1. README.md - 模块详细说明
2. SAFETY_INTEGRATION_GUIDE.md - 完整集成指南
3. 智慧安全保障.md - PRD需求文档

---

**更新时间**: 2025-10-21  
**版本**: v1.0  
**状态**: 开发中
