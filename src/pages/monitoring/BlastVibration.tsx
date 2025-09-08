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
  Modal,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BlastVibrationData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  peakVelocity: number;
  frequency: number;
  duration: number;
  xVelocity: number;
  yVelocity: number;
  zVelocity: number;
  blastDistance: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const BlastVibration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlastVibrationData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 模拟爆破振动数据
  const mockData: BlastVibrationData[] = [
    {
      id: '1',
      deviceId: 'BV-001',
      deviceName: '爆破振动仪1号',
      location: 'A区爆破点',
      peakVelocity: 2.5,
      frequency: 15.6,
      duration: 0.8,
      xVelocity: 1.2,
      yVelocity: 1.8,
      zVelocity: 2.1,
      blastDistance: 150.0,
      batteryLevel: 85,
      status: 'normal',
      timestamp: '2025-09-08 10:30:00',
    },
    {
      id: '2',
      deviceId: 'BV-002',
      deviceName: '爆破振动仪2号',
      location: 'B区监测点',
      peakVelocity: 4.8,
      frequency: 22.3,
      duration: 1.2,
      xVelocity: 2.1,
      yVelocity: 3.2,
      zVelocity: 4.5,
      blastDistance: 80.0,
      batteryLevel: 72,
      status: 'warning',
      timestamp: '2025-09-08 10:30:00',
    },
    {
      id: '3',
      deviceId: 'BV-003',
      deviceName: '爆破振动仪3号',
      location: 'C区居民区',
      peakVelocity: 8.2,
      frequency: 35.7,
      duration: 2.1,
      xVelocity: 4.5,
      yVelocity: 6.8,
      zVelocity: 7.9,
      blastDistance: 45.0,
      batteryLevel: 58,
      status: 'alarm',
      timestamp: '2025-09-08 10:30:00',
    },
    {
      id: '4',
      deviceId: 'BV-004',
      deviceName: '爆破振动仪4号',
      location: 'D区设备区',
      peakVelocity: 1.8,
      frequency: 12.4,
      duration: 0.6,
      xVelocity: 0.8,
      yVelocity: 1.2,
      zVelocity: 1.5,
      blastDistance: 200.0,
      batteryLevel: 91,
      status: 'normal',
      timestamp: '2025-09-08 10:30:00',
    },
    {
      id: '5',
      deviceId: 'BV-005',
      deviceName: '爆破振动仪5号',
      location: 'E区办公区',
      peakVelocity: 6.5,
      frequency: 28.9,
      duration: 1.8,
      xVelocity: 3.2,
      yVelocity: 4.8,
      zVelocity: 6.1,
      blastDistance: 60.0,
      batteryLevel: 43,
      status: 'alarm',
      timestamp: '2025-09-08 10:30:00',
    },
  ];

  const columns: ColumnsType<BlastVibrationData> = [
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
      title: '峰值速度 (mm/s)',
      dataIndex: 'peakVelocity',
      key: 'peakVelocity',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: value > 5 ? '#ff4d4f' : value > 3 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '频率 (Hz)',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '持续时间 (s)',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'X方向速度 (mm/s)',
      dataIndex: 'xVelocity',
      key: 'xVelocity',
      width: 140,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'Y方向速度 (mm/s)',
      dataIndex: 'yVelocity',
      key: 'yVelocity',
      width: 140,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'Z方向速度 (mm/s)',
      dataIndex: 'zVelocity',
      key: 'zVelocity',
      width: 140,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '爆破距离 (m)',
      dataIndex: 'blastDistance',
      key: 'blastDistance',
      width: 120,
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
    setChartVisible(true);
  };

  const generateTimeSeriesData = () => {
    const timePoints: string[] = [];
    const now = dayjs();
    for (let i = 23; i >= 0; i--) {
      timePoints.push(now.subtract(i, 'hour').format('HH:mm'));
    }

    const currentFilteredData = data.filter(item => {
      if (selectedDevice !== 'all' && item.deviceId !== selectedDevice) {
        return false;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.timestamp);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      }
      return true;
    });

    return currentFilteredData.map(item => ({
      name: item.deviceName,
      data: timePoints.map((_, index) => {
        const basePeakVelocity = item.peakVelocity;
        const variation = (Math.random() - 0.5) * 2;
        return {
          time: timePoints[index],
          peakVelocity: Math.max(0, basePeakVelocity + variation)
        };
      })
    }));
  };

  const renderChart = () => {
    if (!chartContainer) return;

    const chart = echarts.init(chartContainer);
    const timeSeriesData = generateTimeSeriesData();
    const timePoints = timeSeriesData[0]?.data.map(d => d.time) || [];

    const option = {
      title: {
        text: '爆破振动监测趋势图',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: timeSeriesData.map(item => item.name),
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timePoints,
        name: '时间'
      },
      yAxis: {
        type: 'value',
        name: '峰值速度 (mm/s)'
      },
      series: timeSeriesData.map(item => ({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.peakVelocity.toFixed(1)),
        smooth: true,
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 4
      }))
    };

    chart.setOption(option);
    
    return () => {
      chart.dispose();
    };
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

  useEffect(() => {
    if (chartVisible && chartContainer) {
      const cleanup = renderChart();
      return cleanup;
    }
  }, [chartVisible, chartContainer, filteredData]);

  const statistics = {
    total: filteredData.length,
    normal: filteredData.filter(item => item.status === 'normal').length,
    warning: filteredData.filter(item => item.status === 'warning').length,
    alarm: filteredData.filter(item => item.status === 'alarm').length,
  };

  return (
    <div>
      <div className="page-title">爆破振动监测</div>
      
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
          scroll={{ x: 1600 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title="爆破振动监测趋势图"
        open={chartVisible}
        onCancel={() => setChartVisible(false)}
        width={1000}
        footer={null}
      >
        <div 
          ref={setChartContainer}
          style={{ width: '100%', height: '500px' }}
        />
      </Modal>
    </div>
  );
};

export default BlastVibration;
