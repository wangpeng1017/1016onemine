// 智慧产运销管理中心 Mock Service
import dayjs from 'dayjs';
import type {
  SalesPlan,
  ApprovalRecord,
  ExecutionRecord,
  WeighbridgeRecord,
  Silo,
  TemporaryCoalPile,
  LossRecord,
  ProductionReport,
  BalanceSheet,
  SalesDashboard,
  Customer,
  CustomerFeedback,
  SalesStatistics
} from '../types/productionSales';

// LocalStorage keys
const STORAGE_KEYS = {
  SALES_PLANS: 'ps_sales_plans',
  WEIGHBRIDGE: 'ps_weighbridge',
  TEMP_PILES: 'ps_temp_piles',
  LOSS_RECORDS: 'ps_loss_records',
  CUSTOMERS: 'ps_customers',
  FEEDBACKS: 'ps_feedbacks'
};

// Helper functions
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

// ========== 3.1 销售计划 ==========
const SEED_PLANS: SalesPlan[] = [
  {
    id: 'PLAN-001',
    name: '2024年第一季度销售计划',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    salesVolume: 50000,
    coalQuality: { calorificValue: 5500, sulfurContent: 0.8 },
    estimatedAmount: 25000000,
    channel: '直销',
    responsiblePerson: '张三',
    status: 'executing',
    createdAt: '2023-12-15',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-001', approver: '王总', action: 'approve', opinion: '同意执行', timestamp: '2023-12-20 10:00:00' }
    ],
    executionRecords: [
      { id: 'EXE-001', date: '2024-01-15', completedVolume: 15000, completedAmount: 7500000, progress: 30, reporter: '张三' }
    ]
  },
  {
    id: 'PLAN-002',
    name: '2024年第二季度销售计划',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    salesVolume: 60000,
    coalQuality: { calorificValue: 5800, sulfurContent: 0.7 },
    estimatedAmount: 32000000,
    channel: '分销',
    responsiblePerson: '李四',
    status: 'approved',
    createdAt: '2024-02-10',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-002', approver: '王总', action: 'approve', opinion: '同意', timestamp: '2024-02-15 14:30:00' }
    ]
  },
  {
    id: 'PLAN-003',
    name: 'XX电力公司月度供应计划',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    salesVolume: 15000,
    coalQuality: { calorificValue: 5600, sulfurContent: 0.75 },
    estimatedAmount: 7800000,
    channel: '直销',
    responsiblePerson: '王五',
    status: 'executing',
    createdAt: '2024-02-20',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-003', approver: '王总', action: 'approve', opinion: '重要客户，优先保障', timestamp: '2024-02-22 09:00:00' }
    ],
    executionRecords: [
      { id: 'EXE-003', date: '2024-03-10', completedVolume: 8500, completedAmount: 4420000, progress: 57, reporter: '王五' }
    ]
  },
  {
    id: 'PLAN-004',
    name: '南方市场拓展计划',
    startDate: '2024-05-01',
    endDate: '2024-12-31',
    salesVolume: 120000,
    coalQuality: { calorificValue: 5400, sulfurContent: 0.9 },
    estimatedAmount: 60000000,
    channel: '分销',
    responsiblePerson: '赵六',
    status: 'pending',
    createdAt: '2024-03-01',
    createdBy: '李经理'
  },
  {
    id: 'PLAN-005',
    name: '上半年线上销售计划',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    salesVolume: 35000,
    estimatedAmount: 17500000,
    channel: '线上',
    responsiblePerson: '孙七',
    status: 'executing',
    createdAt: '2023-12-25',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-005', approver: '王总', action: 'approve', opinion: '支持新渠道尝试', timestamp: '2024-01-02 11:00:00' }
    ],
    executionRecords: [
      { id: 'EXE-005', date: '2024-02-01', completedVolume: 12000, completedAmount: 6000000, progress: 34, reporter: '孙七' }
    ]
  },
  {
    id: 'PLAN-006',
    name: '周边矿区合作计划',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    salesVolume: 28000,
    coalQuality: { calorificValue: 5300, sulfurContent: 1.0 },
    estimatedAmount: 13000000,
    channel: '直销',
    responsiblePerson: '张三',
    status: 'completed',
    createdAt: '2024-01-20',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-006', approver: '王总', action: 'approve', opinion: '同意', timestamp: '2024-01-25 15:00:00' }
    ],
    summary: {
      actualVolume: 29500,
      actualAmount: 13725000,
      completionRate: 105,
      analysis: '超额完成，客户满意度高',
      improvements: '继续保持合作'
    }
  },
  {
    id: 'PLAN-007',
    name: 'Q1出口计划',
    startDate: '2024-01-10',
    endDate: '2024-03-31',
    salesVolume: 42000,
    coalQuality: { calorificValue: 6000, sulfurContent: 0.6 },
    estimatedAmount: 25200000,
    channel: '分销',
    responsiblePerson: '李四',
    status: 'executing',
    createdAt: '2023-12-18',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-007', approver: '王总', action: 'approve', opinion: '高品质煤炭，优先保障', timestamp: '2023-12-22 10:30:00' }
    ],
    executionRecords: [
      { id: 'EXE-007', date: '2024-02-15', completedVolume: 28000, completedAmount: 16800000, progress: 67, reporter: '李四' }
    ]
  },
  {
    id: 'PLAN-008',
    name: '北方区域专供计划',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    salesVolume: 95000,
    coalQuality: { calorificValue: 5500, sulfurContent: 0.85 },
    estimatedAmount: 48000000,
    channel: '直销',
    responsiblePerson: '赵六',
    status: 'approved',
    createdAt: '2024-02-05',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-008', approver: '王总', action: 'approve', opinion: '同意执行', timestamp: '2024-02-12 16:00:00' }
    ]
  },
  {
    id: 'PLAN-009',
    name: '工业园区配套供应',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    salesVolume: 72000,
    estimatedAmount: 35000000,
    channel: '直销',
    responsiblePerson: '孙七',
    status: 'draft',
    createdAt: '2024-03-10',
    createdBy: '李经理',
    remark: '待合同签署后提交审批'
  },
  {
    id: 'PLAN-010',
    name: '三季度分销渠道计划',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    salesVolume: 55000,
    coalQuality: { calorificValue: 5700, sulfurContent: 0.75 },
    estimatedAmount: 29000000,
    channel: '分销',
    responsiblePerson: '张三',
    status: 'draft',
    createdAt: '2024-03-15',
    createdBy: '李经理'
  },
  {
    id: 'PLAN-011',
    name: '煤化工企业供应计划',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    salesVolume: 150000,
    coalQuality: { calorificValue: 5900, sulfurContent: 0.65 },
    estimatedAmount: 82500000,
    channel: '直销',
    responsiblePerson: '李四',
    status: 'executing',
    createdAt: '2024-01-10',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-011', approver: '王总', action: 'approve', opinion: '长期大客户，重点保障', timestamp: '2024-01-15 09:30:00' }
    ],
    executionRecords: [
      { id: 'EXE-011', date: '2024-03-01', completedVolume: 45000, completedAmount: 24750000, progress: 30, reporter: '李四' }
    ]
  },
  {
    id: 'PLAN-012',
    name: '春节前应急供应',
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    salesVolume: 8000,
    estimatedAmount: 4200000,
    channel: '直销',
    responsiblePerson: '王五',
    status: 'completed',
    createdAt: '2024-01-05',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-012', approver: '王总', action: 'approve', opinion: '加急，立即执行', timestamp: '2024-01-06 08:00:00' }
    ],
    summary: {
      actualVolume: 8200,
      actualAmount: 4305000,
      completionRate: 103,
      analysis: '提前完成，保障了节前需求',
      improvements: '应急机制运作良好'
    }
  },
  {
    id: 'PLAN-013',
    name: '中小企业集采计划',
    startDate: '2024-03-15',
    endDate: '2024-06-15',
    salesVolume: 32000,
    coalQuality: { calorificValue: 5400, sulfurContent: 0.9 },
    estimatedAmount: 15000000,
    channel: '分销',
    responsiblePerson: '赵六',
    status: 'pending',
    createdAt: '2024-02-28',
    createdBy: '张主管'
  },
  {
    id: 'PLAN-014',
    name: '南部省份进驻项目',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    salesVolume: 88000,
    coalQuality: { calorificValue: 5650, sulfurContent: 0.8 },
    estimatedAmount: 46000000,
    channel: '直销',
    responsiblePerson: '孙七',
    status: 'draft',
    createdAt: '2024-03-20',
    createdBy: '李经理',
    remark: '新市场开拓，需详细调研'
  },
  {
    id: 'PLAN-015',
    name: 'Q2线上平台促销',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    salesVolume: 25000,
    estimatedAmount: 12000000,
    channel: '线上',
    responsiblePerson: '张三',
    status: 'approved',
    createdAt: '2024-03-05',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-015', approver: '王总', action: 'approve', opinion: '支持线上业务发展', timestamp: '2024-03-08 14:00:00' }
    ]
  },
  {
    id: 'PLAN-016',
    name: '四季度常规销售',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    salesVolume: 65000,
    coalQuality: { calorificValue: 5500, sulfurContent: 0.85 },
    estimatedAmount: 33000000,
    channel: '直销',
    responsiblePerson: '李四',
    status: 'draft',
    createdAt: '2024-03-22',
    createdBy: '李经理'
  },
  {
    id: 'PLAN-017',
    name: '建筑行业专项供应',
    startDate: '2024-05-01',
    endDate: '2024-10-31',
    salesVolume: 78000,
    estimatedAmount: 38000000,
    channel: '分销',
    responsiblePerson: '王五',
    status: 'pending',
    createdAt: '2024-03-12',
    createdBy: '张主管'
  },
  {
    id: 'PLAN-018',
    name: '冬季供暖备货计划',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    salesVolume: 120000,
    coalQuality: { calorificValue: 5800, sulfurContent: 0.7 },
    estimatedAmount: 66000000,
    channel: '直销',
    responsiblePerson: '赵六',
    status: 'draft',
    createdAt: '2024-03-25',
    createdBy: '李经理',
    remark: '提前筹划，保障冬季供应'
  },
  {
    id: 'PLAN-019',
    name: '上半年总部直属客户',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    salesVolume: 105000,
    coalQuality: { calorificValue: 5700, sulfurContent: 0.75 },
    estimatedAmount: 56000000,
    channel: '直销',
    responsiblePerson: '孙七',
    status: 'executing',
    createdAt: '2023-12-20',
    createdBy: '李经理',
    approvalHistory: [
      { id: 'APR-019', approver: '王总', action: 'approve', opinion: '重点项目', timestamp: '2023-12-25 10:00:00' }
    ],
    executionRecords: [
      { id: 'EXE-019', date: '2024-03-01', completedVolume: 52000, completedAmount: 27800000, progress: 50, reporter: '孙七' }
    ]
  },
  {
    id: 'PLAN-020',
    name: '海外市场试水项目',
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    salesVolume: 45000,
    coalQuality: { calorificValue: 6200, sulfurContent: 0.5 },
    estimatedAmount: 27000000,
    channel: '分销',
    responsiblePerson: '张三',
    status: 'rejected',
    createdAt: '2024-02-15',
    createdBy: '张主管',
    approvalHistory: [
      { id: 'APR-020', approver: '王总', action: 'reject', opinion: '暂不具备条件，建议明年再议', timestamp: '2024-02-20 15:30:00' }
    ]
  }
];

