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

interface GroundwaterData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  waterLevel: number;
  waterPressure: number;
  temperature: number;
  ph: number;
  conductivity: number;
  turbidity: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const Groundwater: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GroundwaterData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 模拟地下水数据
  const mockData: GroundwaterData[] = [
    {
      id: '1',
      deviceId: 'GW-001',
      deviceName: '地下水监测点1号',
      location: 'A区深井',
      waterLevel: 15.6,
      waterPressure: 2.3,
      temperature: 12.5,
      ph: 7.2,
      conductivity: 450.8,
      turbidity: 2.1,
      batteryLevel: 88,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '2',
      deviceId: 'GW-002',
      deviceName: '地下水监测点2号',
      location: 'B区观测井',
      waterLevel: 8.9,
      waterPressure: 1.8,
      temperature: 14.2,
      ph: 6.8,
      conductivity: 520.3,
      turbidity: 3.5,
      batteryLevel: 72,
      status: 'warning',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '3',
      deviceId: 'GW-003',
      deviceName: '地下水监测点3号',
      location: 'C区监测井',
      waterLevel: 22.1,
      waterPressure: 3.1,
      temperature: 11.8,
      ph: 8.5,
      conductivity: 680.7,
      turbidity: 8.2,
      batteryLevel: 45,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '4',
      deviceId: 'GW-004',
      deviceName: '地下水监测点4号',
      location: 'D区浅井',
      waterLevel: 6.3,
      waterPressure: 1.2,
      temperature: 13.7,
      ph: 7.0,
      conductivity: 380.5,
      turbidity: 1.8,
      batteryLevel: 91,
      status: 'normal',
      timestamp: '2025-09-08 11:00:00',
    },
    {
      id: '5',
      deviceId: 'GW-005',
      deviceName: '地下水监测点5号',
      location: 'E区排水井',
      waterLevel: 18.7,
      waterPressure: 2.7,
      temperature: 15.1,
      ph: 6.5,
      conductivity: 750.2,
      turbidity: 12.5,
      batteryLevel: 38,
      status: 'alarm',
      timestamp: '2025-09-08 11:00:00',
    },
  ];

  const columns: ColumnsType<GroundwaterData> = [
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
      width: 140,
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '水位 (m)',
      dataIndex: 'waterLevel',
      key: 'waterLevel',
      width: 100,
      render: (value: number) => (
        <span style={{ 
          color: value > 20 ? '#ff4d4f' : value > 10 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '水压 (MPa)',
      dataIndex: 'waterPressure',
      key: 'waterPressure',
      width: 100,
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
      title: 'pH值',
      dataIndex: 'ph',
      key: 'ph',
      width: 80,
      render: (value: number) => (
        <span style={{ 
          color: value < 6.5 || value > 8.5 ? '#ff4d4f' : value < 7 || value > 8 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '电导率 (μS/cm)',
      dataIndex: 'conductivity',
      key: 'conductivity',
      width: 130,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '浊度 (NTU)',
      dataIndex: 'turbidity',
      key: 'turbidity',
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
      waterLevel: item.waterLevel,
      waterPressure: item.waterPressure,
      ph: item.ph,
      turbidity: item.turbidity
    }));
    
    console.log('地下水图表数据:', chartData);
    message.success(`已生成${chartData.length}个监测点的图表数据，请查看控制台`);
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
      <div className="page-title">地下水监测</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="监测点总数"
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
              placeholder="选择监测点"
              value={selectedDevice}
              onChange={setSelectedDevice}
            >
              <Option value="all">全部监测点</Option>
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
          scroll={{ x: 1400 }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default Groundwater;
