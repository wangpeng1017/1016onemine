# 智慧矿山一体化平台 — 已开发功能PRD（同步代码现状）

更新时间：2025-10-18
适用范围：前端应用 smart-mining-platform（React + TS + Ant Design）当前代码库所实现的功能与流程说明。

---

## 1. 引言

本PRD面向当前代码实现，梳理门户、导航与各业务模块的已开发功能、路由范围、用户流程与验收要点；同时保留边坡监测的行业级需求背景，便于后续与后端/设备侧联调与扩展。

## 2. 总体概览

- 技术栈：React 18、TypeScript、Ant Design 5、React Router 6、ECharts。
- 应用结构：全局顶栏导航 + 左侧模块菜单 + 内容区（GlobalLayout）。
- 门户入口：PortalHome 汇聚六大域：
  - IOC中心（生产/安全主题入口预留）
  - 智慧矿山设计（含智能配矿）
  - 智能生产协同（生产执行、设备管理）
  - 智慧安全保障（边坡监测、人员定位）
  - 综合环境监测（环境参数）
  - 智慧产运销（入口预留）
- 数据状态：前端以模拟数据/占位页面为主，支持真实接口替换与部署。

## 3. 导航与布局（已开发）

- 顶部导航（TopNavigation）
  - 支持选择一级域：home、smart-safety、smart-production、smart-mine-design、env-monitoring 等。
  - 设置入口跳转 SettingsLayout。
- 左侧菜单（leftMenuConfig）
  - 按域切换左侧菜单项（如边坡监测、生产执行、设备管理、环境监测等）。
- 全局布局（GlobalLayout）
  - 路由与子路由渲染、左侧菜单点击路由跳转、路径与菜单状态同步。
- 门户首页（PortalHome）
  - 六大卡片模块与子入口按钮，点击跳转对应业务模块默认页。

## 4. 业务模块与功能（已开发）

4.1 边坡监测管理（/slope-monitoring）
- 设备管理 DeviceManagement：设备清单、状态/类型、基础CRUD（演示）。
- 模型管理 ModelManagement：监测/预测模型清单、版本/性能占位与配置。
- 阈值设置 ThresholdSettingsSimple：多类指标阈值配置（演示），支持后续扩展到规则引擎。
- 监测数据 MonitoringData：统一入口，细分子页：
  - 表面位移 SurfaceDisplacement
  - 裂缝计 CrackGauge
  - 土压力 EarthPressure
  - 地下水位 Groundwater
  - 爆破振动 BlastVibration
  - 雨量计 RainGauge
  - 雷达 Radar
  - 空天风险 AerospaceRisk（卫星/航测结果展示占位）
- 告警记录 AlarmRecords：
  - 点位告警 PointAlarms、雷达告警 RadarAlarms，列表/处理流转占位。
- 数据上报 DataReporting：
  - 控制台 Console、历史查询 HistoryQuery、系统配置上传 UploadSystemConfig、矿区拓扑 MineTopology。
- 基础与字典：
  - 基础信息 BasicInfoManagement、数据字典 DeviceTypes、账号 AccountManagement、系统配置（ProjectInfo/RegionManagement/AlarmSettings）。
- 嵌入式地图：Home.tsx 以 iFrame 集成外部Luciad地图编辑器（演示）。

4.2 人员定位安全（/personnel-safety）
- 人员追踪 PersonnelTracking：地图（PersonnelMap）、轨迹回放（TrajectoryPlayer）。
- 安全告警 SafetyAlert：告警列表、筛选、处理流程占位。
- 出勤统计 AttendanceManagement：统计看板与列表占位。
- 配置管理：沿用阈值/账号/字典等通用能力（演示）。

4.3 综合环境监测（/env-monitoring）
- EnvironmentalMonitoring：集成环境地图 EnvironmentMap、参数看板 ParameterDashboard。
- 路由别名：env-home/env-monitoring/env-sensors 指向功能聚合页。

