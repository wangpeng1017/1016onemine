import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Modal,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DataRecord {
  key: string;
  id: string;
  deviceName: string;
  dataType: string;
  uploadTime: string;
  status: 'success' | 'failed' | 'pending';
  dataSize: string;
  description: string;
}

const DataReporting: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);

  // 模拟数据
  const mockData: DataRecord[] = [
    {
      key: '1',
      id: 'DR001',
      deviceName: '雷达监测点-01',
      dataType: '位移数据',
      uploadTime: '2024-01-15 14:30:25',
      status: 'success',
      dataSize: '2.5MB',
      description: '边坡位移监测数据',
    },
    {
      key: '2',
      id: 'DR002',
      deviceName: '土压力传感器-03',
      dataType: '压力数据',
      uploadTime: '2024-01-15 14:25:18',
      status: 'success',
      dataSize: '1.8MB',
      description: '土体压力监测数据',
    },
    {
      key: '3',
      id: 'DR003',
      deviceName: '裂缝计-05',
      dataType: '裂缝数据',
      uploadTime: '2024-01-15 14:20:12',
      status: 'failed',
      dataSize: '0.9MB',
      description: '岩体裂缝监测数据',
    },
    {
      key: '4',
      id: 'DR004',
      deviceName: '雨量计-02',
      dataType: '降雨数据',
      uploadTime: '2024-01-15 14:15:08',
      status: 'pending',
      dataSize: '0.5MB',
      description: '降雨量监测数据',
    },
    {
      key: '5',
      id: 'DR005',
      deviceName: '地下水位计-04',
      dataType: '水位数据',
      uploadTime: '2024-01-15 14:10:05',
      status: 'success',
      dataSize: '1.2MB',
      description: '地下水位监测数据',
    },
  ];

  const columns: ColumnsType<DataRecord> = [
    {
      title: '数据ID',
      dataIndex: 'id',
      key: 'id',
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
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功' },
          failed: { color: 'red', text: '失败' },
          pending: { color: 'orange', text: '处理中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '数据大小',
      dataIndex: 'dataSize',
      key: 'dataSize',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button type="link" icon={<DownloadOutlined />}>
            下载
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (record: DataRecord) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="page-title">数据上报</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日上报总数"
              value={156}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功上报"
              value={142}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败上报"
              value={8}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={6}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="请输入设备名称"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Select placeholder="请选择数据类型" style={{ width: '100%' }}>
              <Option value="displacement">位移数据</Option>
              <Option value="pressure">压力数据</Option>
              <Option value="crack">裂缝数据</Option>
              <Option value="rainfall">降雨数据</Option>
              <Option value="water">水位数据</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card className="custom-card">
        <Table
          columns={columns}
          dataSource={mockData}
          loading={loading}
          pagination={{
            total: 50,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          className="custom-table"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="数据详情"
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
            <Descriptions.Item label="数据ID">
              {selectedRecord.id}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称">
              {selectedRecord.deviceName}
            </Descriptions.Item>
            <Descriptions.Item label="数据类型">
              {selectedRecord.dataType}
            </Descriptions.Item>
            <Descriptions.Item label="上传时间">
              {selectedRecord.uploadTime}
            </Descriptions.Item>
            <Descriptions.Item label="数据大小">
              {selectedRecord.dataSize}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={
                  selectedRecord.status === 'success'
                    ? 'green'
                    : selectedRecord.status === 'failed'
                    ? 'red'
                    : 'orange'
                }
              >
                {selectedRecord.status === 'success'
                  ? '成功'
                  : selectedRecord.status === 'failed'
                  ? '失败'
                  : '处理中'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedRecord.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DataReporting;
