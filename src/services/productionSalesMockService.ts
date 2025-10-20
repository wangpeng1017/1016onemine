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
const SEED_WEIGHBRIDGE: WeighbridgeRecord[] = [
  {
    id: 'WB-001',
    timestamp: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    plateNumber: '京A12345',
    vehicleType: '重卡',
    grossWeight: 45.5,
    tareWeight: 15.0,
    netWeight: 30.5,
    videoUrl: '/videos/wb-001.mp4',
    planId: 'PLAN-001'
  }
];

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

const SEED_TEMP_PILES: TemporaryCoalPile[] = [
  {
    id: 'PILE-001',
    pileNumber: 'A-01',
    location: '北区堆场',
    inventoryDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    volume: 500,
    inspector: '王五',
    expectedOutbound: dayjs().add(3, 'day').format('YYYY-MM-DD')
  }
];

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

const SEED_LOSS: LossRecord[] = [
  {
    id: 'LOSS-001',
    date: dayjs().format('YYYY-MM-DD'),
    category: 'external_coal',
    categoryName: '外协用煤',
    volume: 50,
    department: '生产部',
    responsible: '李四',
    reason: '协作单位借用'
  }
];

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

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'XX电力公司',
    contact: '张经理',
    phone: '138****0001',
    totalPurchase: 50000,
    totalAmount: 25000000,
    purchaseHistory: [
      { date: '2024-01-15', volume: 1000, amount: 500000 }
    ]
  }
];

export const customerService = {
  getAll: (): Customer[] => getFromStorage(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS),

  add: (customer: Omit<Customer, 'id'>): void => {
    const customers = customerService.getAll();
    const newCustomer: Customer = { ...customer, id: `CUST-${Date.now()}` };
    saveToStorage(STORAGE_KEYS.CUSTOMERS, [...customers, newCustomer]);
  }
};

const SEED_FEEDBACKS: CustomerFeedback[] = [
  {
    id: 'FB-001',
    customerName: 'XX电力公司',
    customerId: 'CUST-001',
    feedbackDate: dayjs().format('YYYY-MM-DD'),
    type: 'quality',
    content: '煤质较好,热值稳定',
    status: 'resolved',
    responsible: '张三',
    processingHistory: [
      { id: 'PH-001', processor: '张三', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), action: '已记录并反馈', result: '客户满意' }
    ]
  }
];

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
