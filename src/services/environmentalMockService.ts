// 综合环境监测 Mock Service with localStorage persistence
import dayjs from 'dayjs';
import type {
  Document,
  DeviceStatus,
  WaterMetric,
  ThresholdConfig,
  Alert,
  WaterQualityReport,
  MonitorStation,
  AirQualityData,
  NoiseData,
  DetectionReport,
  Equipment,
  WorkLog,
  EmergencyPlan,
  DrillRecord,
  GreenMineIndicator,
  GreenMinePlan,
  GovernmentAudit,
  AssessmentStats
} from '../types/environmental';

// LocalStorage keys
const STORAGE_KEYS = {
  DOCUMENTS: 'env_documents',
  THRESHOLDS: 'env_thresholds',
  ALERTS: 'env_alerts',
  WATER_REPORTS: 'env_water_reports',
  DETECTION_REPORTS: 'env_detection_reports',
  EQUIPMENT: 'env_equipment',
  WORK_LOGS: 'env_work_logs',
  EMERGENCY_PLANS: 'env_emergency_plans',
  DRILL_RECORDS: 'env_drill_records',
  GREEN_MINE_PLANS: 'env_green_mine_plans',
  AUDITS: 'env_audits'
};

// Helper: localStorage getter/setter
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// ========== 5.1 合法合规 ==========
const SEED_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    name: '矿山环评批复_2023',
    type: 'approval',
    uploadDate: '2023-01-15',
    fileSize: '2.5MB',
    version: 'v1.0',
    tags: ['环评', '重要'],
    relatedProject: '矿山扩建项目',
    approvalDate: '2023-01-10'
  },
  {
    id: 'DOC-002',
    name: '水土保持验收报告',
    type: 'acceptance',
    uploadDate: '2023-06-20',
    fileSize: '1.8MB',
    version: 'v1.0',
    tags: ['验收', '已归档']
  }
];

export const documentService = {
  getAll: (): Document[] => getFromStorage(STORAGE_KEYS.DOCUMENTS, SEED_DOCUMENTS),
  
  add: (doc: Omit<Document, 'id' | 'uploadDate'>): Document => {
    const docs = documentService.getAll();
    const newDoc: Document = {
      ...doc,
      id: `DOC-${String(docs.length + 1).padStart(3, '0')}`,
      uploadDate: dayjs().format('YYYY-MM-DD')
    };
    const updated = [...docs, newDoc];
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);
    return newDoc;
  },

  update: (id: string, updates: Partial<Document>): void => {
    const docs = documentService.getAll();
    const updated = docs.map(d => d.id === id ? { ...d, ...updates } : d);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);
  },

  delete: (id: string): void => {
    const docs = documentService.getAll();
    saveToStorage(STORAGE_KEYS.DOCUMENTS, docs.filter(d => d.id !== id));
  }
};

// ========== 5.2 水务管理 ==========
const SEED_DEVICES: DeviceStatus[] = [
  { id: 'DEV-001', name: '1号水泵', type: 'pump', status: 'running', lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss') },
  { id: 'DEV-002', name: '2号水泵', type: 'pump', status: 'stopped', lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss') },
  { id: 'DEV-003', name: 'A区阀门', type: 'valve', status: 'running', lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss') }
];

export const waterDeviceService = {
  getAll: (): DeviceStatus[] => SEED_DEVICES
};

const SEED_WATER_METRICS: WaterMetric[] = [
  { id: 'WM-001', location: '主管道', type: 'pressure', value: 2.5, unit: 'MPa', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), status: 'normal' },
  { id: 'WM-002', location: '1号水池', type: 'level', value: 3.8, unit: 'm', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), status: 'normal' },
  { id: 'WM-003', location: '进水口', type: 'flow', value: 120, unit: 'm³/h', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), status: 'normal' }
];

let currentMetrics = [...SEED_WATER_METRICS];

