// 综合环境监测类型定义

// 文档类型 (5.1 合法合规)
export interface Document {
  id: string;
  name: string;
  type: 'approval' | 'acceptance' | 'water_quality' | 'soil' | 'solid_waste' | 'ecology';
  uploadDate: string;
  fileSize: string;
  version: string;
  tags: string[];
  relatedProject?: string;
  approvalDate?: string;
  fileUrl?: string;
  metadata?: Record<string, any>;
}

// 设备运行状态 (5.2 水务管理)
export interface DeviceStatus {
  id: string;
  name: string;
  type: 'pump' | 'valve' | 'sensor';
  status: 'running' | 'stopped' | 'fault';
  lastUpdate: string;
}

// 管道压力/水池液位 (5.2 水务管理)
export interface WaterMetric {
  id: string;
  location: string;
  type: 'pressure' | 'level' | 'flow';
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'alarm';
}

// 预警阈值 (5.2 水务管理)
export interface ThresholdConfig {
  id: string;
  metric: string;
  minValue?: number;
  maxValue?: number;
  warningThreshold?: number;
  alarmThreshold?: number;
  enabled: boolean;
}

// 实时警报 (5.2 水务管理)
export interface Alert {
  id: string;
  timestamp: string;
  location: string;
  type: 'water' | 'air' | 'noise';
  level: 'warning' | 'alarm';
  message: string;
  acknowledged: boolean;
}

// 水质检测报告 (5.2 水务管理)
export interface WaterQualityReport {
  id: string;
  date: string;
  sampleLocation: string;
  pH?: number;
  COD?: number;
  ammoniaNitrogen?: number;
  documentId?: string;
}

// 监测站数据 (5.3 大气、噪声)
export interface MonitorStation {
  id: string;
  name: string;
  location: [number, number];
  type: 'air' | 'noise';
  status: 'normal' | 'warning' | 'alarm';
}

// 大气质量数据 (5.3)
export interface AirQualityData {
  stationId: string;
  timestamp: string;
  PM25: number;
  PM10: number;
  status: 'normal' | 'warning' | 'alarm';
}

// 噪声数据 (5.3)
export interface NoiseData {
  stationId: string;
  timestamp: string;
  level: number; // dB
  status: 'normal' | 'warning' | 'alarm';
}

// 历史数据查询结果 (5.3)
export interface HistoricalData {
  timestamp: string;
  value: number;
  [key: string]: any;
}

// 检测报告基础类型 (5.4)
export interface DetectionReport {
  id: string;
  type: 'soil' | 'solid_waste' | 'ecology';
  date: string;
  organization: string;
  summary?: Record<string, any>;
  documentId?: string;
}

// 施工单位 (5.5)
export interface ConstructionUnit {
  id: string;
  name: string;
}

// 设备台账 (5.5)
export interface Equipment {
  id: string;
  name: string;
  type: 'main' | 'auxiliary';
  environmentalCompliant: boolean;
  description?: string;
}

// 作业日志 (5.5)
export interface WorkLog {
  id: string;
  date: string;
  constructionUnit: string;
  workArea: string;
  mainEquipment: string[];
  auxiliaryEquipment: string[];
  complianceIssues: string[];
}

// 应急预案 (5.6)
export interface EmergencyPlan {
  id: string;
  name: string;
  scenario: string;
  executingDept: string;
  supportingDepts: string[];
  procedure: string;
  exceptionHandling: string;
  status: 'draft' | 'under_review' | 'approved' | 'published';
  publishDate?: string;
  version: string;
}

// 演练记录 (5.6)
export interface DrillRecord {
  id: string;
  planId: string;
  date: string;
  participatingDepts: string[];
  evaluation: string;
  materialsAllocation: string;
}

// 绿色矿山评价指标 (5.7)
export interface GreenMineIndicator {
  id: string;
  category: string;
  name: string;
  description: string;
  weight: number;
  children?: GreenMineIndicator[];
  selfEvaluation?: {
    score?: number;
    compliant?: boolean;
    notes?: string;
  };
}

// 绿色矿山实施方案 (5.7)
export interface GreenMinePlan {
  id: string;
  year: number;
  documentId: string;
  implementationProgress: number;
}

// 政府核查记录 (5.7)
export interface GovernmentAudit {
  id: string;
  date: string;
  department: string;
  result: string;
  improvementMeasures: string;
}

// 考核统计 (5.7)
export interface AssessmentStats {
  date: string;
  overallScore: number;
  categoryScores: Record<string, number>;
}
