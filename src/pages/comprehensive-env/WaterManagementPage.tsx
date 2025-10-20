import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, Statistic, Tag, Table, Space } from 'antd';
import { DashboardOutlined, SettingOutlined, DatabaseOutlined, WarningOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import GaugeCard from '../../components/environmental/GaugeCard';
import ThresholdForm from '../../components/environmental/ThresholdForm';
import AlertTicker from '../../components/environmental/AlertTicker';
import DocumentManager from '../../components/environmental/DocumentManager';
import {
  waterDeviceService,
  waterMetricService,
  thresholdService,
  alertService,
  waterReportService,
  documentService
} from '../../services/environmentalMockService';
import type { DeviceStatus, WaterMetric, ThresholdConfig, Alert, Document } from '../../types/environmental';

const WaterManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [metrics, setMetrics] = useState<WaterMetric[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; pressure: number; level: number; flow: number }[]>([]);

  useEffect(() => {
    setDevices(waterDeviceService.getAll());
    setMetrics(waterMetricService.getAll());
    setThresholds(thresholdService.getAll());
    setAlerts(alertService.getAll());
    setDocuments(documentService.getAll().filter(d => d.type === 'water_quality'));

    // Generate initial historical data
    const now = new Date();
    const initial = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (19 - i) * 3000).toLocaleTimeString(),
      pressure: 2.4 + Math.random() * 0.4,
      level: 3.6 + Math.random() * 0.4,
      flow: 115 + Math.random() * 10
    }));
    setHistoricalData(initial);

    // Realtime update interval
    const interval = setInterval(() => {
      const updated = waterMetricService.updateRealtime();
      setMetrics(updated);

      // Check thresholds and add alerts
      updated.forEach(m => {
        if (m.status !== 'normal') {
          alertService.add({
            timestamp: m.timestamp,
            location: m.location,
            type: 'water',
            level: m.status === 'alarm' ? 'alarm' : 'warning',
            message: `${m.type === 'pressure' ? '压力' : m.type === 'level' ? '液位' : '流量'}${m.status === 'alarm' ? '报警' : '预警'}: ${m.value} ${m.unit}`,
            acknowledged: false
          });
        }
      });
      setAlerts(alertService.getAll());

      // Update historical data
      setHistoricalData(prev => {
        const newData = {
          timestamp: new Date().toLocaleTimeString(),
          pressure: updated.find(m => m.type === 'pressure')?.value || 0,
          level: updated.find(m => m.type === 'level')?.value || 0,
          flow: updated.find(m => m.type === 'flow')?.value || 0
        };
        return [...prev.slice(1), newData];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const deviceColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '设备名称', dataIndex: 'name', key: 'name', width: 150 },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: DeviceStatus['type']) => {
        const labels = { pump: '水泵', valve: '阀门', sensor: '传感器' };
        return labels[type];
      }
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: DeviceStatus['status']) => {
        const config = {
          running: { color: 'success', text: '运行中' },
          stopped: { color: 'default', text: '已停止' },
          fault: { color: 'error', text: '故障' }
        };
        const item = config[status];
        return <Tag color={item.color}>{item.text}</Tag>;
      }
    },
    { title: '最后更新', dataIndex: 'lastUpdate', key: 'lastUpdate', width: 180 }
  ];

  const lineChartOption = {
    title: { text: '实时监测数据', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['管道压力', '水池液位', '流量'], bottom: 10 },
    xAxis: { type: 'category', data: historicalData.map(d => d.timestamp), axisLabel: { rotate: 45, fontSize: 10 } },
    yAxis: [
      { type: 'value', name: '压力/液位', position: 'left' },
      { type: 'value', name: '流量 (m³/h)', position: 'right' }
    ],
    series: [
      { name: '管道压力', type: 'line', data: historicalData.map(d => d.pressure.toFixed(2)), smooth: true, itemStyle: { color: '#1890ff' } },
      { name: '水池液位', type: 'line', data: historicalData.map(d => d.level.toFixed(2)), smooth: true, itemStyle: { color: '#52c41a' } },
      { name: '流量', type: 'line', yAxisIndex: 1, data: historicalData.map(d => d.flow.toFixed(0)), smooth: true, itemStyle: { color: '#faad14' } }
    ],
    grid: { left: '10%', right: '10%', bottom: '20%', top: '15%' }
  };

  const handleThresholdUpdate = (id: string, updates: Partial<ThresholdConfig>) => {
    thresholdService.update(id, updates);
    setThresholds(thresholdService.getAll());
  };

  const handleAcknowledgeAlert = (id: string) => {
    alertService.acknowledge(id);
    setAlerts(alertService.getAll());
  };

  const handleAddDocument = (doc: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDoc = documentService.add({ ...doc, type: 'water_quality' });
    setDocuments(documentService.getAll().filter(d => d.type === 'water_quality'));
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        defaultActiveKey="dashboard"
        items={[
          {
            key: 'dashboard',
            label: <span><DashboardOutlined /> 实时监控</span>,
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <GaugeCard
                      title="管道压力"
                      value={metrics.find(m => m.type === 'pressure')?.value || 0}
                      max={4}
                      unit="MPa"
                    />
                  </Col>
                  <Col span={8}>
                    <GaugeCard
                      title="水池液位"
                      value={metrics.find(m => m.type === 'level')?.value || 0}
                      max={5}
                      unit="m"
                    />
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="今日累计流量"
                        value={2850}
                        suffix="m³"
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <Statistic
                        title="本月累计流量"
                        value={85600}
                        suffix="m³"
                        style={{ marginTop: 16 }}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card title="设备运行状态">
                  <Table
                    columns={deviceColumns}
                    dataSource={devices}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>

                <Card>
                  <ReactECharts option={lineChartOption} style={{ height: 350 }} />
                </Card>

                <AlertTicker alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
              </Space>
            )
          },
          {
            key: 'thresholds',
            label: <span><SettingOutlined /> 阈值设置</span>,
            children: (
              <Card title="预警阈值配置">
                <ThresholdForm thresholds={thresholds} onUpdate={handleThresholdUpdate} />
              </Card>
            )
          },
          {
            key: 'reports',
            label: <span><DatabaseOutlined /> 检测报告归档</span>,
            children: (
              <Card title="水质检测报告">
                <DocumentManager
                  documents={documents}
                  onAdd={handleAddDocument}
                  onDelete={(id) => {
                    documentService.delete(id);
                    setDocuments(documentService.getAll().filter(d => d.type === 'water_quality'));
                  }}
                  allowedTypes={['water_quality']}
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default WaterManagementPage;