4.4 智能配矿管理（/intelligent-ore-blending）
- IntelligentOreBlendingLayout：域内自有左侧导航（内嵌）。
- IntelligentBlendingContent、BlendingPlanContent：品位/库存约束下的方案演示与计划输出占位。

4.5 生产执行系统（/production-execution）
- 生产接续 ProductionContinuity、原煤计划 CoalOperationPlan、日常调度 DailyDispatch、地测验收 SurveyingAcceptance、生产分析 ProductionAnalysis、基础信息 BasicInfo。

4.6 设备管理系统（/equipment-management）
- 设备台账 EquipmentLedger、点检 InspectionManagement、保养 MaintenanceManagement、检测检验 TestingManagement、故障 FaultManagement、检修计划 RepairPlan。

4.7 主数据与设置（/settings）
- SettingsLayout/SettingsHome。
- 主数据（master-data）：Personnel、Equipment、Ore、OreBody、Environment。
- 数据字典 DeviceTypes、账号 AccountManagement、系统配置 ProjectInfo/RegionManagement/AlarmSettings。

## 5. 关键用户流程（端到端）

- 门户选域 → 自动跳转至域默认页（如边坡设备管理/人员追踪/环境监控）。
- 左侧菜单切换 → 内容区渲染对应页面 → 列表/图表/地图展示与筛选操作。
- 告警流程（演示版）：监测页触发告警 → 告警记录查看 → 标记处理/备注。
- 数据上报（演示版）：控制台查看 → 历史查询 → 配置上传（模拟）。

## 6. 数据与集成（现状与规划）

- 现状：前端以模拟数据驱动，组件已对接 ECharts，可替换为真实接口。
- 规划接口协议（与行业规范一致）：MQTT、HTTP、WebSocket、OPC UA、Modbus-TCP；数据采用JSON；视频流RTSP。
- 边坡数据源映射：雷达/GNSS/渗压/雨量/爆破/地应力等，对应监测子页。
- 外部系统嵌入：支持 iFrame（如Luciad）与定制页面。

## 7. 非功能性（前端目标）

- 性能：页面常规操作 < 2s；图表渲染平滑；高频图表可虚拟化与增量更新。
- 兼容：Chrome/Edge/Firefox（见README浏览器要求）。
- 架构：模块化路由 + 上下文导航状态（NavigationContext），便于扩展。

## 8. 验收标准（当前前端迭代）

- 导航与路由：所有目录项可点击进入且面包屑/菜单状态正确。
- 监测子页：各监测类型页面能加载图表或表格，切换无异常。
- 告警与上报：告警列表可展示、筛选；上报页各子页可打开并可交互（演示）。
- 环境/人员/生产/设备/配矿：各域默认页可进入，核心列表/图表正常。
- 设置与主数据：页面可进入并进行基本CRUD操作（演示）。

## 9. 路由清单（App.tsx 摘要）

- /home（PortalHome）
- /slope-monitoring/...：设备管理、模型管理、阈值、监测数据（子类）、告警（点位/雷达）、上报（控制台/历史/配置/拓扑）等
- /personnel-safety/...：人员追踪、告警、统计、设置
- /env-monitoring/...：env-home/env-monitoring/env-sensors（统一页）
- /production-execution/...：接续、计划、调度、验收、分析、基础信息
- /equipment-management/...：台账、点检、保养、检测、故障、检修计划
- /intelligent-ore-blending（域内自导航）
- /settings/...：数据字典、账号、系统配置、主数据各项

## 10. 行业背景与扩展（保留）

为保障露天矿生产安全，平台将持续对接“空-天-地”一体化监测体系，并按《新疆露天矿山边坡安全监测数据接入规范（第二版）》对采集、上报与报警联动进行扩展与落地（当前前端已预留相关页面与能力）。

---

附：技术与部署
- 技术依赖与脚本：见 package.json（start/build/test）。
- 部署：支持Vercel等静态托管，生产构建输出 build/。
- 浏览器支持范围：见 README。