export const waterMetricService = {
  getAll: (): WaterMetric[] => currentMetrics,
  
  // Simulate real-time update
  updateRealtime: (): WaterMetric[] => {
    currentMetrics = currentMetrics.map(m => {
      const delta = (Math.random() - 0.5) * 0.2;
      const newValue = Math.max(0, m.value + delta);
      let status: 'normal' | 'warning' | 'alarm' = 'normal';
      
      if (m.type === 'pressure' && newValue > 3.0) status = 'warning';
      if (m.type === 'pressure' && newValue > 3.5) status = 'alarm';
      if (m.type === 'level' && newValue < 2.0) status = 'warning';
      if (m.type === 'level' && newValue < 1.5) status = 'alarm';
      
      return {
        ...m,
        value: parseFloat(newValue.toFixed(2)),
        status,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
    });
    return currentMetrics;
  }
};

const SEED_THRESHOLDS: ThresholdConfig[] = [
  { id: 'TH-001', metric: '管道压力', maxValue: 3.0, warningThreshold: 3.0, alarmThreshold: 3.5, enabled: true },
  { id: 'TH-002', metric: '水池液位', minValue: 2.0, warningThreshold: 2.0, alarmThreshold: 1.5, enabled: true }
];

export const thresholdService = {
  getAll: (): ThresholdConfig[] => getFromStorage(STORAGE_KEYS.THRESHOLDS, SEED_THRESHOLDS),
  
  update: (id: string, updates: Partial<ThresholdConfig>): void => {
    const thresholds = thresholdService.getAll();
    const updated = thresholds.map(t => t.id === id ? { ...t, ...updates } : t);
    saveToStorage(STORAGE_KEYS.THRESHOLDS, updated);
  }
};

export const alertService = {
  getAll: (): Alert[] => getFromStorage(STORAGE_KEYS.ALERTS, []),
  
  add: (alert: Omit<Alert, 'id'>): void => {
    const alerts = alertService.getAll();
    const newAlert: Alert = { ...alert, id: `ALT-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.ALERTS, [newAlert, ...alerts].slice(0, 100)); // Keep last 100
  },

  acknowledge: (id: string): void => {
    const alerts = alertService.getAll();
    const updated = alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a);
    saveToStorage(STORAGE_KEYS.ALERTS, updated);
  }
};

export const waterReportService = {
  getAll: (): WaterQualityReport[] => getFromStorage(STORAGE_KEYS.WATER_REPORTS, []),
  
  add: (report: Omit<WaterQualityReport, 'id'>): void => {
    const reports = waterReportService.getAll();
    const newReport: WaterQualityReport = { ...report, id: `WQR-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.WATER_REPORTS, [...reports, newReport]);
  }
};

// ========== 5.3 大气、噪声 ==========
const SEED_STATIONS: MonitorStation[] = [
  { id: 'ST-001', name: 'A区空气监测站', location: [87.615, 43.795], type: 'air', status: 'normal' },
  { id: 'ST-002', name: 'B区空气监测站', location: [87.620, 43.798], type: 'air', status: 'normal' },
  { id: 'ST-003', name: '北侧噪声监测点', location: [87.618, 43.800], type: 'noise', status: 'normal' }
];

export const stationService = {
  getAll: (): MonitorStation[] => SEED_STATIONS
};

let airData: AirQualityData[] = SEED_STATIONS
  .filter(s => s.type === 'air')
  .map(s => ({
    stationId: s.id,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    PM25: 35 + Math.random() * 20,
    PM10: 50 + Math.random() * 30,
    status: 'normal' as const
  }));

let noiseData: NoiseData[] = SEED_STATIONS
  .filter(s => s.type === 'noise')
  .map(s => ({
    stationId: s.id,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    level: 60 + Math.random() * 10,
    status: 'normal' as const
  }));

export const airQualityService = {
  getLatest: (): AirQualityData[] => airData,
  
  updateRealtime: (): AirQualityData[] => {
    airData = airData.map(d => {
      const PM25 = Math.max(0, d.PM25 + (Math.random() - 0.5) * 5);
      const PM10 = Math.max(0, d.PM10 + (Math.random() - 0.5) * 8);
      let status: 'normal' | 'warning' | 'alarm' = 'normal';
      
      if (PM25 > 75 || PM10 > 150) status = 'warning';
      if (PM25 > 115 || PM10 > 250) status = 'alarm';
      
      return {
        ...d,
        PM25: parseFloat(PM25.toFixed(1)),
        PM10: parseFloat(PM10.toFixed(1)),
        status,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
    });
    return airData;
  },

  getHistorical: (stationId: string, startDate: string, endDate: string): AirQualityData[] => {
    // Generate mock historical data
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const days = end.diff(start, 'day');
    return Array.from({ length: Math.min(days, 100) }, (_, i) => ({
      stationId,
      timestamp: start.add(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
      PM25: 35 + Math.random() * 40,
      PM10: 50 + Math.random() * 50,
      status: 'normal' as const
    }));
  }
};

export const noiseService = {
  getLatest: (): NoiseData[] => noiseData,
  
  updateRealtime: (): NoiseData[] => {
    noiseData = noiseData.map(d => {
      const level = Math.max(0, d.level + (Math.random() - 0.5) * 3);
      let status: 'normal' | 'warning' | 'alarm' = 'normal';
      
      if (level > 70) status = 'warning';
      if (level > 80) status = 'alarm';
      
      return {
        ...d,
        level: parseFloat(level.toFixed(1)),
        status,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
    });
    return noiseData;
  }
};

// ========== 5.4 土壤、固废、生态 ==========
export const detectionReportService = {
  getAll: (): DetectionReport[] => getFromStorage(STORAGE_KEYS.DETECTION_REPORTS, []),
  
  add: (report: Omit<DetectionReport, 'id'>): void => {
    const reports = detectionReportService.getAll();
    const newReport: DetectionReport = { ...report, id: `DET-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.DETECTION_REPORTS, [...reports, newReport]);
  }
};

// ========== 5.5 施工单位 ==========
const SEED_EQUIPMENT: Equipment[] = [
  { id: 'EQ-001', name: '挖掘机-A', type: 'main', environmentalCompliant: true },
  { id: 'EQ-002', name: '自卸车-B', type: 'main', environmentalCompliant: true },
  { id: 'EQ-003', name: '发电机-C', type: 'auxiliary', environmentalCompliant: false, description: '排放超标' },
  { id: 'EQ-004', name: '空压机-D', type: 'auxiliary', environmentalCompliant: true }
];

export const equipmentService = {
  getAll: (): Equipment[] => getFromStorage(STORAGE_KEYS.EQUIPMENT, SEED_EQUIPMENT)
};

export const workLogService = {
  getAll: (): WorkLog[] => getFromStorage(STORAGE_KEYS.WORK_LOGS, []),
  
  add: (log: Omit<WorkLog, 'id' | 'complianceIssues'>): WorkLog => {
    const logs = workLogService.getAll();
    const equipment = equipmentService.getAll();
    
    // Check compliance
    const complianceIssues: string[] = [];
    [...log.auxiliaryEquipment].forEach(eqId => {
      const eq = equipment.find(e => e.id === eqId);
      if (eq && !eq.environmentalCompliant) {
        complianceIssues.push(`${eq.name}: 不满足环保要求`);
      }
    });
    
    const newLog: WorkLog = {
      ...log,
      id: `WL-${Date.now()}`,
      complianceIssues
    };
    saveToStorage(STORAGE_KEYS.WORK_LOGS, [...logs, newLog]);
    return newLog;
  }
};

// ========== 5.6 环保应急 ==========
export const emergencyPlanService = {
  getAll: (): EmergencyPlan[] => getFromStorage(STORAGE_KEYS.EMERGENCY_PLANS, []),
  
  add: (plan: Omit<EmergencyPlan, 'id'>): void => {
    const plans = emergencyPlanService.getAll();
    const newPlan: EmergencyPlan = { ...plan, id: `EP-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.EMERGENCY_PLANS, [...plans, newPlan]);
  },

  update: (id: string, updates: Partial<EmergencyPlan>): void => {
    const plans = emergencyPlanService.getAll();
    const updated = plans.map(p => p.id === id ? { ...p, ...updates } : p);
    saveToStorage(STORAGE_KEYS.EMERGENCY_PLANS, updated);
  },

  updateStatus: (id: string, status: EmergencyPlan['status']): void => {
    emergencyPlanService.update(id, { status, publishDate: status === 'published' ? dayjs().format('YYYY-MM-DD') : undefined });
  }
};

export const drillRecordService = {
  getAll: (): DrillRecord[] => getFromStorage(STORAGE_KEYS.DRILL_RECORDS, []),
  
  add: (record: Omit<DrillRecord, 'id'>): void => {
    const records = drillRecordService.getAll();
    const newRecord: DrillRecord = { ...record, id: `DR-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.DRILL_RECORDS, [...records, newRecord]);
  }
};

// ========== 5.7 绿色矿山 ==========
const SEED_INDICATORS: GreenMineIndicator[] = [
  {
    id: 'IND-1',
    category: '矿区环境',
    name: '环境保护',
    description: '矿区环境保护达标情况',
    weight: 25,
    children: [
      { id: 'IND-1-1', category: '矿区环境', name: '废水处理', description: '废水处理设施完善', weight: 10 },
      { id: 'IND-1-2', category: '矿区环境', name: '大气治理', description: '粉尘控制措施', weight: 8 },
      { id: 'IND-1-3', category: '矿区环境', name: '噪声控制', description: '噪声达标', weight: 7 }
    ]
  },
  {
    id: 'IND-2',
    category: '资源利用',
    name: '资源综合利用',
    description: '矿产资源综合利用水平',
    weight: 30
  },
  {
    id: 'IND-3',
    category: '生态修复',
    name: '矿山生态修复',
    description: '生态环境恢复治理',
    weight: 20
  },
  {
    id: 'IND-4',
    category: '企业管理',
    name: '现代化管理',
    description: '企业管理水平',
    weight: 15
  },
  {
    id: 'IND-5',
    category: '企业文化',
    name: '绿色文化',
    description: '企业文化建设',
    weight: 10
  }
];

export const greenMineIndicatorService = {
  getAll: (): GreenMineIndicator[] => SEED_INDICATORS,
  
  updateEvaluation: (id: string, evaluation: GreenMineIndicator['selfEvaluation']): void => {
    // For demo, just return - in real app would persist
    console.log('Update evaluation for', id, evaluation);
  }
};

export const greenMinePlanService = {
  getAll: (): GreenMinePlan[] => getFromStorage(STORAGE_KEYS.GREEN_MINE_PLANS, []),
  
  add: (plan: Omit<GreenMinePlan, 'id'>): void => {
    const plans = greenMinePlanService.getAll();
    const newPlan: GreenMinePlan = { ...plan, id: `GMP-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.GREEN_MINE_PLANS, [...plans, newPlan]);
  }
};

export const auditService = {
  getAll: (): GovernmentAudit[] => getFromStorage(STORAGE_KEYS.AUDITS, []),
  
  add: (audit: Omit<GovernmentAudit, 'id'>): void => {
    const audits = auditService.getAll();
    const newAudit: GovernmentAudit = { ...audit, id: `AUD-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.AUDITS, [...audits, newAudit]);
  }
};

export const assessmentService = {
  getStats: (period: 'day' | 'month' | 'year'): AssessmentStats[] => {
    // Generate mock stats
    const count = period === 'day' ? 30 : period === 'month' ? 12 : 5;
    return Array.from({ length: count }, (_, i) => ({
      date: dayjs().subtract(count - i - 1, period).format('YYYY-MM-DD'),
      overallScore: 75 + Math.random() * 20,
      categoryScores: {
        '矿区环境': 70 + Math.random() * 25,
        '资源利用': 75 + Math.random() * 20,
        '生态修复': 70 + Math.random() * 25,
        '企业管理': 80 + Math.random() * 15,
        '企业文化': 75 + Math.random() * 20
      }
    }));
  }
};
