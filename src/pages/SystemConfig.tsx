import React from 'react';
import { Navigate } from 'react-router-dom';

// 该页面已下线，统一重定向到“项目信息”子页面。
// 保留文件仅用于兼容历史链接。

interface SystemConfigData {
  // 系统基础配置
  systemName: string;
  systemVersion: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  
  // 监测配置
  dataCollectionInterval: number;
  alarmCheckInterval: number;
  dataRetentionDays: number;
  autoBackup: boolean;
  backupTime: dayjs.Dayjs;
  
  // 告警配置
  enableEmailAlert: boolean;
  enableSmsAlert: boolean;
  alertLevel: 'low' | 'medium' | 'high';
  maxAlertCount: number;
  
  // 性能配置
  maxConcurrentUsers: number;
  sessionTimeout: number;
  enableCache: boolean;
  cacheExpireTime: number;
  
  // 安全配置
  passwordMinLength: number;
  passwordComplexity: boolean;
  loginAttemptLimit: number;
  accountLockTime: number;
}

const SystemConfig: React.FC = () => {
  return <Navigate to="/system-config/project-info" replace />;

  // 以下字段仅为保留类型声明，避免历史引用时报错
  const defaultConfig: SystemConfigData = {
    systemName: '矿山安全监测系统',
    systemVersion: 'v2.1.0',
    companyName: '矿山安全科技有限公司',
    contactEmail: 'support@mining-safety.com',
    contactPhone: '400-123-4567',
    
    dataCollectionInterval: 60,
    alarmCheckInterval: 30,
    dataRetentionDays: 365,
    autoBackup: true,
    backupTime: dayjs('02:00', 'HH:mm'),
    
    enableEmailAlert: true,
    enableSmsAlert: false,
    alertLevel: 'medium',
    maxAlertCount: 100,
    
    maxConcurrentUsers: 50,
    sessionTimeout: 30,
    enableCache: true,
    cacheExpireTime: 3600,
    
    passwordMinLength: 8,
    passwordComplexity: true,
    loginAttemptLimit: 5,
    accountLockTime: 30,
  };

  // 原先的 Tabs 界面已移除
              onClick={handleSave}
            >
              保存配置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置为默认
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default SystemConfig;
