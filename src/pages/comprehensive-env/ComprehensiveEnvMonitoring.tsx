import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import {
  FileTextOutlined,
  DashboardOutlined,
  CloudOutlined,
  ExperimentOutlined,
  ToolOutlined,
  WarningOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import LegalCompliancePage from './LegalCompliancePage';
import WaterManagementPage from './WaterManagementPage';
import AirNoisePage from './AirNoisePage';
import SoilWasteEcologyPage from './SoilWasteEcologyPage';
import ConstructionUnitsPage from './ConstructionUnitsPage';
import EmergencyManagementPage from './EmergencyManagementPage';
import GreenMinePage from './GreenMinePage';

const ComprehensiveEnvMonitoring: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title="综合环境监测管理">
        <Tabs
          defaultActiveKey="legal"
          tabPosition="left"
          style={{ minHeight: 600 }}
          items={[
            {
              key: 'legal',
              label: (
                <span>
                  <FileTextOutlined />
                  合法合规
                </span>
              ),
              children: <LegalCompliancePage />
            },
            {
              key: 'water',
              label: (
                <span>
                  <DashboardOutlined />
                  水务管理
                </span>
              ),
              children: <WaterManagementPage />
            },
            {
              key: 'air-noise',
              label: (
                <span>
                  <CloudOutlined />
                  大气噪声
                </span>
              ),
              children: <AirNoisePage />
            },
            {
              key: 'soil-waste',
              label: (
                <span>
                  <ExperimentOutlined />
                  土壤固废生态
                </span>
              ),
              children: <SoilWasteEcologyPage />
            },
            {
              key: 'construction',
              label: (
                <span>
                  <ToolOutlined />
                  施工单位
                </span>
              ),
              children: <ConstructionUnitsPage />
            },
            {
              key: 'emergency',
              label: (
                <span>
                  <WarningOutlined />
                  环保应急
                </span>
              ),
              children: <EmergencyManagementPage />
            },
            {
              key: 'green-mine',
              label: (
                <span>
                  <TrophyOutlined />
                  绿色矿山
                </span>
              ),
              children: <GreenMinePage />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default ComprehensiveEnvMonitoring;
