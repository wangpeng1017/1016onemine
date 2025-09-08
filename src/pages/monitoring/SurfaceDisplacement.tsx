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

interface GNSSData {
  序号: number;
  点名: string;
  类型: string;
  累计位移量X: number;
  累计位移量Y: number;
  累计位移量Z: number;
  小时位移速度X: number;
  小时位移速度Y: number;
  小时位移速度Z: number;
  小时位移加速度X: number;
  小时位移加速度Y: number;
  小时位移加速度Z: number;
  更新时间: string;
  status?: 'normal' | 'warning' | 'alarm';
  totalDisplacement?: number;
}

const SurfaceDisplacement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GNSSData[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 基于gnss.md的完整GNSS数据
  const mockData: GNSSData[] = [
    { 序号: 1, 点名: 'GP-29', 类型: '表面位移监测', 累计位移量X: -28.0, 累计位移量Y: -20.7, 累计位移量Z: 5.7, 小时位移速度X: 1.6, 小时位移速度Y: 1.2, 小时位移速度Z: -6.2, 小时位移加速度X: 0.3, 小时位移加速度Y: 2.4, 小时位移加速度Z: 0.0, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 35.1 },
    { 序号: 2, 点名: 'GP-28', 类型: '表面位移监测', 累计位移量X: 155.6, 累计位移量Y: 103.2, 累计位移量Z: -235.6, 小时位移速度X: 1.4, 小时位移速度Y: 1.3, 小时位移速度Z: -5.7, 小时位移加速度X: 0.1, 小时位移加速度Y: 1.5, 小时位移加速度Z: 2.8, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 295.1 },
    { 序号: 3, 点名: 'GP-27', 类型: '表面位移监测', 累计位移量X: 99.5, 累计位移量Y: 48.6, 累计位移量Z: -60.7, 小时位移速度X: 0.1, 小时位移速度Y: 0.8, 小时位移速度Z: -1.2, 小时位移加速度X: -0.2, 小时位移加速度Y: 1.4, 小时位移加速度Z: -2.3, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 125.4 },
    { 序号: 4, 点名: 'GP-26', 类型: '表面位移监测', 累计位移量X: 39.7, 累计位移量Y: 32.7, 累计位移量Z: -426.5, 小时位移速度X: 0.9, 小时位移速度Y: 1.1, 小时位移速度Z: 0.9, 小时位移加速度X: 0.5, 小时位移加速度Y: 1.7, 小时位移加速度Z: -5.6, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 433.0 },
    { 序号: 5, 点名: 'GP-25', 类型: '表面位移监测', 累计位移量X: 22.5, 累计位移量Y: -7.7, 累计位移量Z: -19.4, 小时位移速度X: 0.8, 小时位移速度Y: 0.7, 小时位移速度Z: -2.5, 小时位移加速度X: 0.5, 小时位移加速度Y: 1.2, 小时位移加速度Z: -5.0, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 31.2 },
    { 序号: 6, 点名: 'GP-24', 类型: '表面位移监测', 累计位移量X: 74.8, 累计位移量Y: 11.7, 累计位移量Z: -62.1, 小时位移速度X: 0.4, 小时位移速度Y: 0.7, 小时位移速度Z: 0.7, 小时位移加速度X: 1.5, 小时位移加速度Y: 1.1, 小时位移加速度Z: 0.4, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 97.8 },
    { 序号: 7, 点名: 'GP-22', 类型: '表面位移监测', 累计位移量X: 75.4, 累计位移量Y: 26.4, 累计位移量Z: -75.5, 小时位移速度X: 0.3, 小时位移速度Y: 0.9, 小时位移速度Z: -1.0, 小时位移加速度X: 1.3, 小时位移加速度Y: 1.5, 小时位移加速度Z: -2.0, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 107.1 },
    { 序号: 8, 点名: 'GP-21', 类型: '表面位移监测', 累计位移量X: 177.4, 累计位移量Y: -1.4, 累计位移量Z: -94.8, 小时位移速度X: -0.4, 小时位移速度Y: 0.2, 小时位移速度Z: 2.4, 小时位移加速度X: 0.3, 小时位移加速度Y: 0.3, 小时位移加速度Z: 3.0, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 201.3 },
    { 序号: 9, 点名: 'GP-17', 类型: '表面位移监测', 累计位移量X: -101.6, 累计位移量Y: 16.5, 累计位移量Z: -289.1, 小时位移速度X: 0.8, 小时位移速度Y: 0.6, 小时位移速度Z: 0.1, 小时位移加速度X: 2.3, 小时位移加速度Y: 0.2, 小时位移加速度Z: -2.3, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 308.3 },
    { 序号: 10, 点名: 'GP-40', 类型: '表面位移监测', 累计位移量X: -19.9, 累计位移量Y: -5.2, 累计位移量Z: -30.0, 小时位移速度X: -0.2, 小时位移速度Y: 1.5, 小时位移速度Z: -9.8, 小时位移加速度X: 0.5, 小时位移加速度Y: 3.4, 小时位移加速度Z: -6.5, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 37.2 },
    { 序号: 11, 点名: 'GP-38', 类型: '表面位移监测', 累计位移量X: 132.9, 累计位移量Y: 88.7, 累计位移量Z: -248.5, 小时位移速度X: 1.2, 小时位移速度Y: 1.4, 小时位移速度Z: -5.0, 小时位移加速度X: 1.5, 小时位移加速度Y: 2.0, 小时位移加速度Z: -2.7, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 294.4 },
    { 序号: 12, 点名: 'GP-37', 类型: '表面位移监测', 累计位移量X: -964.2, 累计位移量Y: -37.7, 累计位移量Z: 407.7, 小时位移速度X: 0.4, 小时位移速度Y: 0.4, 小时位移速度Z: -2.6, 小时位移加速度X: 1.2, 小时位移加速度Y: 0.5, 小时位移加速度Z: -2.1, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 1048.5 },
    { 序号: 13, 点名: 'GP-36', 类型: '表面位移监测', 累计位移量X: 6.2, 累计位移量Y: 16.4, 累计位移量Z: -129.7, 小时位移速度X: 0.8, 小时位移速度Y: 0.7, 小时位移速度Z: 0.6, 小时位移加速度X: 0.5, 小时位移加速度Y: 0.1, 小时位移加速度Z: -2.9, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 131.0 },
    { 序号: 14, 点名: 'GP-35', 类型: '表面位移监测', 累计位移量X: 46.9, 累计位移量Y: 3.9, 累计位移量Z: 9.2, 小时位移速度X: 0.8, 小时位移速度Y: 1.0, 小时位移速度Z: -2.8, 小时位移加速度X: -0.2, 小时位移加速度Y: 2.0, 小时位移加速度Z: 0.4, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 47.8 },
    { 序号: 15, 点名: 'GP-33', 类型: '表面位移监测', 累计位移量X: 96.5, 累计位移量Y: -118.3, 累计位移量Z: -271.7, 小时位移速度X: 1.5, 小时位移速度Y: 1.6, 小时位移速度Z: 0.1, 小时位移加速度X: 0.9, 小时位移加速度Y: 2.9, 小时位移加速度Z: -8.0, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 314.4 },
    { 序号: 16, 点名: 'GP-32', 类型: '表面位移监测', 累计位移量X: 104.0, 累计位移量Y: -0.7, 累计位移量Z: -62.3, 小时位移速度X: 0.4, 小时位移速度Y: 0.9, 小时位移速度Z: -2.6, 小时位移加速度X: 1.1, 小时位移加速度Y: 1.2, 小时位移加速度Z: -2.7, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 122.2 },
    { 序号: 17, 点名: 'GP-31', 类型: '表面位移监测', 累计位移量X: 184.5, 累计位移量Y: 5.3, 累计位移量Z: -72.3, 小时位移速度X: 0.2, 小时位移速度Y: 1.0, 小时位移速度Z: -1.5, 小时位移加速度X: 1.2, 小时位移加速度Y: 1.6, 小时位移加速度Z: -1.4, 更新时间: '2025-09-06 16:00:00', status: 'alarm', totalDisplacement: 198.2 },
    { 序号: 18, 点名: 'GP-23', 类型: '表面位移监测', 累计位移量X: -59.1, 累计位移量Y: -33.0, 累计位移量Z: -25.2, 小时位移速度X: 0.3, 小时位移速度Y: 0.3, 小时位移速度Z: 0.0, 小时位移加速度X: 2.2, 小时位移加速度Y: 0.5, 小时位移加速度Z: -1.1, 更新时间: '2025-09-06 16:00:00', status: 'warning', totalDisplacement: 70.4 },
    { 序号: 19, 点名: 'GP-19', 类型: '表面位移监测', 累计位移量X: 3.9, 累计位移量Y: -6.8, 累计位移量Z: -38.2, 小时位移速度X: 0.9, 小时位移速度Y: 0.7, 小时位移速度Z: -2.2, 小时位移加速度X: 2.6, 小时位移加速度Y: 0.9, 小时位移加速度Z: -6.2, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 39.0 },
    { 序号: 20, 点名: 'GP-18', 类型: '表面位移监测', 累计位移量X: 6.4, 累计位移量Y: -5.6, 累计位移量Z: -14.1, 小时位移速度X: 0.9, 小时位移速度Y: 0.6, 小时位移速度Z: 0.6, 小时位移加速度X: 2.0, 小时位移加速度Y: -0.3, 小时位移加速度Z: 0.1, 更新时间: '2025-09-06 16:00:00', status: 'normal', totalDisplacement: 16.5 }
  ];

  const columns: ColumnsType<GNSSData> = [
    {
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      width: 80,
    },
    {
      title: '监测点',
      dataIndex: '点名',
      key: '点名',
      width: 100,
    },
    {
      title: '累计位移X (mm)',
      dataIndex: '累计位移量X',
      key: '累计位移量X',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: Math.abs(value) > 100 ? '#ff4d4f' : Math.abs(value) > 50 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '累计位移Y (mm)',
      dataIndex: '累计位移量Y',
      key: '累计位移量Y',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: Math.abs(value) > 100 ? '#ff4d4f' : Math.abs(value) > 50 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '累计位移Z (mm)',
      dataIndex: '累计位移量Z',
      key: '累计位移量Z',
      width: 130,
      render: (value: number) => (
        <span style={{ 
          color: Math.abs(value) > 100 ? '#ff4d4f' : Math.abs(value) > 50 ? '#faad14' : '#52c41a' 
        }}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      title: '速度X (mm/h)',
      dataIndex: '小时位移速度X',
      key: '小时位移速度X',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '速度Y (mm/h)',
      dataIndex: '小时位移速度Y',
      key: '小时位移速度Y',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '速度Z (mm/h)',
      dataIndex: '小时位移速度Z',
      key: '小时位移速度Z',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '更新时间',
      dataIndex: '更新时间',
      key: '更新时间',
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
    // 模拟API调用
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
      if (selectedStation !== 'all' && item.点名 !== selectedStation) {
        return false;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.更新时间);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      }
      return true;
    });

    return currentFilteredData.map(item => ({
      name: item.点名,
      data: timePoints.map((_, index) => {
        const baseX = item.累计位移量X;
        const baseY = item.累计位移量Y;
        const baseZ = item.累计位移量Z;
        const variation = (Math.random() - 0.5) * 10;
        return {
          time: timePoints[index],
          x: baseX + variation,
          y: baseY + variation * 0.8,
          z: baseZ + variation * 1.2,
          total: Math.sqrt(Math.pow(baseX + variation, 2) + Math.pow(baseY + variation * 0.8, 2) + Math.pow(baseZ + variation * 1.2, 2))
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
        text: '表面位移监测趋势图',
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
        name: '位移量 (mm)'
      },
      series: timeSeriesData.map(item => ({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.total.toFixed(1)),
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
    if (selectedStation !== 'all' && item.点名 !== selectedStation) {
      return false;
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.更新时间);
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
    maxDisplacement: Math.max(...filteredData.map(item => item.totalDisplacement || 0)),
  };

  return (
    <div>
      <div className="page-title">表面位移监测</div>
      
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
              value={selectedStation}
              onChange={setSelectedStation}
            >
              <Option value="all">全部监测点</Option>
              {mockData.map(item => (
                <Option key={item.点名} value={item.点名}>{item.点名}</Option>
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
        title="表面位移监测趋势图"
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

export default SurfaceDisplacement;
