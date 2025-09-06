import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
} from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { ColumnsType } from 'antd/es/table';
const { RangePicker } = DatePicker;
const { Option } = Select;

interface MonitoringRecord {
  key: string;
  time: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

const MonitoringData: React.FC = () => {
  const [activeTab, setActiveTab] = useState('radar');
  const [loading, setLoading] = useState(false);

  // 生成模拟图表数据
  const generateChartData = (type: string) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const data = hours.map(() => Math.random() * 100 + 50);
    
    return {
      title: {
        text: getChartTitle(type),
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: hours,
      },
      yAxis: {
        type: 'value',
        name: getYAxisName(type),
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
              ],
            },
          },
        },
      ],
    };
  };

  const getChartTitle = (type: string) => {
    const titles = {
      radar: '雷达位移监测数据',
      pressure: '土压力监测数据',
      crack: '裂缝计监测数据',
      water: '地下水位监测数据',
      rainfall: '雨量计监测数据',
      vibration: '爆破振动监测数据',
    };
    return titles[type as keyof typeof titles] || '监测数据';
  };

  const getYAxisName = (type: string) => {
    const names = {
      radar: '位移(mm)',
      pressure: '压力(kPa)',
      crack: '裂缝宽度(mm)',
      water: '水位(m)',
      rainfall: '降雨量(mm)',
      vibration: '振动速度(mm/s)',
    };
    return names[type as keyof typeof names] || '数值';
  };

  // 生成表格数据
  const generateTableData = (type: string): MonitoringRecord[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      key: i.toString(),
      time: `2024-01-15 ${(14 + i).toString().padStart(2, '0')}:${(i * 5).toString().padStart(2, '0')}:00`,
      value: Math.random() * 100 + 50,
      unit: getYAxisName(type).match(/\((.+)\)/)?.[1] || '',
      status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.9 ? 'danger' : 'normal',
    }));
  };

  const columns: ColumnsType<MonitoringRecord> = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          normal: { color: '#52c41a', text: '正常' },
          warning: { color: '#faad14', text: '预警' },
          danger: { color: '#ff4d4f', text: '危险' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <span style={{ color: config.color }}>{config.text}</span>;
      },
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const tabItems = [
    { key: 'radar', label: '雷达数据' },
    { key: 'pressure', label: '土压力数据' },
    { key: 'crack', label: '裂缝计数据' },
    { key: 'water', label: '地下水数据' },
    { key: 'rainfall', label: '雨量计数据' },
    { key: 'vibration', label: '爆破振动数据' },
  ];

  return (
    <div>
      <div className="page-title">监测数据</div>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={24}
              suffix="/ 28"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常状态"
              value={20}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预警状态"
              value={3}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="危险状态"
              value={1}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select placeholder="选择设备" style={{ width: '100%' }}>
              <Option value="device1">雷达-01</Option>
              <Option value="device2">雷达-02</Option>
              <Option value="device3">传感器-01</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary">查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
              <Button icon={<DownloadOutlined />}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据展示 */}
      <Card className="custom-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: item.label,
            children: (
              <Row gutter={16}>
                <Col span={16}>
                  <div className="chart-container">
                    <ReactECharts
                      option={generateChartData(item.key)}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <Table
                    columns={columns}
                    dataSource={generateTableData(item.key)}
                    pagination={false}
                    size="small"
                    scroll={{ y: 350 }}
                    loading={loading}
                  />
                </Col>
              </Row>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default MonitoringData;