export const salesPlanService = {
  getAll: (): SalesPlan[] => getFromStorage(STORAGE_KEYS.SALES_PLANS, SEED_PLANS),

  add: (plan: Omit<SalesPlan, 'id' | 'createdAt'>): SalesPlan => {
    const plans = salesPlanService.getAll();
    const newPlan: SalesPlan = {
      ...plan,
      id: `PLAN-${String(plans.length + 1).padStart(3, '0')}`,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    saveToStorage(STORAGE_KEYS.SALES_PLANS, [...plans, newPlan]);
    return newPlan;
  },

  update: (id: string, updates: Partial<SalesPlan>): void => {
    const plans = salesPlanService.getAll();
    const updated = plans.map(p => p.id === id ? { ...p, ...updates } : p);
    saveToStorage(STORAGE_KEYS.SALES_PLANS, updated);
  },

  approve: (id: string, record: Omit<ApprovalRecord, 'id' | 'timestamp'>): void => {
    const plans = salesPlanService.getAll();
    const updated = plans.map(p => {
      if (p.id === id) {
        const newRecord: ApprovalRecord = {
          ...record,
          id: `APR-${Date.now()}`,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        return {
          ...p,
          status: record.action === 'approve' ? 'approved' as const : 'rejected' as const,
          approvalHistory: [...(p.approvalHistory || []), newRecord]
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.SALES_PLANS, updated);
  },

  addExecutionRecord: (planId: string, record: Omit<ExecutionRecord, 'id'>): void => {
    const plans = salesPlanService.getAll();
    const updated = plans.map(p => {
      if (p.id === planId) {
        const newRecord: ExecutionRecord = { ...record, id: `EXE-${Date.now()}` };
        return {
          ...p,
          executionRecords: [...(p.executionRecords || []), newRecord]
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.SALES_PLANS, updated);
  },

  getStatistics: (startDate: string, endDate: string): SalesStatistics[] => {
    // Mock statistics
    const months = ['2024-01', '2024-02', '2024-03'];
    return months.map(m => ({
      period: m,
      planVolume: 15000 + Math.random() * 5000,
      actualVolume: 14000 + Math.random() * 4000,
      completionRate: 85 + Math.random() * 15,
      revenue: 7000000 + Math.random() * 2000000
    }));
  }
};

// 地磅房数据
const SEED_WEIGHBRIDGE: WeighbridgeRecord[] = Array.from({ length: 20 }, (_, i) => {
  const hours = i + 1;
  const random = Math.random();
  const plates = ['京A12345', '京B88888', '津C99999', '冀D77777', '晋E66666'];
  const vehicles = ['重卡', '中型货车', '大型货车'];
  
  const record: WeighbridgeRecord = {
    id: `WB-${String(i + 1).padStart(3, '0')}`,
    timestamp: dayjs().subtract(hours, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    plateNumber: plates[i % plates.length],
    vehicleType: vehicles[i % vehicles.length],
    grossWeight: 40 + Math.random() * 15,
    tareWeight: 12 + Math.random() * 5,
    netWeight: 25 + Math.random() * 10,
    videoUrl: `/videos/wb-${String(i + 1).padStart(3, '0')}.mp4`,
    planId: `PLAN-${String((i % 10) + 1).padStart(3, '0')}`
  };
  
  // 添加异常情况
  if (random > 0.85) {
    record.abnormal = {
      type: 'plate_mismatch',
      message: '车牌识别与系统登记不符'
    };
  } else if (random > 0.75) {
    record.abnormal = {
      type: 'weight_abnormal',
      message: '皮重与历史记录偏差过大'
    };
  }
  
  return record;
});

export const weighbridgeService = {
  getAll: (): WeighbridgeRecord[] => getFromStorage(STORAGE_KEYS.WEIGHBRIDGE, SEED_WEIGHBRIDGE),

  add: (record: Omit<WeighbridgeRecord, 'id'>): WeighbridgeRecord => {
    const records = weighbridgeService.getAll();
    const newRecord: WeighbridgeRecord = {
      ...record,
      id: `WB-${Date.now()}`
    };
    saveToStorage(STORAGE_KEYS.WEIGHBRIDGE, [...records, newRecord]);
    return newRecord;
  },

  checkAbnormal: (record: WeighbridgeRecord): WeighbridgeRecord => {
    // Mock abnormal check
    const random = Math.random();
    if (random > 0.9) {
      return {
        ...record,
        abnormal: {
          type: 'plate_mismatch',
          message: '车牌识别与系统登记不符'
        }
      };
    }
    if (random > 0.8) {
      return {
        ...record,
        abnormal: {
          type: 'weight_abnormal',
          message: '皮重与历史记录偏差过大'
        }
      };
    }
    return record;
  }
};

// ========== 3.2 存量管理 ==========
const SEED_SILOS: Silo[] = [
  {
    id: 'SILO-001',
    name: '1号筒仓',
    crossSectionalArea: 100,
    currentLevel: 8.5,
    capacity: 1000,
    currentVolume: 765,
    coalDensity: 0.9,
    highAlarm: 10,
    lowAlarm: 2,
    status: 'normal',
    lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'SILO-002',
    name: '2号筒仓',
    crossSectionalArea: 120,
    currentLevel: 1.8,
    capacity: 1200,
    currentVolume: 194.4,
    coalDensity: 0.9,
    highAlarm: 10,
    lowAlarm: 2,
    status: 'low_warning',
    lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'SILO-003',
    name: '3号筒仓',
    crossSectionalArea: 100,
    currentLevel: 10.2,
    capacity: 1000,
    currentVolume: 918,
    coalDensity: 0.9,
    highAlarm: 10,
    lowAlarm: 2,
    status: 'high_warning',
    lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
];

let currentSilos = [...SEED_SILOS];

export const siloService = {
  getAll: (): Silo[] => currentSilos,

  updateRealtime: (): Silo[] => {
    currentSilos = currentSilos.map(s => {
      const delta = (Math.random() - 0.5) * 0.3;
      const newLevel = Math.max(0, Math.min(s.highAlarm + 1, s.currentLevel + delta));
      const newVolume = newLevel * s.crossSectionalArea * s.coalDensity;
      
      let status: 'normal' | 'high_warning' | 'low_warning' = 'normal';
      if (newLevel >= s.highAlarm) status = 'high_warning';
      else if (newLevel <= s.lowAlarm) status = 'low_warning';

      return {
        ...s,
        currentLevel: parseFloat(newLevel.toFixed(2)),
        currentVolume: parseFloat(newVolume.toFixed(1)),
        status,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
    });
    return currentSilos;
  }
};

const SEED_TEMP_PILES: TemporaryCoalPile[] = Array.from({ length: 20 }, (_, i) => {
  const daysAgo = Math.floor(i / 2) + 1;
  const locations = ['北区堆场', '南区堆场', '东区堆场', '西区堆场'];
  const inspectors = ['王五', '赵六', '张三', '李四'];
  const daysUntilOut = i % 3 === 0 ? -2 : (i % 5 === 0 ? 1 : 5 + i % 10);
  
  const pile: TemporaryCoalPile = {
    id: `PILE-${String(i + 1).padStart(3, '0')}`,
    pileNumber: `${String.fromCharCode(65 + Math.floor(i / 5))}-${String((i % 5) + 1).padStart(2, '0')}`,
    location: locations[i % locations.length],
    inventoryDate: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD'),
    volume: 300 + Math.random() * 500,
    inspector: inspectors[i % inspectors.length],
    expectedInbound: i % 3 === 0 ? dayjs().subtract(daysAgo + 2, 'day').format('YYYY-MM-DD') : undefined,
    expectedOutbound: dayjs().add(daysUntilOut, 'day').format('YYYY-MM-DD'),
    remark: i % 7 === 0 ? '需要尽快出场' : undefined
  };
  
  if (daysUntilOut < 0) {
    pile.overdueWarning = true;
  }
  
  return pile;
});

export const tempPileService = {
  getAll: (): TemporaryCoalPile[] => getFromStorage(STORAGE_KEYS.TEMP_PILES, SEED_TEMP_PILES),

  add: (pile: Omit<TemporaryCoalPile, 'id'>): void => {
    const piles = tempPileService.getAll();
    const newPile: TemporaryCoalPile = { ...pile, id: `PILE-${Date.now()}` };
    
    // Check overdue
    if (pile.expectedOutbound && dayjs().isAfter(dayjs(pile.expectedOutbound))) {
      newPile.overdueWarning = true;
    }
    
    saveToStorage(STORAGE_KEYS.TEMP_PILES, [...piles, newPile]);
  },

  update: (id: string, updates: Partial<TemporaryCoalPile>): void => {
    const piles = tempPileService.getAll();
    const updated = piles.map(p => p.id === id ? { ...p, ...updates } : p);
    saveToStorage(STORAGE_KEYS.TEMP_PILES, updated);
  }
};

const SEED_LOSS: LossRecord[] = Array.from({ length: 20 }, (_, i) => {
  const categories = [
    { key: 'external_coal', name: '外协用煤' },
    { key: 'ash', name: '煤灰' },
    { key: 'fire_coal', name: '火煤' },
    { key: 'dirty_coal', name: '杂脏煤' },
    { key: 'natural_loss', name: '自然损耗' }
  ];
  const departments = ['生产部', '运输部', '储存部', '质检部'];
  const responsibles = ['李四', '王五', '赵六', '张三'];
  const reasons = [
    '协作单位借用',
    '生产正常排弃',
    '自燃损失',
    '风吹损耗',
    '运输过程损耗',
    '分检损耗',
    '雨水浸泡损失'
  ];
  
  const category = categories[i % categories.length];
  const daysAgo = Math.floor(i / 2);
  
  return {
    id: `LOSS-${String(i + 1).padStart(3, '0')}`,
    date: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD'),
    category: category.key,
    categoryName: category.name,
    volume: 20 + Math.random() * 80,
    department: departments[i % departments.length],
    responsible: responsibles[i % responsibles.length],
    reason: reasons[i % reasons.length]
  };
});

export const lossService = {
  getAll: (): LossRecord[] => getFromStorage(STORAGE_KEYS.LOSS_RECORDS, SEED_LOSS),

  add: (loss: Omit<LossRecord, 'id'>): void => {
    const records = lossService.getAll();
    const newRecord: LossRecord = { ...loss, id: `LOSS-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.LOSS_RECORDS, [...records, newRecord]);
  },

  getStatistics: (startDate: string, endDate: string): Record<string, number> => {
    const records = lossService.getAll().filter(r => 
      dayjs(r.date).isAfter(dayjs(startDate)) && dayjs(r.date).isBefore(dayjs(endDate))
    );
    
    const stats: Record<string, number> = {};
    records.forEach(r => {
      stats[r.categoryName] = (stats[r.categoryName] || 0) + r.volume;
    });
    return stats;
  }
};

// ========== 3.3 产存销报表 ==========
export const reportService = {
  getProductionReport: (startDate: string, endDate: string): ProductionReport[] => {
    // Mock production data
    const days = dayjs(endDate).diff(dayjs(startDate), 'day');
    return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
      date: dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'),
      dailyOutput: 800 + Math.random() * 200,
      completionRate: 85 + Math.random() * 15
    }));
  },

  getBalanceSheet: (period: string): BalanceSheet => {
    const openingInventory = 5000 + Math.random() * 1000;
    const production = 20000 + Math.random() * 5000;
    const sales = 18000 + Math.random() * 4000;
    const loss = 500 + Math.random() * 200;
    const calculatedInventory = openingInventory + production - sales - loss;
    const closingInventory = calculatedInventory + (Math.random() - 0.5) * 100;

    return {
      period,
      openingInventory: parseFloat(openingInventory.toFixed(1)),
      production: parseFloat(production.toFixed(1)),
      sales: parseFloat(sales.toFixed(1)),
      loss: parseFloat(loss.toFixed(1)),
      closingInventory: parseFloat(closingInventory.toFixed(1)),
      calculatedInventory: parseFloat(calculatedInventory.toFixed(1)),
      variance: parseFloat((closingInventory - calculatedInventory).toFixed(1))
    };
  }
};

// ========== 3.4 销售反馈 ==========
export const dashboardService = {
  getDashboard: (): SalesDashboard => ({
    todaySales: 850 + Math.random() * 150,
    todayRevenue: 425000 + Math.random() * 75000,
    weekSales: 5800 + Math.random() * 800,
    weekRevenue: 2900000 + Math.random() * 400000,
    monthSales: 24500 + Math.random() * 2500,
    monthRevenue: 12250000 + Math.random() * 1250000,
    priceFluctuation: (Math.random() - 0.5) * 10,
    channelDistribution: {
      '直销': 45 + Math.random() * 10,
      '分销': 35 + Math.random() * 10,
      '线上': 20 + Math.random() * 5
    }
  })
};

const SEED_CUSTOMERS: Customer[] = Array.from({ length: 20 }, (_, i) => {
  const companies = [
    'XX电力公司', 'XX煤化工集团', 'XX建材公司', 'XX钢铁集团', 
    'XX热力公司', 'XX水泥公司', 'XX工业园区', 'XX能源集团',
    'XX省电力', 'XX市供暖公司'
  ];
  const contacts = ['张经理', '李总', '王主管', '赵部长', '刘总监'];
  
  const totalPurchase = 20000 + Math.random() * 80000;
  const totalAmount = totalPurchase * (480 + Math.random() * 80);
  
  return {
    id: `CUST-${String(i + 1).padStart(3, '0')}`,
    name: `${companies[i % companies.length]}${i > 9 ? i - 9 : ''}`,
    contact: contacts[i % contacts.length],
    phone: `138****${String(i + 1).padStart(4, '0')}`,
    totalPurchase: parseFloat(totalPurchase.toFixed(1)),
    totalAmount: parseFloat(totalAmount.toFixed(0)),
    purchaseHistory: Array.from({ length: Math.min(i + 1, 5) }, (_, j) => ({
      date: dayjs().subtract((j + 1) * 30, 'day').format('YYYY-MM-DD'),
      volume: 500 + Math.random() * 1500,
      amount: (500 + Math.random() * 1500) * 500
    }))
  };
});

export const customerService = {
  getAll: (): Customer[] => getFromStorage(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS),

  add: (customer: Omit<Customer, 'id'>): void => {
    const customers = customerService.getAll();
    const newCustomer: Customer = { ...customer, id: `CUST-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.CUSTOMERS, [...customers, newCustomer]);
  }
};

const SEED_FEEDBACKS: CustomerFeedback[] = Array.from({ length: 20 }, (_, i) => {
  const types: CustomerFeedback['type'][] = ['quality', 'service', 'delivery', 'price', 'other'];
  const statuses: CustomerFeedback['status'][] = ['pending', 'processing', 'resolved'];
  const contents = [
    '煤质较好,热值稳定',
    '交货及时，服务周到',
    '希望能提供更多优惠',
    '部分批次含灰量较高',
    '运输过程有损耗',
    '建议增加配送频次',
    '对产品和服务非常满意',
    '希望能签订长期合同',
    '价格合理，质量稳定',
    '建议优化装车流程'
  ];
  const responsibles = ['张三', '李四', '王五', '赵六'];
  
  const daysAgo = Math.floor(i / 2);
  const status = statuses[i % statuses.length];
  const hasProcessing = status !== 'pending';
  
  const feedback: CustomerFeedback = {
    id: `FB-${String(i + 1).padStart(3, '0')}`,
    customerName: `CUST-${String((i % 20) + 1).padStart(3, '0')}`,
    customerId: `CUST-${String((i % 20) + 1).padStart(3, '0')}`,
    feedbackDate: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD'),
    type: types[i % types.length],
    content: contents[i % contents.length],
    status,
    responsible: responsibles[i % responsibles.length]
  };
  
  if (hasProcessing) {
    feedback.processingHistory = [
      {
        id: `PH-${String(i + 1).padStart(3, '0')}`,
        processor: responsibles[i % responsibles.length],
        timestamp: dayjs().subtract(daysAgo - 1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        action: status === 'resolved' ? '已解决问题并反馈' : '正在处理中',
        result: status === 'resolved' ? '客户满意' : undefined
      }
    ];
  }
  
  return feedback;
});

export const feedbackService = {
  getAll: (): CustomerFeedback[] => getFromStorage(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS),

  add: (feedback: Omit<CustomerFeedback, 'id'>): void => {
    const feedbacks = feedbackService.getAll();
    const newFeedback: CustomerFeedback = { ...feedback, id: `FB-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.FEEDBACKS, [...feedbacks, newFeedback]);
  },

  updateStatus: (id: string, status: CustomerFeedback['status'], processing?: Omit<any, 'id'>): void => {
    const feedbacks = feedbackService.getAll();
    const updated = feedbacks.map(f => {
      if (f.id === id) {
        const newProcessing = processing ? {
          ...processing,
          id: `PH-${Date.now()}`,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
        } : undefined;
        return {
          ...f,
          status,
          processingHistory: newProcessing ? [...(f.processingHistory || []), newProcessing] : f.processingHistory
        };
      }
      return f;
    });
    saveToStorage(STORAGE_KEYS.FEEDBACKS, updated);
  }
};
