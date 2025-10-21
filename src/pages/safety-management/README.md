# 安全管理中心模块

基于《智慧安全保障.md》PRD文档开发的智慧矿山安全管理中心系统。

## 模块结构

### 1. SafetyManagementHome.tsx - 安全管理中心首页
- 关键指标展示(风险管控、隐患、培训、费用)
- 风险分级统计图表
- 隐患治理趋势分析
- 待办事项、培训情况、证照预警

### 2. StandardArchives.tsx - 标准规范档案库
- **规范管理**: 标准规范上传、在线预览、下载
- **类别管理**: 树状结构管理(国家/行业/企业标准)
- **档案信息**: 人员/设备/制度/预案档案管理
- **统计分析**: 档案数量统计、更新频率分析

### 3. SafetyStandardization.tsx - 安全生产标准化
- 体系框架搭建(安全基础/灾害防治/专业管理)
- 在线考核表管理
- 自动汇总计算
- 模板签章功能
- 问题转隐患闭环

### 4. DualPreventionMechanism.tsx - 双重预防机制
- **风险分级管控**: 辨识评估、四色图展示、管控措施
- **隐患排查治理**: 排查→登记→治理→验收→销号闭环
- 风险统计分析
- 隐患治理趋势
- 督办预警

### 5. WorkPermit.tsx - 作业票证管理
- 票证模板管理(动火/高空/受限空间等)
- 生命周期管理(发起→审批→签发→执行→验收)
- 审批流程
- 特殊作业看板
- 附件上传

### 6. SafetyTraining.tsx - 安全培训
- 一人一档管理
- 培训计划制定
- 在线学习考试
- 证照管理
- 到期预警
- 移动APP接口

### 7. TeamBuilding.tsx - 班组建设
- 班组管理网络
- 标准化考核
- 班前会记录
- 承诺书方案管理

### 8. ContractorManagement.tsx - 承包商管理
- 承包商信息库
- 承包商门户
- 资质审核
- 培训管理
- 安全绩效评价

### 9. OccupationalHealth.tsx - 职业健康
- 健康档案管理
- 体检管理
- 职业病防治
- 劳保用品管理
- 防护设施管理(地图标注)

### 10. MonitoringControl.tsx - 监测监控(一张图)
- 数字孪生三维地图
- 多子系统集成:
  - 边坡监测预警
  - 运输安全管控
  - 防灭火系统
  - 安全监测
  - 防排水
  - AI视频监控
- 实时数据展示
- 综合预警
- 应急联动

### 11. SafetyCost.tsx - 安全费用管理
- 年度计划
- 费用申请审批
- 10大使用范围分类
- 财务系统对接
- 统计分析报表

### 12. EmergencyManagement.tsx - 应急管理
- 应急资料库
- 预案管理(综合/专项/现场处置)
- 应急演练
- 应急处置(自动触发)
- 物资管理(地图标注、智能调度)
- 融合通信

## 技术栈

- React 18 + TypeScript
- Ant Design 5
- ECharts
- React Router
- 数字孪生/三维地图(预留接口)

## 路由配置

```typescript
// App.tsx 中添加路由
<Route path="safety-management">
  <Route index element={<SafetyManagementHome />} />
  <Route path="standard-archives" element={<StandardArchives />} />
  <Route path="safety-standardization" element={<SafetyStandardization />} />
  <Route path="dual-prevention" element={<DualPreventionMechanism />} />
  <Route path="work-permit" element={<WorkPermit />} />
  <Route path="safety-training" element={<SafetyTraining />} />
  <Route path="team-building" element={<TeamBuilding />} />
  <Route path="contractor-management" element={<ContractorManagement />} />
  <Route path="occupational-health" element={<OccupationalHealth />} />
  <Route path="monitoring-control" element={<MonitoringControl />} />
  <Route path="safety-cost" element={<SafetyCost />} />
  <Route path="emergency-management" element={<EmergencyManagement />} />
</Route>
```

## 菜单配置

在 `leftMenuConfig.tsx` 中添加安全管理中心菜单项。

## 开发状态

- ✅ SafetyManagementHome - 完成
- ✅ StandardArchives - 完成  
- ⏳ 其他模块 - 待开发

## 备注

1. 所有模块采用Ant Design组件库
2. 图表使用ECharts实现
3. 文档预览功能需集成PDF.js或Office Web Viewer
4. 数字孪生需集成第三方GIS/3D引擎
5. 移动端API需单独开发
6. 电子签章需集成第三方服务
