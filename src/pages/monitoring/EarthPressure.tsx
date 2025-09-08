import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  DatePicker,
  Select,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  message,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface EarthPressureData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  pressure: number;
  depth: number;
  temperature: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const EarthPressure: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarthPressureData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 模拟土压力数据
  const mockData: EarthPressureData[] = [
    {
      id: '1',
      deviceId: 'EP-001',
      deviceName: '土压力计1号',
      location: 'A区深度5m',
      pressure: 125.6,
      depth: 5.0,
      temperature: 18.5,
      batteryLevel: 88,
      status: 'normal',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '2',
      deviceId: 'EP-002',
      deviceName: '土压力计2号',
      location: 'B区深度8m',
      pressure: 285.3,
      depth: 8.0,
      temperature: 16.2,
      batteryLevel: 76,
      status: 'warning',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '3',
      deviceId: 'EP-003',
      deviceName: '土压力计3号',
      location: 'C区深度12m',
      pressure: 456.8,
      depth: 12.0,
      temperature: 14.8,
      batteryLevel: 52,
      status: 'alarm',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '4',
      deviceId: 'EP-004',
      deviceName: '土压力计4号',
      location: 'D区深度3m',
      pressure: 98.2,
      depth: 3.0,
      temperature: 19.1,
      batteryLevel: 92,
      status: 'normal',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '5',
      deviceId: 'EP-005',
      deviceName: '土压力计5号',
      location: 'E区深度15m',
      pressure: 612.4,
      depth: 15.0,
      temperature: 13.5,
      batteryLevel: 38,
      status: 'alarm',
      timestamp: '2025-09-06 16:00:00',
    },
  ];

  const columns: ColumnsType<EarthPressureData> = [
    {
      title: '设备编号',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 100,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 120,
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '土压力 (kPa)',
      dataIndex: 'pressure',
      key: 'pressure',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value > 400 ? '#ff4d4f' : value > 200 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '埋设深度 (m)',
      dataIndex: 'depth',
      key: 'depth',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '温度 (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 100,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '电池电量 (%)',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value < 20 ? '#ff4d4f' : value < 50 ? '#faad14' : '#52c41a' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusConfig = {
          normal: { color: 'green', text: '正常' },
          warning: { color: 'orange', text: '预警' },
          alarm: { color: 'red', text: '告警' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    message.success('数据导出功能开发中...');
  };

  const handleViewChart = () => {
    const chartData = filteredData.map(item => ({
      name: item.deviceName,
      pressure: item.pressure,
      depth: item.depth,
      temperature: item.temperature
    }));
    
    console.log('土压力图表数据:', chartData);
    message.success(`已生成${chartData.length}个设备的图表数据，请查看控制台`);
  };

  const filteredData = data.filter(item => {
    if (selectedDevice !== 'all' && item.deviceId !== selectedDevice) {
      return false;
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.timestamp);
      return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
    }
    return true;
  });

  const statistics = {
    total: filteredData.length,
    normal: filteredData.filter(item => item.status === 'normal').length,
    warning: filteredData.filter(item => item.status === 'warning').length,
    alarm: filteredData.filter(item => item.status === 'alarm').length,
  };

  return (
    <div>
      <div className="page-title">土压力监测</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常状态"
              value={statistics.normal}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预警状态"
              value={statistics.warning}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="告警状态"
              value={statistics.alarm}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择设备"
              value={selectedDevice}
              onChange={setSelectedDevice}
            >
              <Option value="all">全部设备</Option>
              {mockData.map(item => (
                <Option key={item.deviceId} value={item.deviceId}>{item.deviceName}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={dateRange}
              onChange={setDateRange}
              placeholder={['开始时间', '结束时间']}
            />
          </Col>
          <Col span={10}>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新数据
              </Button>
              <Button
                icon={<LineChartOutlined />}
                onClick={handleViewChart}
              >
                查看图表
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default EarthPressure;
