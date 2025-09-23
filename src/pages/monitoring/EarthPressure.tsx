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

interface EarthPressureData {
  序号: number;
  测点名称: string;
  接收时间: string;
  土压力: number;
  status?: 'normal' | 'warning' | 'alarm';
}

const EarthPressure: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarthPressureData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 最新土压力测试数据
  const mockData: EarthPressureData[] = [
    { 序号: 1, 测点名称: '土压力计2', 接收时间: '2025-09-23 09:00:00', 土压力: 0.64, status: 'normal' },
    { 序号: 2, 测点名称: '土压力计', 接收时间: '2025-09-23 09:00:00', 土压力: 4.17, status: 'normal' },
    { 序号: 3, 测点名称: '土压力计', 接收时间: '2025-09-23 08:30:00', 土压力: 4.17, status: 'normal' },
    { 序号: 4, 测点名称: '土压力计2', 接收时间: '2025-09-23 08:00:00', 土压力: 0.62, status: 'normal' },
    { 序号: 5, 测点名称: '土压力计', 接收时间: '2025-09-23 08:00:00', 土压力: 4.12, status: 'normal' },
    { 序号: 6, 测点名称: '土压力计', 接收时间: '2025-09-23 07:30:00', 土压力: 4.1, status: 'normal' },
    { 序号: 7, 测点名称: '土压力计2', 接收时间: '2025-09-23 07:00:00', 土压力: 0.6, status: 'normal' },
    { 序号: 8, 测点名称: '土压力计', 接收时间: '2025-09-23 07:00:00', 土压力: 4.03, status: 'normal' },
    { 序号: 9, 测点名称: '土压力计', 接收时间: '2025-09-23 06:30:00', 土压力: 4.12, status: 'normal' },
    { 序号: 10, 测点名称: '土压力计2', 接收时间: '2025-09-23 06:00:00', 土压力: 0.62, status: 'normal' }
  ];

  const columns: ColumnsType<EarthPressureData> = [
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
      title: '土压力 (Kpa)',
      dataIndex: '土压力',
      key: '土压力',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value > 10 ? '#ff4d4f' : value > 5 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(2)}
        </span>
      ),
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
        const basePressure = item.土压力;
        const variation = (Math.random() - 0.5) * 10;
        return {
          time: timePoints[index],
          pressure: Math.max(0, basePressure + variation)
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
        text: '土压力监测趋势图',
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
        name: '土压力 (kPa)'
      },
      series: timeSeriesData.map(item => ({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.pressure.toFixed(1)),
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
      <div className="page-title">土压力监测</div>

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
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title="土压力监测趋势图"
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

export default EarthPressure;
