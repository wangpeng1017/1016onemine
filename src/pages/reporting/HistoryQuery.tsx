import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  Select,
  Tag,
  Modal,
  Descriptions,
  message,
  Input,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface HistoryData {
  id: string;
  uploadTime: string;
  deviceType: string;
  deviceId: string;
  deviceName: string;
  dataType: string;
  dataSize: number;
  uploadStatus: 'success' | 'failed';
  responseTime: number;
  errorMessage?: string;
  retryCount: number;
}

const HistoryQuery: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HistoryData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryData | null>(null);

  // 模拟历史查询数据
  const mockData: HistoryData[] = [
    {
      id: '1',
      uploadTime: '2025-09-08 11:30:15',
      deviceType: 'GNSS',
      deviceId: 'GP-29',
      deviceName: 'GNSS监测点29号',
      dataType: '表面位移数据',
      dataSize: 2.5,
      uploadStatus: 'success',
      responseTime: 156,
      retryCount: 0,
    },
    {
      id: '2',
      uploadTime: '2025-09-08 11:25:32',
      deviceType: '裂缝计',
      deviceId: 'CG-001',
      deviceName: '裂缝计1号',
      dataType: '裂缝监测数据',
      dataSize: 1.8,
      uploadStatus: 'success',
      responseTime: 203,
      retryCount: 1,
    },
    {
      id: '3',
      uploadTime: '2025-09-08 11:20:45',
      deviceType: '土压力计',
      deviceId: 'EP-001',
      deviceName: '土压力计1号',
      dataType: '土压力数据',
      dataSize: 3.2,
      uploadStatus: 'failed',
      responseTime: 5000,
      errorMessage: '网络连接超时',
      retryCount: 3,
    },
    {
      id: '4',
      uploadTime: '2025-09-08 11:28:18',
      deviceType: '地下水',
      deviceId: 'GW-001',
      deviceName: '地下水监测点1号',
      dataType: '地下水数据',
      dataSize: 4.1,
      uploadStatus: 'success',
      responseTime: 189,
      retryCount: 0,
    },
    {
      id: '5',
      uploadTime: '2025-09-08 11:32:07',
      deviceType: '雨量计',
      deviceId: 'RG-001',
      deviceName: '雨量计1号',
      dataType: '降雨数据',
      dataSize: 1.2,
      uploadStatus: 'success',
      responseTime: 142,
      retryCount: 0,
    },
    {
      id: '6',
      uploadTime: '2025-09-08 11:15:23',
      deviceType: '雷达',
      deviceId: 'RD-001',
      deviceName: '雷达监测仪1号',
      dataType: '雷达监测数据',
      dataSize: 5.8,
      uploadStatus: 'failed',
      responseTime: 3500,
      errorMessage: '服务器内部错误',
      retryCount: 2,
    },
    {
      id: '7',
      uploadTime: '2025-09-08 11:10:56',
      deviceType: 'GNSS',
      deviceId: 'GP-30',
      deviceName: 'GNSS监测点30号',
      dataType: '表面位移数据',
      dataSize: 2.3,
      uploadStatus: 'success',
      responseTime: 178,
      retryCount: 0,
    },
    {
      id: '8',
      uploadTime: '2025-09-08 11:05:41',
      deviceType: '爆破振动',
      deviceId: 'BV-001',
      deviceName: '爆破振动仪1号',
      dataType: '振动数据',
      dataSize: 6.7,
      uploadStatus: 'success',
      responseTime: 234,
      retryCount: 0,
    },
  ];

  const columns: ColumnsType<HistoryData> = [
    {
      title: '上报时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 150,
      sorter: (a, b) => dayjs(a.uploadTime).unix() - dayjs(b.uploadTime).unix(),
    },
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
      title: '数据大小 (KB)',
      dataIndex: 'dataSize',
      key: 'dataSize',
      width: 120,
      render: (value: number) => value.toFixed(1),
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
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '响应时间 (ms)',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 120,
      render: (value: number) => (
        <span style={{ 
          color: value > 3000 ? '#ff4d4f' : value > 1000 ? '#faad14' : '#52c41a' 
        }}>
          {value}
        </span>
      ),
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 100,
      render: (value: number) => (
        <span style={{ color: value > 0 ? '#faad14' : '#52c41a' }}>
          {value}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
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
  }, []);

  const handleViewDetail = (record: HistoryData) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleExport = () => {
    message.success('数据导出功能开发中...');
  };

  const filteredData = data.filter(item => {
    if (selectedStatus !== 'all' && item.uploadStatus !== selectedStatus) {
      return false;
    }
    if (selectedType !== 'all' && item.deviceType !== selectedType) {
      return false;
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.uploadTime);
      return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
    }
    return true;
  });

  return (
    <div>
      <div className="page-title">数据上报 - 历史查询</div>
      
      <Card className="custom-card">
        {/* 查询条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择上报状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="all">全部状态</Option>
              <Option value="success">成功</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Col>
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
              <Option value="爆破振动">爆破振动</Option>
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
          <Col span={4}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={loadData}
                loading={loading}
              >
                查询
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
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

      {/* 详情模态框 */}
      <Modal
        title="上报详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="上报时间" span={2}>
              {selectedRecord.uploadTime}
            </Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {selectedRecord.deviceType}
            </Descriptions.Item>
            <Descriptions.Item label="设备编号">
              {selectedRecord.deviceId}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称" span={2}>
              {selectedRecord.deviceName}
            </Descriptions.Item>
            <Descriptions.Item label="数据类型">
              {selectedRecord.dataType}
            </Descriptions.Item>
            <Descriptions.Item label="数据大小">
              {selectedRecord.dataSize.toFixed(1)} KB
            </Descriptions.Item>
            <Descriptions.Item label="上报状态">
              <Tag color={selectedRecord.uploadStatus === 'success' ? 'green' : 'red'}>
                {selectedRecord.uploadStatus === 'success' ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="响应时间">
              {selectedRecord.responseTime} ms
            </Descriptions.Item>
            <Descriptions.Item label="重试次数">
              {selectedRecord.retryCount}
            </Descriptions.Item>
            {selectedRecord.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <span style={{ color: '#ff4d4f' }}>{selectedRecord.errorMessage}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default HistoryQuery;
