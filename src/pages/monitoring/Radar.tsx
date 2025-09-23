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

interface RadarData {
  序号: number;
  设备名称: string;
  设备编号: string;
  是否告警: string;
  中心点经度?: string;
  中心点纬度?: string;
  中心点海拔?: string;
  告警状态?: string;
  推送时间: string;
  操作?: string;
  status?: 'normal' | 'warning' | 'alarm';
}

const Radar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RadarData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // 最新雷达测试数据
  const mockData: RadarData[] = [
    { 序号: 1, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 09:41:00', 操作: '', status: 'normal' },
    { 序号: 2, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 08:40:00', 操作: '', status: 'normal' },
    { 序号: 3, 设备名称: 'S_SAR', 设备编号: '65222205370801000001', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 08:00:00', 操作: '', status: 'normal' },
    { 序号: 4, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 07:38:00', 操作: '', status: 'normal' },
    { 序号: 5, 设备名称: 'S_SAR', 设备编号: '65222205370801000001', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 07:00:00', 操作: '', status: 'normal' },
    { 序号: 6, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 06:38:00', 操作: '', status: 'normal' },
    { 序号: 7, 设备名称: 'S_SAR', 设备编号: '65222205370801000001', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 06:00:00', 操作: '', status: 'normal' },
    { 序号: 8, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 05:36:00', 操作: '', status: 'normal' },
    { 序号: 9, 设备名称: 'S_SAR', 设备编号: '65222205370801000001', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 05:00:00', 操作: '', status: 'normal' },
    { 序号: 10, 设备名称: 'IDS_PIER', 设备编号: '65222205370801000002', 是否告警: '未发生告警', 中心点经度: '', 中心点纬度: '', 中心点海拔: '', 告警状态: '', 推送时间: '2025-09-23 04:36:00', 操作: '', status: 'normal' }
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
        const baseDisplacement = item.displacement;
        const variation = (Math.random() - 0.5) * 1;
        return {
          time: timePoints[index],
          displacement: Math.max(0, baseDisplacement + variation)
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
        text: '雷达监测趋势图',
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
        name: '位移 (mm)'
      },
      series: timeSeriesData.map(item => ({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.displacement.toFixed(1)),
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

      <Modal
        title="雷达监测趋势图"
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

export default Radar;
