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

interface RainGaugeData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  hourlyRainfall: number;
  dailyRainfall: number;
  monthlyRainfall: number;
  totalRainfall: number;
  rainIntensity: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const RainGauge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RainGaugeData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 模拟雨量计数据
  const mockData: RainGaugeData[] = [
    {
      id: '1',
      deviceId: 'RG-001',
      deviceName: '雨量计1号',
      location: 'A区气象站',
      hourlyRainfall: 2.5,
      dailyRainfall: 15.8,
      monthlyRainfall: 125.6,
      totalRainfall: 1256.8,
      rainIntensity: 2.5,
      temperature: 22.3,
      humidity: 78.5,
      batteryLevel: 88,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '2',
      deviceId: 'RG-002',
      deviceName: '雨量计2号',
      location: 'B区山顶',
      hourlyRainfall: 8.2,
      dailyRainfall: 45.6,
      monthlyRainfall: 285.3,
      totalRainfall: 2156.7,
      rainIntensity: 8.2,
      temperature: 18.7,
      humidity: 85.2,
      batteryLevel: 72,
      status: 'warning',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '3',
      deviceId: 'RG-003',
      deviceName: '雨量计3号',
      location: 'C区排水口',
      hourlyRainfall: 15.6,
      dailyRainfall: 78.9,
      monthlyRainfall: 456.8,
      totalRainfall: 3456.9,
      rainIntensity: 15.6,
      temperature: 20.1,
      humidity: 92.3,
      batteryLevel: 45,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '4',
      deviceId: 'RG-004',
      deviceName: '雨量计4号',
      location: 'D区办公区',
      hourlyRainfall: 1.2,
      dailyRainfall: 8.5,
      monthlyRainfall: 98.2,
      totalRainfall: 856.4,
      rainIntensity: 1.2,
      temperature: 24.5,
      humidity: 65.8,
      batteryLevel: 91,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '5',
      deviceId: 'RG-005',
      deviceName: '雨量计5号',
      location: 'E区尾矿库',
      hourlyRainfall: 12.8,
      dailyRainfall: 65.4,
      monthlyRainfall: 378.9,
      totalRainfall: 2789.5,
      rainIntensity: 12.8,
      temperature: 19.6,
      humidity: 88.7,
      batteryLevel: 38,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
  ];

  const columns: ColumnsType<RainGaugeData> = [
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
      title: '小时降雨量 (mm)',
      dataIndex: 'hourlyRainfall',
      key: 'hourlyRainfall',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: value > 10 ? '#ff4d4f' : value > 5 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '日降雨量 (mm)',
      dataIndex: 'dailyRainfall',
      key: 'dailyRainfall',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value > 50 ? '#ff4d4f' : value > 25 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '月降雨量 (mm)',
      dataIndex: 'monthlyRainfall',
      key: 'monthlyRainfall',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '累计降雨量 (mm)',
      dataIndex: 'totalRainfall',
      key: 'totalRainfall',
      width: 130,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '降雨强度 (mm/h)',
      dataIndex: 'rainIntensity',
      key: 'rainIntensity',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: value > 10 ? '#ff4d4f' : value > 5 ? '#faad14' : '#52c41a' 
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
      title: '湿度 (%)',
      dataIndex: 'humidity',
      key: 'humidity',
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
      hourlyRainfall: item.hourlyRainfall,
      dailyRainfall: item.dailyRainfall,
      rainIntensity: item.rainIntensity,
      temperature: item.temperature
    }));
    
    console.log('雨量计图表数据:', chartData);
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
      <div className="page-title">雨量计监测</div>
      
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

export default RainGauge;
