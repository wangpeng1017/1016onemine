import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ProjectInfo from './system-config/ProjectInfo';
import RegionManagement from './system-config/RegionManagement';
import AlarmSettings from './system-config/AlarmSettings';

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
  // 占位接口定义以避免类型报错（旧版字段保留但页面改为分模块）
  const [loading] = useState(false);

  // 默认配置数据（保留类型以便后续扩展）
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

  // 旧的单页表单改为分模块Tabs
  return (
    <div>
      <div className="page-title">系统配置</div>
      <Card className="custom-card">
        <Tabs
          defaultActiveKey="project"
          items={[
            {
              key: 'project',
              label: '项目信息',
              children: <ProjectInfo />,
            },
            {
              key: 'regions',
              label: '区域管理',
              children: <RegionManagement />,
            },
            {
              key: 'alarms',
              label: '告警设置',
              children: <AlarmSettings />,
            },
          ]}
        />
      </Card>
    </div>
  );
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
