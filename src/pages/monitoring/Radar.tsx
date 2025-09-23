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
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      width: 80,
    },
    {
      title: '设备名称',
      dataIndex: '设备名称',
      key: '设备名称',
      width: 120,
    },
    {
      title: '设备编号',
      dataIndex: '设备编号',
      key: '设备编号',
      width: 180,
    },
    {
      title: '是否告警',
      dataIndex: '是否告警',
      key: '是否告警',
      width: 120,
    },
    {
      title: '推送时间',
      dataIndex: '推送时间',
      key: '推送时间',
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
      if (selectedDevice !== 'all' && item.设备名称 !== selectedDevice) {
        return false;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.推送时间);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      }
      return true;
    });

    return currentFilteredData.map(item => ({
      name: item.设备名称,
      data: timePoints.map((_, index) => {
        const baseValue = Math.random() * 10;
        const variation = (Math.random() - 0.5) * 1;
        return {
          time: timePoints[index],
          value: Math.max(0, baseValue + variation)
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
        data: item.data.map(d => d.value.toFixed(1)),
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
    if (selectedDevice !== 'all' && item.设备名称 !== selectedDevice) {
      return false;
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.推送时间);
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

  return (
    <div>
      <div className="page-title">雷达监测</div>

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
              {Array.from(new Set(mockData.map(item => item.设备名称))).map(name => (
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
