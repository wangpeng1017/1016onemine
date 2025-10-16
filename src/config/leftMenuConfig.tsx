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
} from '@ant-design/icons';
import { LeftMenuItem } from '../context/NavigationContext';

// 边坡监测管理的左侧菜单 - 按照图片中的内容
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
  {
    key: 'slope-data-dictionary',
    icon: <AppstoreOutlined />,
    label: '数据字典',
  },
  {
    key: 'slope-account-management',
    icon: <UserOutlined />,
    label: '账号管理',
  },
  {
    key: 'slope-system-config',
    icon: <SettingOutlined />,
    label: '系统配置',
  },
];

// 人员定位安全的左侧菜单
export const personnelSafetyLeftMenu: LeftMenuItem[] = [
  {
    key: 'personnel-home',
    icon: <HomeOutlined />,
    label: '首页',
  },
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
  'smart-production': defaultLeftMenu,
  'env-monitoring': defaultLeftMenu,
  'smart-prod-ops-sales': defaultLeftMenu,
};

export const getLeftMenuForSubMenu = (subMenuKey: string): LeftMenuItem[] => {
  return leftMenuConfigMap[subMenuKey] || slopeMonitoringLeftMenu;
};
