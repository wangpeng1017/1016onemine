# 安全管理中心集成指南

## 已完成的工作

1. ✅ 创建了安全管理中心目录结构 `src/pages/safety-management/`
2. ✅ 开发了核心模块:
   - SafetyManagementHome.tsx - 首页(完整功能)
   - StandardArchives.tsx - 标准规范档案库(完整功能)
   - index.tsx - 模块导出文件
   - README.md - 模块文档
3. ✅ 生成了三个架构图(SVG格式):
   - 功能架构图.svg
   - 业务流程图.svg
   - 数据流向图.svg

## 待集成工作

### 1. 更新 App.tsx

在 `src/App.tsx` 中添加安全管理中心路由:

```typescript
// 在imports部分添加
import SafetyManagementHome from './pages/safety-management/SafetyManagementHome';
import StandardArchives from './pages/safety-management/StandardArchives';

// 在<Routes>内添加路由组
<Route path="safety-management">
  <Route index element={<SafetyManagementHome />} />
  <Route path="home" element={<SafetyManagementHome />} />
  <Route path="standard-archives" element={<StandardArchives />} />
  {/* 待开发模块 */}
  <Route path="safety-standardization" element={<div>安全生产标准化(待开发)</div>} />
  <Route path="dual-prevention" element={<div>双重预防机制(待开发)</div>} />
  <Route path="work-permit" element={<div>作业票证管理(待开发)</div>} />
  <Route path="safety-training" element={<div>安全培训(待开发)</div>} />
  <Route path="team-building" element={<div>班组建设(待开发)</div>} />
  <Route path="contractor-management" element={<div>承包商管理(待开发)</div>} />
  <Route path="occupational-health" element={<div>职业健康(待开发)</div>} />
  <Route path="monitoring-control" element={<div>监测监控(待开发)</div>} />
  <Route path="safety-cost" element={<div>安全费用管理(待开发)</div>} />
  <Route path="emergency-management" element={<div>应急管理(待开发)</div>} />
</Route>
```

### 2. 更新 leftMenuConfig.tsx

在 `src/config/leftMenuConfig.tsx` 中添加:

```typescript
// 添加安全管理中心左侧菜单
export const safetyManagementLeftMenu: LeftMenuItem[] = [
  {
    key: 'safety-home',
    icon: <HomeOutlined />,
    label: '首页概览',
  },
  {
    key: 'standard-archives',
    icon: <FileTextOutlined />,
    label: '标准规范档案库',
  },
  {
    key: 'safety-standardization',
    icon: <SafetyOutlined />,
    label: '安全生产标准化',
  },
  {
    key: 'dual-prevention',
    icon: <ShieldOutlined />,
    label: '双重预防机制',
  },
  {
    key: 'work-permit',
    icon: <FileProtectOutlined />,
    label: '作业票证管理',
  },
  {
    key: 'safety-training',
    icon: <TeamOutlined />,
    label: '安全培训',
  },
  {
    key: 'team-building',
    icon: <UsergroupAddOutlined />,
    label: '班组建设',
  },
  {
    key: 'contractor-management',
    icon: <SolutionOutlined />,
    label: '承包商管理',
  },
  {
    key: 'occupational-health',
    icon: <MedicineBoxOutlined />,
    label: '职业健康',
  },
  {
    key: 'monitoring-control',
    icon: <RadarChartOutlined />,
    label: '监测监控一张图',
  },
  {
    key: 'safety-cost',
    icon: <DollarOutlined />,
    label: '安全费用管理',
  },
  {
    key: 'emergency-management',
    icon: <AlertOutlined />,
    label: '应急管理',
  },
];

// 在leftMenuConfigMap中添加
export const leftMenuConfigMap: Record<string, LeftMenuItem[]> = {
  // ... 现有配置
  'safety-management': safetyManagementLeftMenu,
};
```

### 3. 添加顶部导航菜单

在顶部导航配置中添加"安全管理"菜单项(需在GlobalLayout或TopNavigation组件中):

```typescript
{
  key: 'safety-management',
  label: '安全管理',
  icon: <SafetyOutlined />,
  path: '/safety-management/home',
}
```

### 4. 创建占位页面组件

为待开发模块创建简单的占位页面:

```bash
# 在 src/pages/safety-management/ 目录下创建以下文件
SafetyStandardization.tsx
DualPreventionMechanism.tsx
WorkPermit.tsx
SafetyTraining.tsx
TeamBuilding.tsx
ContractorManagement.tsx
OccupationalHealth.tsx
MonitoringControl.tsx
SafetyCost.tsx
EmergencyManagement.tsx
```

每个文件使用以下模板:

```typescript
import React from 'react';
import { Card, Result, Button } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const ModuleName: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Result
          icon={<SafetyOutlined />}
          title="[模块名称]"
          subTitle="此模块正在开发中,敬请期待..."
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              返回
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default ModuleName;
```

## 数据库设计参考

根据PRD文档,需要设计以下数据表:

### 标准规范档案库
- `safety_standard_categories` - 标准类别表
- `safety_standards` - 标准规范表
- `safety_archives` - 档案信息表

### 双重预防机制
- `risk_points` - 风险点表
- `risk_assessments` - 风险评估表
- `hazard_records` - 隐患记录表
- `hazard_treatment` - 隐患治理表

### 作业票证
- `work_permit_templates` - 票证模板表
- `work_permits` - 票证记录表
- `permit_approvals` - 审批记录表

### 安全培训
- `training_plans` - 培训计划表
- `training_records` - 培训记录表
- `training_exams` - 考试记录表
- `certificates` - 证照管理表

### 其他核心表
- `contractors` - 承包商表
- `health_records` - 健康档案表
- `safety_costs` - 安全费用表
- `emergency_plans` - 应急预案表
- `emergency_materials` - 应急物资表

## API接口规划

### 基础接口
- GET `/api/safety-management/dashboard` - 获取首页数据
- GET `/api/safety-management/statistics` - 获取统计数据

### 标准规范
- GET `/api/standards` - 获取标准列表
- POST `/api/standards` - 上传标准
- GET `/api/standards/:id` - 获取标准详情
- DELETE `/api/standards/:id` - 删除标准

### 风险管控
- GET `/api/risks` - 获取风险列表
- POST `/api/risks` - 新增风险点
- PUT `/api/risks/:id` - 更新风险点

### 隐患排查
- GET `/api/hazards` - 获取隐患列表
- POST `/api/hazards` - 上报隐患
- PUT `/api/hazards/:id/treat` - 治理隐患
- PUT `/api/hazards/:id/verify` - 验收隐患

## 下一步开发计划

1. 创建所有待开发模块的占位页面
2. 完善路由和菜单配置
3. 按优先级开发各功能模块:
   - 双重预防机制(核心)
   - 监测监控一张图(核心)
   - 应急管理(核心)
   - 作业票证管理
   - 安全培训
   - 其他模块

4. 集成后端API
5. 数据联调测试
6. 优化用户体验

## 注意事项

1. 所有日期使用dayjs处理
2. 图表使用ECharts实现
3. 文件上传使用Ant Design Upload组件
4. 表格支持导出Excel功能
5. 移动端适配使用响应式布局
6. 权限控制集成到路由和按钮级别
7. 数字孪生3D地图需要集成第三方库(如Cesium、Three.js)

## 参考文档

- PRD文档: `智慧安全保障.md`
- 架构图: `功能架构图.svg`、`业务流程图.svg`、`数据流向图.svg`
- 模块文档: `src/pages/safety-management/README.md`
