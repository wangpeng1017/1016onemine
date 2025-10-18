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
  Form,
  Input,
  InputNumber,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  LineChartOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface GNSSData {
  序号: number;
  点名: string;
  累计位移量X: number;
  累计位移量Y: number;
  累计位移量Z: number;
  小时位移量X: number;
  小时位移量Y: number;
  小时位移量Z: number;
  小时位移加速度X: number;
  小时位移加速度Y: number;
  小时位移加速度Z: number;
  接收时间: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GNSSData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  // 基于最新测试数据的表面位移监测数据
  const mockData: GNSSData[] = [
    { 序号: 1, 点名: 'GP-29', 累计位移量X: -31.7, 累计位移量Y: -23.5, 累计位移量Z: 13.1, 小时位移量X: -0.1, 小时位移量Y: -0.6, 小时位移量Z: -1.9, 小时位移加速度X: -0.5, 小时位移加速度Y: 1.1, 小时位移加速度Z: -0.4, 接收时间: '2025-09-23 09:00:00', status: 'normal', totalDisplacement: Math.sqrt(31.7*31.7 + 23.5*23.5 + 13.1*13.1) },
    { 序号: 2, 点名: 'GP-28', 累计位移量X: 153.9, 累计位移量Y: 104.8, 累计位移量Z: -235, 小时位移量X: -1.4, 小时位移量Y: -1.5, 小时位移量Z: -1.8, 小时位移加速度X: -0.7, 小时位移加速度Y: -1.3, 小时位移加速度Z: 3.3, 接收时间: '2025-09-23 09:00:00', status: 'alarm', totalDisplacement: Math.sqrt(153.9*153.9 + 104.8*104.8 + 235*235) },
    { 序号: 3, 点名: 'GP-27', 累计位移量X: 99.3, 累计位移量Y: 47, 累计位移量Z: -59.3, 小时位移量X: 0.6, 小时位移量Y: -0.3, 小时位移量Z: 2.3, 小时位移加速度X: 1.1, 小时位移加速度Y: 0.9, 小时位移加速度Z: 2.5, 接收时间: '2025-09-23 09:00:00', status: 'warning', totalDisplacement: Math.sqrt(99.3*99.3 + 47*47 + 59.3*59.3) },
    { 序号: 4, 点名: 'GP-26', 累计位移量X: 44.4, 累计位移量Y: 29.9, 累计位移量Z: -428.5, 小时位移量X: -1, 小时位移量Y: 0.5, 小时位移量Z: 6.1, 小时位移加速度X: -3.5, 小时位移加速度Y: 0.3, 小时位移加速度Z: 7, 接收时间: '2025-09-23 09:00:00', status: 'alarm', totalDisplacement: Math.sqrt(44.4*44.4 + 29.9*29.9 + 428.5*428.5) },
    { 序号: 5, 点名: 'GP-25', 累计位移量X: 21, 累计位移量Y: -9, 累计位移量Z: -18.5, 小时位移量X: -0.3, 小时位移量Y: -0.9, 小时位移量Z: 0.8, 小时位移加速度X: 0.1, 小时位移加速度Y: -0.2, 小时位移加速度Z: 0.3, 接收时间: '2025-09-23 09:00:00', status: 'normal', totalDisplacement: Math.sqrt(21*21 + 9*9 + 18.5*18.5) },
    { 序号: 6, 点名: 'GP-24', 累计位移量X: 74.8, 累计位移量Y: 12.4, 累计位移量Z: -64.8, 小时位移量X: 1.4, 小时位移量Y: -0.5, 小时位移量Z: 1.6, 小时位移加速度X: 3.9, 小时位移加速度Y: -0.8, 小时位移加速度Z: 1.3, 接收时间: '2025-09-23 09:00:00', status: 'warning', totalDisplacement: Math.sqrt(74.8*74.8 + 12.4*12.4 + 64.8*64.8) },
    { 序号: 7, 点名: 'GP-22', 累计位移量X: 75.5, 累计位移量Y: 27.7, 累计位移量Z: -79.2, 小时位移量X: 1.9, 小时位移量Y: -0.8, 小时位移量Z: 1.9, 小时位移加速度X: 4.8, 小时位移加速度Y: -1, 小时位移加速度Z: 2.8, 接收时间: '2025-09-23 09:00:00', status: 'warning', totalDisplacement: Math.sqrt(75.5*75.5 + 27.7*27.7 + 79.2*79.2) },
    { 序号: 8, 点名: 'GP-21', 累计位移量X: 180, 累计位移量Y: 1, 累计位移量Z: -97.4, 小时位移量X: 2.8, 小时位移量Y: -0.3, 小时位移量Z: 2.3, 小时位移加速度X: 5.3, 小时位移加速度Y: -0.4, 小时位移加速度Z: 2.7, 接收时间: '2025-09-23 09:00:00', status: 'alarm', totalDisplacement: Math.sqrt(180*180 + 1*1 + 97.4*97.4) },
    { 序号: 9, 点名: 'GP-17', 累计位移量X: -99.5, 累计位移量Y: 19.2, 累计位移量Z: -295.7, 小时位移量X: 2.8, 小时位移量Y: -0.6, 小时位移量Z: 2.5, 小时位移加速度X: 5.7, 小时位移加速度Y: -1.4, 小时位移加速度Z: 3.4, 接收时间: '2025-09-23 09:00:00', status: 'alarm', totalDisplacement: Math.sqrt(99.5*99.5 + 19.2*19.2 + 295.7*295.7) },
    { 序号: 10, 点名: 'GP-40', 累计位移量X: -25.7, 累计位移量Y: -11.1, 累计位移量Z: -24.4, 小时位移量X: -2, 小时位移量Y: -1.4, 小时位移量Z: -5.9, 小时位移加速度X: -2.5, 小时位移加速度Y: 0.8, 小时位移加速度Z: -4.6, 接收时间: '2025-09-23 09:00:00', status: 'normal', totalDisplacement: Math.sqrt(25.7*25.7 + 11.1*11.1 + 24.4*24.4) }
  ];

  const columns: ColumnsType<GNSSData> = [
    {
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      width: 80,
    },
    {
      title: '测点名称',
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
      title: '小时位移X (mm)',
      dataIndex: '小时位移量X',
      key: '小时位移量X',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '小时位移Y (mm)',
      dataIndex: '小时位移量Y',
      key: '小时位移量Y',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '小时位移Z (mm)',
      dataIndex: '小时位移量Z',
      key: '小时位移量Z',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '加速度X (mm/h²)',
      dataIndex: '小时位移加速度X',
      key: '小时位移加速度X',
      width: 130,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '加速度Y (mm/h²)',
      dataIndex: '小时位移加速度Y',
      key: '小时位移加速度Y',
      width: 130,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '加速度Z (mm/h²)',
      dataIndex: '小时位移加速度Z',
      key: '小时位移加速度Z',
      width: 130,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '接收时间',
      dataIndex: '接收时间',
      key: '接收时间',
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
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
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

  const getFilteredData = () => {
    let filtered = data;
    if (searchText) {
      filtered = filtered.filter(item => item.点名.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    if (selectedStation && selectedStation !== 'all') {
      filtered = filtered.filter(item => item.点名 === selectedStation);
    }
    return filtered;
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: GNSSData) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: GNSSData) => {
    Modal.info({
      title: `测点详情 - ${record.点名}`,
      width: 600,
      content: (
        <div>
          <p>累计位移X: {record.累计位移量X} mm</p>
          <p>累计位移Y: {record.累计位移量Y} mm</p>
          <p>累计位移Z: {record.累计位移量Z} mm</p>
          <p>小时位移X: {record.小时位移量X} mm</p>
          <p>小时位移Y: {record.小时位移量Y} mm</p>
          <p>小时位移Z: {record.小时位移量Z} mm</p>
          <p>接收时间: {record.接收时间}</p>
        </div>
      ),
    });
  };

  const handleDelete = (record: GNSSData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除测点 ${record.点名} 的数据吗？`,
      onOk() {
        setData(prev => prev.filter(item => item.序号 !== record.序号));
        message.success('删除成功');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setData(prev => prev.map(item =>
          item.序号 === editingRecord.序号 ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        const newRecord: GNSSData = {
          序号: data.length + 1,
          ...values,
          接收时间: new Date().toISOString().replace('T', ' ').substring(0, 19),
          totalDisplacement: Math.sqrt(
            values.累计位移量X ** 2 +
            values.累计位移量Y ** 2 +
            values.累计位移量Z ** 2
          ),
        };
        setData(prev => [...prev, newRecord]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const handleResetFilter = () => {
    setSearchText('');
    setFilterStatus(undefined);
    setSelectedStation('all');
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
        const itemDate = dayjs(item.接收时间);
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
    maxDisplacement: Math.max(...filteredData.map(item => item.totalDisplacement || 0)),
  };

  return (
    <div>
      <div className="page-title">表面位移监测</div>

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
