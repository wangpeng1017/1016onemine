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
  序号: number;
  测点名称: string;
  接收时间: string;
  振动时长: number;
  X方向主振频率: number;
  Y方向主振频率: number;
  Z方向主振频率: number;
  X方向峰值振动速度: number;
  Y方向峰值振动速度: number;
  Z方向峰值振动速度: number;
  status?: 'normal' | 'warning' | 'alarm';
}

const BlastVibration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlastVibrationData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 最新爆破振动测试数据
  const mockData: BlastVibrationData[] = [
    { 序号: 1, 测点名称: '爆破振动2', 接收时间: '2025-09-23 09:08:33', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 2, 测点名称: '爆破振动1', 接收时间: '2025-09-23 08:30:50', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 3, 测点名称: '爆破振动', 接收时间: '2025-09-23 08:28:50', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 4, 测点名称: '爆破振动2', 接收时间: '2025-09-23 07:08:32', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 5, 测点名称: '爆破振动1', 接收时间: '2025-09-23 06:30:49', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 6, 测点名称: '爆破振动', 接收时间: '2025-09-23 06:28:51', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 7, 测点名称: '爆破振动2', 接收时间: '2025-09-23 05:08:32', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 8, 测点名称: '爆破振动1', 接收时间: '2025-09-23 04:30:49', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 9, 测点名称: '爆破振动', 接收时间: '2025-09-23 04:28:50', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' },
    { 序号: 10, 测点名称: '爆破振动2', 接收时间: '2025-09-23 03:08:32', 振动时长: 0, X方向主振频率: 0, Y方向主振频率: 0, Z方向主振频率: 0, X方向峰值振动速度: 0, Y方向峰值振动速度: 0, Z方向峰值振动速度: 0, status: 'normal' }
  ];

  const columns: ColumnsType<BlastVibrationData> = [
    {
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      width: 80,
    },
    {
      title: '测点名称',
      dataIndex: '测点名称',
      key: '测点名称',
      width: 120,
    },
    {
      title: '接收时间',
      dataIndex: '接收时间',
      key: '接收时间',
      width: 150,
    },
    {
      title: '振动时长 (ms)',
      dataIndex: '振动时长',
      key: '振动时长',
      width: 120,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'X方向主振频率 (Hz)',
      dataIndex: 'X方向主振频率',
      key: 'X方向主振频率',
      width: 160,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'Y方向主振频率 (Hz)',
      dataIndex: 'Y方向主振频率',
      key: 'Y方向主振频率',
      width: 160,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'Z方向主振频率 (Hz)',
      dataIndex: 'Z方向主振频率',
      key: 'Z方向主振频率',
      width: 160,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'X方向峰值振动速度 (cm/s)',
      dataIndex: 'X方向峰值振动速度',
      key: 'X方向峰值振动速度',
      width: 200,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'Y方向峰值振动速度 (cm/s)',
      dataIndex: 'Y方向峰值振动速度',
      key: 'Y方向峰值振动速度',
      width: 200,
      render: (value: number) => value.toFixed(0),
    },
    {
      title: 'Z方向峰值振动速度 (cm/s)',
      dataIndex: 'Z方向峰值振动速度',
      key: 'Z方向峰值振动速度',
      width: 200,
      render: (value: number) => value.toFixed(0),
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
      if (selectedDevice !== 'all' && item.测点名称 !== selectedDevice) {
        return false;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.接收时间);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      }
      return true;
    });

    return currentFilteredData.map(item => ({
      name: item.测点名称,
      data: timePoints.map((_, index) => {
        const basePeakVelocity = item.X方向峰值振动速度;
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
    if (selectedDevice !== 'all' && item.测点名称 !== selectedDevice) {
      return false;
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.接收时间);
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
              {Array.from(new Set(mockData.map(item => item.测点名称))).map(name => (
                <Option key={name} value={name}>{name}</Option>
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
          rowKey="序号"
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
