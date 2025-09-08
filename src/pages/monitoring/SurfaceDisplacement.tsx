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

  // 基于gnss.md的真实GNSS数据
  const mockData: GNSSData[] = [
    {
      序号: 1,
      点名: 'GP-29',
      类型: '表面位移监测',
      累计位移量X: -28.0,
      累计位移量Y: -20.7,
      累计位移量Z: 5.7,
      小时位移速度X: 1.6,
      小时位移速度Y: 1.2,
      小时位移速度Z: -6.2,
      小时位移加速度X: 0.3,
      小时位移加速度Y: 2.4,
      小时位移加速度Z: 0.0,
      更新时间: '2025-09-06 16:00:00',
      status: 'normal',
      totalDisplacement: 35.1,
    },
    {
      序号: 2,
      点名: 'GP-28',
      类型: '表面位移监测',
      累计位移量X: 155.6,
      累计位移量Y: 103.2,
      累计位移量Z: -235.6,
      小时位移速度X: 1.4,
      小时位移速度Y: 1.3,
      小时位移速度Z: -5.7,
      小时位移加速度X: 0.1,
      小时位移加速度Y: 1.5,
      小时位移加速度Z: 2.8,
      更新时间: '2025-09-06 16:00:00',
      status: 'alarm',
      totalDisplacement: 295.1,
    },
    {
      序号: 3,
      点名: 'GP-27',
      类型: '表面位移监测',
      累计位移量X: 99.5,
      累计位移量Y: 48.6,
      累计位移量Z: -60.7,
      小时位移速度X: 0.1,
      小时位移速度Y: 0.8,
      小时位移速度Z: -1.2,
      小时位移加速度X: -0.2,
      小时位移加速度Y: 1.4,
      小时位移加速度Z: -2.3,
      更新时间: '2025-09-06 16:00:00',
      status: 'warning',
      totalDisplacement: 125.4,
    },
    {
      序号: 4,
      点名: 'GP-26',
      类型: '表面位移监测',
      累计位移量X: 39.7,
      累计位移量Y: 32.7,
      累计位移量Z: -426.5,
      小时位移速度X: 0.9,
      小时位移速度Y: 1.1,
      小时位移速度Z: 0.9,
      小时位移加速度X: 0.5,
      小时位移加速度Y: 1.7,
      小时位移加速度Z: -5.6,
      更新时间: '2025-09-06 16:00:00',
      status: 'alarm',
      totalDisplacement: 433.0,
    },
    {
      序号: 5,
      点名: 'GP-25',
      类型: '表面位移监测',
      累计位移量X: 22.5,
      累计位移量Y: -7.7,
      累计位移量Z: -19.4,
      小时位移速度X: 0.8,
      小时位移速度Y: 0.7,
      小时位移速度Z: -2.5,
      小时位移加速度X: 0.5,
      小时位移加速度Y: 1.2,
      小时位移加速度Z: -5.0,
      更新时间: '2025-09-06 16:00:00',
      status: 'normal',
      totalDisplacement: 31.2,
    },
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
    message.info('图表查看功能开发中...');
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
              <Option value="GP-29">GP-29</Option>
              <Option value="GP-28">GP-28</Option>
              <Option value="GP-27">GP-27</Option>
              <Option value="GP-26">GP-26</Option>
              <Option value="GP-25">GP-25</Option>
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
    </div>
  );
};

export default SurfaceDisplacement;
