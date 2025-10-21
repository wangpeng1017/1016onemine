import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Badge, Tabs, Space } from 'antd';
import { SafetyOutlined, AlertOutlined, FileProtectOutlined, AuditOutlined, ToolOutlined, TeamOutlined, MedicineBoxOutlined, MonitorOutlined, DollarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import StandardArchive from './StandardArchive';
import DualPreventionMechanism from './DualPreventionMechanism';
import SafetyStandardization from './SafetyStandardization';

const SafetyManagementCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    {
      key: 'overview',
      label: <span><SafetyOutlined /> 安全总览</span>,
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日告警"
                  value={12}
                  prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
                  suffix="条"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="待处理隐患"
                  value={8}
                  prefix={<AlertOutlined style={{ color: '#faad14' }} />}
                  suffix="项"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="风险点数量"
                  value={45}
                  prefix={<FileProtectOutlined />}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="标准化得分"
                  value={92.5}
                  prefix={<AuditOutlined />}
                  suffix="分"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="风险等级分布" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Badge color="red" /> 重大风险</span>
                    <span>3个</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Badge color="orange" /> 较大风险</span>
                    <span>12个</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Badge color="yellow" /> 一般风险</span>
                    <span>18个</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Badge color="blue" /> 低风险</span>
                    <span>12个</span>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="隐患整改情况" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>本月发现隐患</span>
                    <span>28项</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>已整改</span>
                    <span style={{ color: '#52c41a' }}>20项</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>整改中</span>
                    <span style={{ color: '#faad14' }}>6项</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>逾期未改</span>
                    <span style={{ color: '#ff4d4f' }}>2项</span>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="特殊作业统计" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>今日作业票</span>
                    <span>15张</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>执行中</span>
                    <span style={{ color: '#1890ff' }}>8张</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>待审批</span>
                    <span style={{ color: '#faad14' }}>3张</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>已完成</span>
                    <span style={{ color: '#52c41a' }}>4张</span>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'standard-archive',
      label: <span><FileProtectOutlined /> 标准规范档案库</span>,
      children: <StandardArchive />
    },
    {
      key: 'standardization',
      label: <span><AuditOutlined /> 安全生产标准化</span>,
      children: <SafetyStandardization />
    },
    {
      key: 'dual-prevention',
      label: <span><AlertOutlined /> 双重预防机制</span>,
      children: <DualPreventionMechanism />
    },
    {
      key: 'work-permit',
      label: <span><ToolOutlined /> 作业票证管理</span>,
      children: <Card>作业票证管理功能开发中...</Card>
    },
    {
      key: 'training',
      label: <span><TeamOutlined /> 安全培训</span>,
      children: <Card>安全培训功能开发中...</Card>
    },
    {
      key: 'health',
      label: <span><MedicineBoxOutlined /> 职业健康</span>,
      children: <Card>职业健康功能开发中...</Card>
    },
    {
      key: 'monitoring',
      label: <span><MonitorOutlined /> 监测监控</span>,
      children: <Card>监测监控功能开发中...</Card>
    },
    {
      key: 'expense',
      label: <span><DollarOutlined /> 安全费用管理</span>,
      children: <Card>安全费用管理功能开发中...</Card>
    },
    {
      key: 'emergency',
      label: <span><ThunderboltOutlined /> 应急管理</span>,
      children: <Card>应急管理功能开发中...</Card>
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={
          <Space>
            <SafetyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <span style={{ fontSize: 20 }}>智慧安全保障管理中心</span>
          </Space>
        }
        bordered={false}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabPosition="left"
          style={{ minHeight: 600 }}
        />
      </Card>
    </div>
  );
};

export default SafetyManagementCenter;
