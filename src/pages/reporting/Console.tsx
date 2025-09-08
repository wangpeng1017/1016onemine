import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  message,
  Select,
  DatePicker,
} from 'antd';
import {
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ConsoleData {
  id: string;
  deviceType: string;
  deviceId: string;
  deviceName: string;
  dataType: string;
  uploadStatus: 'success' | 'failed' | 'uploading';
  lastUpload: string;
  nextUpload: string;
  uploadCount: number;
  failCount: number;
  successRate: number;
}

const Console: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConsoleData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // 模拟控制台数据
  const mockData: ConsoleData[] = [
    {
      id: '1',
      deviceType: 'GNSS',
      deviceId: 'GP-29',
      deviceName: 'GNSS监测点29号',
      dataType: '表面位移数据',
      uploadStatus: 'success',
      lastUpload: '2025-09-08 11:30:00',
      nextUpload: '2025-09-08 11:35:00',
      uploadCount: 1440,
      failCount: 2,
      successRate: 99.86,
    },
    {
      id: '2',
      deviceType: '裂缝计',
      deviceId: 'CG-001',
      deviceName: '裂缝计1号',
      dataType: '裂缝监测数据',
      uploadStatus: 'uploading',
      lastUpload: '2025-09-08 11:25:00',
      nextUpload: '2025-09-08 11:30:00',
      uploadCount: 720,
      failCount: 5,
      successRate: 99.31,
    },
    {
      id: '3',
      deviceType: '土压力计',
      deviceId: 'EP-001',
      deviceName: '土压力计1号',
      dataType: '土压力数据',
      uploadStatus: 'failed',
      lastUpload: '2025-09-08 11:20:00',
      nextUpload: '2025-09-08 11:25:00',
      uploadCount: 360,
      failCount: 15,
      successRate: 95.83,
    },
    {
      id: '4',
      deviceType: '地下水',
      deviceId: 'GW-001',
      deviceName: '地下水监测点1号',
      dataType: '地下水数据',
      uploadStatus: 'success',
      lastUpload: '2025-09-08 11:28:00',
      nextUpload: '2025-09-08 11:33:00',
      uploadCount: 288,
      failCount: 1,
      successRate: 99.65,
    },
    {
      id: '5',
      deviceType: '雨量计',
      deviceId: 'RG-001',
      deviceName: '雨量计1号',
      dataType: '降雨数据',
      uploadStatus: 'success',
      lastUpload: '2025-09-08 11:32:00',
      nextUpload: '2025-09-08 11:37:00',
      uploadCount: 144,
      failCount: 0,
      successRate: 100.00,
    },
    {
      id: '6',
      deviceType: '雷达',
      deviceId: 'RD-001',
      deviceName: '雷达监测仪1号',
      dataType: '雷达监测数据',
      uploadStatus: 'uploading',
      lastUpload: '2025-09-08 11:29:00',
      nextUpload: '2025-09-08 11:34:00',
      uploadCount: 480,
      failCount: 8,
      successRate: 98.33,
    },
  ];

  const columns: ColumnsType<ConsoleData> = [
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 100,
    },
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
      width: 150,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 120,
    },
    {
      title: '上报状态',
      dataIndex: 'uploadStatus',
      key: 'uploadStatus',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功' },
          failed: { color: 'red', text: '失败' },
          uploading: { color: 'blue', text: '上报中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '最后上报时间',
      dataIndex: 'lastUpload',
      key: 'lastUpload',
      width: 150,
    },
    {
      title: '下次上报时间',
      dataIndex: 'nextUpload',
      key: 'nextUpload',
      width: 150,
    },
    {
      title: '上报次数',
      dataIndex: 'uploadCount',
      key: 'uploadCount',
      width: 100,
    },
    {
      title: '失败次数',
      dataIndex: 'failCount',
      key: 'failCount',
      width: 100,
      render: (value: number) => (
        <span style={{ color: value > 10 ? '#ff4d4f' : value > 5 ? '#faad14' : '#52c41a' }}>
          {value}
        </span>
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 120,
      render: (value: number) => (
        <Progress
          percent={value}
          size="small"
          status={value < 95 ? 'exception' : value < 99 ? 'active' : 'success'}
          format={(percent) => `${percent?.toFixed(1)}%`}
        />
      ),
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
    // 模拟实时更新
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartUpload = () => {
    message.success('开始数据上报');
  };

  const handleStopUpload = () => {
    message.warning('暂停数据上报');
  };

  const handleSettings = () => {
    message.info('上报设置功能开发中...');
  };

  const filteredData = data.filter(item => {
    if (selectedType !== 'all' && item.deviceType !== selectedType) {
      return false;
    }
    return true;
  });

  const statistics = {
    total: filteredData.length,
    success: filteredData.filter(item => item.uploadStatus === 'success').length,
    failed: filteredData.filter(item => item.uploadStatus === 'failed').length,
    uploading: filteredData.filter(item => item.uploadStatus === 'uploading').length,
    avgSuccessRate: filteredData.reduce((sum, item) => sum + item.successRate, 0) / filteredData.length,
  };

  return (
    <div>
      <div className="page-title">数据上报 - 控制台</div>
      
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
              title="上报成功"
              value={statistics.success}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="上报失败"
              value={statistics.failed}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均成功率"
              value={statistics.avgSuccessRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: statistics.avgSuccessRate > 95 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        {/* 控制按钮和筛选 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择设备类型"
              value={selectedType}
              onChange={setSelectedType}
            >
              <Option value="all">全部设备</Option>
              <Option value="GNSS">GNSS</Option>
              <Option value="裂缝计">裂缝计</Option>
              <Option value="土压力计">土压力计</Option>
              <Option value="地下水">地下水</Option>
              <Option value="雨量计">雨量计</Option>
              <Option value="雷达">雷达</Option>
            </Select>
          </Col>
          <Col span={18}>
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleStartUpload}
              >
                开始上报
              </Button>
              <Button
                icon={<PauseCircleOutlined />}
                onClick={handleStopUpload}
              >
                暂停上报
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={handleSettings}
              >
                上报设置
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新数据
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
    </div>
  );
};

export default Console;
