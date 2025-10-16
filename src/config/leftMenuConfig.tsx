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

// 边坡监测管理的左侧菜单
export const slopeMonitoringLeftMenu: LeftMenuItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'device-management',
    icon: <DatabaseOutlined />,
    label: '设备管理',
  },
  {
    key: 'model-management',
    icon: <RadarChartOutlined />,
    label: '模型管理',
  },
  {
    key: 'threshold-settings',
    icon: <SettingOutlined />,
    label: '阈值设置',
  },
  {
    key: 'monitoring-data',
    icon: <BarChartOutlined />,
    label: '监测数据',
    children: [
      { key: 'monitoring-data/surface-displacement', label: '表面位移' },
      { key: 'monitoring-data/crack-gauge', label: '裂缝计' },
      { key: 'monitoring-data/earth-pressure', label: '土压力' },
      { key: 'monitoring-data/groundwater', label: '地下水' },
      { key: 'monitoring-data/blast-vibration', label: '爆破振动' },
      { key: 'monitoring-data/rain-gauge', label: '雨量计' },
      { key: 'monitoring-data/radar', label: '雷达' },
      { key: 'monitoring-data/aerospace-risk', label: '空天风险监测' },
    ],
  },
  {
    key: 'alarm-records',
    icon: <AlertOutlined />,
    label: '告警记录',
    children: [
      { key: 'alarm-records/point-alarms', label: '测点告警' },
      { key: 'alarm-records/radar-alarms', label: '雷达告警' },
    ],
  },
  {
    key: 'data-reporting',
    icon: <CloudUploadOutlined />,
    label: '数据上报',
    children: [
      { key: 'data-reporting/console', label: '控制台' },
      { key: 'data-reporting/history-query', label: '历史查询' },
      { key: 'data-reporting/system-config', label: '系统配置' },
      { key: 'data-reporting/mine-topology', label: '矿山拓扑' },
    ],
  },
  {
    key: 'basic-platform',
    icon: <CloudOutlined />,
    label: '基础平台',
    children: [
      { key: 'basic-platform/huitu-cloud', label: '慧图云平台' },
      { key: 'basic-platform/iot-platform', label: '物联网平台' },
      { key: 'basic-platform/data-integration', label: '数据集成平台' },
    ],
  },
  {
    key: 'data-dictionary',
    icon: <AppstoreOutlined />,
    label: '数据字典',
    children: [{ key: 'data-dictionary/device-types', label: '设备类型' }],
  },
  {
    key: 'account-management',
    icon: <UserOutlined />,
    label: '账号管理',
  },
  {
    key: 'system-config',
    icon: <SettingOutlined />,
    label: '系统配置',
    children: [
      { key: 'system-config/project-info', label: '项目信息' },
      { key: 'system-config/region-management', label: '区域管理' },
      { key: 'system-config/alarm-settings', label: '告警设置' },
    ],
  },
];

// 人员定位安全的左侧菜单 (示例)
export const personnelSafetyLeftMenu: LeftMenuItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'personnel-tracking',
    icon: <DatabaseOutlined />,
    label: '人员追踪',
  },
  {
    key: 'safety-alert',
    icon: <AlertOutlined />,
    label: '安全告警',
  },
];

// IOC中心规划设计主题的左侧菜单 (示例)
export const iocPlanningLeftMenu: LeftMenuItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'mine-design',
    icon: <DatabaseOutlined />,
    label: '矿山设计',
  },
  {
    key: 'planning-overview',
    icon: <BarChartOutlined />,
    label: '规划总览',
  },
];

// 左侧菜单配置映射
export const leftMenuConfigMap: Record<string, LeftMenuItem[]> = {
  'slope-monitoring': slopeMonitoringLeftMenu,
  'personnel-safety': personnelSafetyLeftMenu,
  'ioc-planning': iocPlanningLeftMenu,
  // 为其他二级菜单添加配置...
  'ioc-production': slopeMonitoringLeftMenu, // 暂时使用相同配置
  'ioc-safety': slopeMonitoringLeftMenu,
  'ioc-operation': slopeMonitoringLeftMenu,
  'home': slopeMonitoringLeftMenu, // 首页使用默认菜单
  'smart-mine-design': slopeMonitoringLeftMenu,
  'smart-production': slopeMonitoringLeftMenu,
  'env-monitoring': slopeMonitoringLeftMenu,
  'smart-prod-ops-sales': slopeMonitoringLeftMenu,
};

export const getLeftMenuForSubMenu = (subMenuKey: string): LeftMenuItem[] => {
  return leftMenuConfigMap[subMenuKey] || slopeMonitoringLeftMenu;
};
