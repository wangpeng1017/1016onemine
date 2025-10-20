import {
  HomeOutlined,
  DatabaseOutlined,
  RadarChartOutlined,
  SettingOutlined,
  BarChartOutlined,
  AlertOutlined,
  CloudUploadOutlined,
  CloudOutlined,
  AppstoreOutlined,
  UserOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { LeftMenuItem } from '../context/NavigationContext';

// 边坡监测管理的左侧菜单 - 已移除基础功能菜单项（数据字典、账号管理、系统配置已移至设置页面）
export const slopeMonitoringLeftMenu: LeftMenuItem[] = [
  {
    key: 'slope-device-management',
    icon: <DatabaseOutlined />,
    label: '设备管理',
  },
  {
    key: 'slope-model-management',
    icon: <RadarChartOutlined />,
    label: '模型管理',
  },
  {
    key: 'slope-threshold-settings',
    icon: <SettingOutlined />,
    label: '阈值设置',
  },
  {
    key: 'slope-monitoring-data',
    icon: <BarChartOutlined />,
    label: '监测数据',
  },
  {
    key: 'slope-alarm-records',
    icon: <AlertOutlined />,
    label: '告警记录',
  },
  {
    key: 'slope-data-reporting',
    icon: <CloudUploadOutlined />,
    label: '数据上报',
  },
];

// 人员定位安全的左侧菜单
export const personnelSafetyLeftMenu: LeftMenuItem[] = [
  {
    key: 'personnel-tracking',
    icon: <DatabaseOutlined />,
    label: '人员追踪',
  },
  {
    key: 'personnel-safety-alert',
    icon: <AlertOutlined />,
    label: '安全告警',
  },
  {
    key: 'personnel-statistics',
    icon: <BarChartOutlined />,
    label: '统计分析',
  },
  {
    key: 'personnel-settings',
    icon: <SettingOutlined />,
    label: '配置管理',
  },
];

// IOC中心规划设计主题的左侧菜单
export const iocPlanningLeftMenu: LeftMenuItem[] = [
  {
    key: 'ioc-planning-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'ioc-mine-design',
    icon: <DatabaseOutlined />,
    label: '矿山设计',
  },
  {
    key: 'ioc-planning-overview',
    icon: <BarChartOutlined />,
    label: '规划总览',
  },
  {
    key: 'ioc-planning-analysis',
    icon: <BarChartOutlined />,
    label: '数据分析',
  },
];

// IOC中心生产综合主题的左侧菜单
export const iocProductionLeftMenu: LeftMenuItem[] = [
  {
    key: 'ioc-prod-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'ioc-prod-overview',
    icon: <BarChartOutlined />,
    label: '生产总览',
  },
  {
    key: 'ioc-prod-schedule',
    icon: <DatabaseOutlined />,
    label: '生产调度',
  },
  {
    key: 'ioc-prod-metrics',
    icon: <BarChartOutlined />,
    label: '指标监控',
  },
];

// IOC中心安全综合主题的左侧菜单
export const iocSafetyLeftMenu: LeftMenuItem[] = [
  {
    key: 'ioc-safety-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'ioc-safety-alert',
    icon: <AlertOutlined />,
    label: '安全告警',
  },
  {
    key: 'ioc-safety-analysis',
    icon: <BarChartOutlined />,
    label: '安全分析',
  },
  {
    key: 'ioc-safety-risk',
    icon: <DatabaseOutlined />,
    label: '风险评估',
  },
];

// IOC中心运转综合主题的左侧菜单
export const iocOperationLeftMenu: LeftMenuItem[] = [
  {
    key: 'ioc-op-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'ioc-op-status',
    icon: <DatabaseOutlined />,
    label: '设备状态',
  },
  {
    key: 'ioc-op-metrics',
    icon: <BarChartOutlined />,
    label: '运转指标',
  },
  {
    key: 'ioc-op-maintenance',
    icon: <SettingOutlined />,
    label: '维保管理',
  },
];

// 设备管理系统的左侧菜单
export const equipmentManagementLeftMenu: LeftMenuItem[] = [
  {
    key: 'equipment-ledger',
    icon: <DatabaseOutlined />,
    label: '设备台账管理',
  },
  {
    key: 'inspection-management',
    icon: <AlertOutlined />,
    label: '点检管理',
  },
  {
    key: 'maintenance-management',
    icon: <SettingOutlined />,
    label: '保养管理',
  },
  {
    key: 'testing-management',
    icon: <BarChartOutlined />,
    label: '检测检验管理',
  },
  {
    key: 'fault-management',
    icon: <AlertOutlined />,
    label: '设备故障管理',
  },
  {
    key: 'maintenance-plan',
    icon: <BarChartOutlined />,
    label: '检修计划管理',
  },
];

// 生产执行系统的左侧菜单
export const productionExecutionLeftMenu: LeftMenuItem[] = [
  {
    key: 'production-continuity',
    icon: <BarChartOutlined />,
    label: '生产接续管理',
  },
  {
    key: 'coal-operation-plan',
    icon: <DatabaseOutlined />,
    label: '原煤作业计划',
  },
  {
    key: 'daily-dispatch',
    icon: <AlertOutlined />,
    label: '日常调度管理',
  },
  {
    key: 'surveying-acceptance',
    icon: <DatabaseOutlined />,
    label: '地测验收管理',
  },
  {
    key: 'production-analysis',
    icon: <BarChartOutlined />,
    label: '生产情况分析',
  },
  {
    key: 'basic-info',
    icon: <SettingOutlined />,
    label: '基础信息管理',
  },
];

// 五个一级菜单的默认左侧菜单
export const defaultLeftMenu: LeftMenuItem[] = [
  {
    key: 'default-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'default-overview',
    icon: <BarChartOutlined />,
    label: '总体总览',
  },
  {
    key: 'default-config',
    icon: <SettingOutlined />,
    label: '配置管理',
  },
];

// 左侧菜单配置映射
export const leftMenuConfigMap: Record<string, LeftMenuItem[]> = {
  'slope-monitoring': slopeMonitoringLeftMenu,
  'personnel-safety': personnelSafetyLeftMenu,
  'ioc-planning': iocPlanningLeftMenu,
  'ioc-production': iocProductionLeftMenu,
  'ioc-safety': iocSafetyLeftMenu,
  'ioc-operation': iocOperationLeftMenu,
  'home': [], // 首页不显示左侧菜单
  'smart-mine-design': defaultLeftMenu,
  'intelligent-ore-blending': [], // 智能配矿管理使用自己的左侧菜单
  'production-execution': productionExecutionLeftMenu,
  'equipment-management': equipmentManagementLeftMenu,
  'env-monitoring': [
    {
      key: 'env-home',
      icon: <DashboardOutlined />,
      label: '实时监控',
    },
    {
      key: 'env-monitoring',
      icon: <EnvironmentOutlined />,
      label: '监测地图',
    },
    {
      key: 'env-sensors',
      icon: <SettingOutlined />,
      label: '传感器管理',
    },
  ],
  'comprehensive-env-monitoring': [], // 综合环境监测使用内嵌菜单
  'smart-prod-ops-sales': defaultLeftMenu,
};

export const getLeftMenuForSubMenu = (subMenuKey: string): LeftMenuItem[] => {
  return leftMenuConfigMap[subMenuKey] || slopeMonitoringLeftMenu;
};
