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

interface RadarData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  displacement: number;
  velocity: number;
  acceleration: number;
  distance: number;
  angle: number;
  signalStrength: number;
  temperature: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const Radar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RadarData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 模拟雷达数据
  const mockData: RadarData[] = [
    {
      id: '1',
      deviceId: 'RD-001',
      deviceName: '雷达监测仪1号',
      location: 'A区边坡',
      displacement: 3.2,
      velocity: 0.8,
      acceleration: 0.15,
      distance: 125.6,
      angle: 45.2,
      signalStrength: -65.8,
      temperature: 28.5,
      batteryLevel: 88,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '2',
      deviceId: 'RD-002',
      deviceName: '雷达监测仪2号',
      location: 'B区高边坡',
      displacement: 8.5,
      velocity: 2.1,
      acceleration: 0.45,
      distance: 89.3,
      angle: 52.7,
      signalStrength: -72.3,
      temperature: 26.8,
      batteryLevel: 72,
      status: 'warning',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '3',
      deviceId: 'RD-003',
      deviceName: '雷达监测仪3号',
      location: 'C区危险区域',
      displacement: 15.8,
      velocity: 4.2,
      acceleration: 0.85,
      distance: 67.9,
      angle: 38.5,
      signalStrength: -78.9,
      temperature: 31.2,
      batteryLevel: 45,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '4',
      deviceId: 'RD-004',
      deviceName: '雷达监测仪4号',
      location: 'D区稳定区',
      displacement: 1.5,
      velocity: 0.3,
      acceleration: 0.08,
      distance: 156.8,
      angle: 42.1,
      signalStrength: -62.5,
      temperature: 27.3,
      batteryLevel: 91,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '5',
      deviceId: 'RD-005',
      deviceName: '雷达监测仪5号',
      location: 'E区监测点',
      displacement: 12.3,
      velocity: 3.1,
      acceleration: 0.62,
      distance: 78.4,
      angle: 48.9,
      signalStrength: -75.6,
      temperature: 29.7,
      batteryLevel: 38,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
  ];

  const columns: ColumnsType<RadarData> = [
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
      width: 130,
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '位移 (mm)',
      dataIndex: 'displacement',
      key: 'displacement',
      width: 100,
      render: (value: number) => (
        <span style={{ 
          color: value > 10 ? '#ff4d4f' : value > 5 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '速度 (mm/h)',
      dataIndex: 'velocity',
      key: 'velocity',
      width: 110,
      render: (value: number) => (
        <span style={{ 
          color: value > 3 ? '#ff4d4f' : value > 1.5 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '加速度 (mm/h²)',
      dataIndex: 'acceleration',
      key: 'acceleration',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value > 0.5 ? '#ff4d4f' : value > 0.3 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: '距离 (m)',
      dataIndex: 'distance',
      key: 'distance',
      width: 100,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '角度 (°)',
      dataIndex: 'angle',
      key: 'angle',
      width: 100,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '信号强度 (dBm)',
      dataIndex: 'signalStrength',
      key: 'signalStrength',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: value < -80 ? '#ff4d4f' : value < -70 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
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
      displacement: item.displacement,
      velocity: item.velocity,
      acceleration: item.acceleration,
      signalStrength: item.signalStrength
    }));
    
    console.log('雷达图表数据:', chartData);
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
      <div className="page-title">雷达监测</div>
      
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
          scroll={{ x: 1500 }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default Radar;
