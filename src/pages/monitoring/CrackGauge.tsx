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

interface CrackData {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  crackWidth: number;
  crackLength: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

const CrackGauge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CrackData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 模拟裂缝计数据
  const mockData: CrackData[] = [
    {
      id: '1',
      deviceId: 'CG-001',
      deviceName: '裂缝计1号',
      location: 'A区边坡',
      crackWidth: 2.5,
      crackLength: 150.0,
      temperature: 25.3,
      humidity: 65.2,
      batteryLevel: 85,
      status: 'normal',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '2',
      deviceId: 'CG-002',
      deviceName: '裂缝计2号',
      location: 'B区边坡',
      crackWidth: 5.8,
      crackLength: 280.5,
      temperature: 24.8,
      humidity: 68.1,
      batteryLevel: 72,
      status: 'warning',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '3',
      deviceId: 'CG-003',
      deviceName: '裂缝计3号',
      location: 'C区边坡',
      crackWidth: 12.3,
      crackLength: 450.2,
      temperature: 26.1,
      humidity: 62.8,
      batteryLevel: 45,
      status: 'alarm',
      timestamp: '2025-09-06 16:00:00',
    },
    {
      id: '4',
      deviceId: 'CG-004',
      deviceName: '裂缝计4号',
      location: 'D区边坡',
      crackWidth: 1.8,
      crackLength: 95.3,
      temperature: 25.7,
      humidity: 64.5,
      batteryLevel: 91,
      status: 'normal',
      timestamp: '2025-09-06 16:00:00',
    },
  ];

  const columns: ColumnsType<CrackData> = [
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
      title: '裂缝宽度 (mm)',
      dataIndex: 'crackWidth',
      key: 'crackWidth',
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
      title: '裂缝长度 (mm)',
      dataIndex: 'crackLength',
      key: 'crackLength',
      width: 130,
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
        const baseCrackWidth = item.crackWidth;
        const variation = (Math.random() - 0.5) * 0.5;
        return {
          time: timePoints[index],
          crackWidth: Math.max(0, baseCrackWidth + variation)
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
        text: '裂缝计监测趋势图',
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
        name: '裂缝宽度 (mm)'
      },
      series: timeSeriesData.map(item => ({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.crackWidth.toFixed(2)),
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
      <div className="page-title">裂缝计监测</div>
      
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

      <Modal
        title="裂缝计监测趋势图"
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

export default CrackGauge;
