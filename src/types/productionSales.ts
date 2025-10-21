// 智慧产运销管理中心类型定义

// ========== 3.1 销售计划 ==========
export interface SalesPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  salesVolume: number; // 吨
  coalQuality?: {
    calorificValue?: number; // 热值
    sulfurContent?: number; // 硫分
    [key: string]: any;
  };
  estimatedAmount?: number; // 预估销售金额(元)
  channel: string; // 销售渠道
  responsiblePerson: string;
  remark?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'executing' | 'completed';
  createdAt: string;
  createdBy: string;
  approvalHistory?: ApprovalRecord[];
  executionRecords?: ExecutionRecord[];
  summary?: PlanSummary;
}

export interface ApprovalRecord {
  id: string;
  approver: string;
  action: 'approve' | 'reject';
  opinion: string;
  timestamp: string;
}

export interface ExecutionRecord {
  id: string;
  date: string;
  completedVolume: number; // 当前完成煤量
  completedAmount: number; // 完成金额
  progress: number; // 完成百分比
  coordination?: string; // 需协调事项
  reporter: string;
}

export interface PlanSummary {
  finalVolume: number;
  finalAmount: number;
  completionRate: number;
  problemAnalysis: string;
  improvements: string;
  completedAt: string;
}

// 地磅房数据
export interface WeighbridgeRecord {
  id: string;
  timestamp: string;
  plateNumber: string;
  vehicleType?: string;
  grossWeight: number; // 毛重(吨)
  tareWeight: number; // 皮重(吨)
  netWeight: number; // 净重(吨)
  videoUrl?: string; // 监控视频地址
  planId?: string; // 关联销售计划
  abnormal?: {
    type: 'plate_mismatch' | 'weight_abnormal';
    message: string;
  };
}

// ========== 3.2 存量管理 ==========
// 筒仓数据
export interface Silo {
  id: string;
  name: string;
  crossSectionalArea: number; // 截面积(m²)
  currentLevel: number; // 当前料位高度(m)
  capacity: number; // 总容量(吨)
  currentVolume: number; // 当前存煤量(吨)
  coalDensity: number; // 煤炭密度(吨/m³)
  highAlarm: number; // 高位预警线(m)
  lowAlarm: number; // 低位预警线(m)
  status: 'normal' | 'high_warning' | 'low_warning';
  lastUpdate: string;
}

// 临时堆煤
export interface TemporaryCoalPile {
  id: string;
  pileNumber: string; // 煤堆编号
  location: string;
  inventoryDate: string; // 盘点日期
  volume: number; // 盘点数量(吨)
  inspector: string; // 盘点人
  remark?: string;
  expectedInbound?: string; // 预计进场时间
  expectedOutbound?: string; // 预计出场时间
  overdueWarning?: boolean;
}

// 损耗记录
export interface LossRecord {
  id: string;
  date: string;
  category: 'external_coal' | 'production_waste' | 'natural_loss';
  categoryName: string;
  volume: number; // 损耗量(吨)
  department: string;
  responsible: string;
  reason: string;
}

// ========== 3.3 产存销报表 ==========
// 产量报表
export interface ProductionReport {
  date: string; // 日期
  dailyOutput: number; // 日产量(吨)
  weeklyOutput?: number; // 周产量
  monthlyOutput?: number; // 月产量
  completionRate?: number; // 完成率(%)
  qualityDistribution?: Record<string, number>; // 不同煤质产量分布
}

// 产存销平衡表
export interface BalanceSheet {
  period: string; // 时期(如: 2024-01)
  openingInventory: number; // 期初库存(吨)
  production: number; // 本期产量(吨)
  sales: number; // 本期销量(吨)
  loss: number; // 本期损耗(吨)
  closingInventory: number; // 期末库存(吨)
  calculatedInventory: number; // 计算库存(期初+产-销-损)
  variance: number; // 差异(吨)
}

// ========== 3.4 销售反馈 ==========
// 销售数据看板指标
export interface SalesDashboard {
  todaySales: number; // 今日销售量(吨)
  todayRevenue: number; // 今日销售额(元)
  weekSales: number;
  weekRevenue: number;
  monthSales: number;
  monthRevenue: number;
  priceFluctuation: number; // 价格波动(%)
  channelDistribution: Record<string, number>; // 各渠道销售占比
}

// 客户信息
export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  address?: string;
  purchaseHistory?: CustomerPurchase[];
  totalPurchase: number; // 累计购买量(吨)
  totalAmount: number; // 累计金额(元)
}

export interface CustomerPurchase {
  date: string;
  volume: number;
  amount: number;
  coalType?: string;
}

// 客户反馈
export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  feedbackDate: string;
  type: 'quality' | 'service' | 'delivery' | 'price' | 'other';
  content: string;
  status: 'pending' | 'processing' | 'resolved';
  responsible?: string;
  processingHistory?: FeedbackProcessing[];
}

export interface FeedbackProcessing {
  id: string;
  processor: string;
  timestamp: string;
  action: string;
  result?: string;
}

// ========== 统计分析 ==========
export interface SalesStatistics {
  period: string;
  planVolume: number; // 计划销量
  actualVolume: number; // 实际销量
  completionRate: number; // 完成率
  revenue: number; // 销售额
}
