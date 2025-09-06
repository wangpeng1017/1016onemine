import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Descriptions,
  Tabs,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;

interface Device {
  key: string;
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  batteryLevel?: number;
  signalStrength?: number;
  installDate: string;
}

const DeviceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: Device[] = [
    {
      key: '1',
      id: 'DEV001',
      name: '雷达监测点-01',
      type: '雷达传感器',
      location: '边坡A区-上部',
      status: 'online',
      lastUpdate: '2024-01-15 14:30:25',
      batteryLevel: 85,
      signalStrength: 92,
      installDate: '2023-06-15',
    },
    {
      key: '2',
      id: 'DEV002',
      name: '土压力传感器-03',
      type: '压力传感器',
      location: '边坡B区-中部',
      status: 'online',
      lastUpdate: '2024-01-15 14:25:18',
      batteryLevel: 72,
      signalStrength: 88,
      installDate: '2023-07-20',
    },
    {
      key: '3',
      id: 'DEV003',
      name: '裂缝计-05',
      type: '裂缝监测仪',
      location: '岩体C区-底部',
      status: 'offline',
      lastUpdate: '2024-01-15 12:20:12',
      batteryLevel: 15,
      signalStrength: 0,
      installDate: '2023-08-10',
    },
    {
      key: '4',
      id: 'DEV004',
      name: '雨量计-02',
      type: '气象传感器',
      location: '监测站-顶部',
      status: 'online',
      lastUpdate: '2024-01-15 14:15:08',
      batteryLevel: 95,
      signalStrength: 95,
      installDate: '2023-05-30',
    },
    {
      key: '5',
      id: 'DEV005',
      name: '地下水位计-04',
      type: '水位传感器',
      location: '钻孔D-深度15m',
      status: 'maintenance',
      lastUpdate: '2024-01-15 10:10:05',
      batteryLevel: 60,
      signalStrength: 75,
      installDate: '2023-09-05',
    },
    {
      key: '6',
      id: 'DEV006',
      name: '摄像头-01',
      type: '监控设备',
      location: '边坡A区-观测点',
      status: 'online',
      lastUpdate: '2024-01-15 14:32:15',
      signalStrength: 90,
      installDate: '2023-04-12',
    },
  ];

  const statusConfig = {
    online: { color: 'green', text: '在线' },
    offline: { color: 'red', text: '离线' },
    maintenance: { color: 'orange', text: '维护中' },
  };

  const columns: ColumnsType<Device> = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 160,
    },
    {
      title: '电池电量',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      width: 100,
      render: (level?: number) => {
        if (level === undefined) return '-';
        const color = level > 50 ? '#52c41a' : level > 20 ? '#faad14' : '#ff4d4f';
        return <span style={{ color }}>{level}%</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (device: Device) => {
    setSelectedDevice(device);
    setDetailVisible(true);
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    form.setFieldsValue(device);
    setEditVisible(true);
  };

  const handleDelete = (device: Device) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除设备 ${device.name} 吗？`,
      onOk() {
        console.log('删除设备:', device.id);
      },
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedDevice(null);
    setEditVisible(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('保存设备信息:', values);
      setEditVisible(false);
    });
  };

  const getFilteredData = () => {
    if (activeTab === 'all') return mockData;
    return mockData.filter(device => {
      switch (activeTab) {
        case 'sensor':
          return ['雷达传感器', '压力传感器', '裂缝监测仪', '气象传感器', '水位传感器'].includes(device.type);
        case 'camera':
          return device.type === '监控设备';
        default:
          return true;
      }
    });
  };

  return (
    <div>
      <div className="page-title">设备管理</div>
      
      {/* 设备统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={28}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={24}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="维护中"
              value={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="请输入设备名称"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select placeholder="设备类型" style={{ width: '100%' }}>
              <Option value="radar">雷达传感器</Option>
              <Option value="pressure">压力传感器</Option>
              <Option value="crack">裂缝监测仪</Option>
              <Option value="weather">气象传感器</Option>
              <Option value="water">水位传感器</Option>
              <Option value="camera">监控设备</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="设备状态" style={{ width: '100%' }}>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增设备
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 设备列表 */}
      <Card className="custom-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部设备" key="all" />
          <TabPane tab="传感器设备" key="sensor" />
          <TabPane tab="监控设备" key="camera" />
        </Tabs>
        <Table
          columns={columns}
          dataSource={getFilteredData()}
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

      {/* 设备详情弹窗 */}
      <Modal
        title="设备详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedDevice && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备ID">
              {selectedDevice.id}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称">
              {selectedDevice.name}
            </Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {selectedDevice.type}
            </Descriptions.Item>
            <Descriptions.Item label="安装位置">
              {selectedDevice.location}
            </Descriptions.Item>
            <Descriptions.Item label="设备状态">
              <Tag color={statusConfig[selectedDevice.status].color}>
                {statusConfig[selectedDevice.status].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="安装日期">
              {selectedDevice.installDate}
            </Descriptions.Item>
            <Descriptions.Item label="最后更新">
              {selectedDevice.lastUpdate}
            </Descriptions.Item>
            {selectedDevice.batteryLevel && (
              <Descriptions.Item label="电池电量">
                {selectedDevice.batteryLevel}%
              </Descriptions.Item>
            )}
            {selectedDevice.signalStrength && (
              <Descriptions.Item label="信号强度">
                {selectedDevice.signalStrength}%
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 编辑设备弹窗 */}
      <Modal
        title={selectedDevice ? '编辑设备' : '新增设备'}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="雷达传感器">雷达传感器</Option>
                  <Option value="压力传感器">压力传感器</Option>
                  <Option value="裂缝监测仪">裂缝监测仪</Option>
                  <Option value="气象传感器">气象传感器</Option>
                  <Option value="水位传感器">水位传感器</Option>
                  <Option value="监控设备">监控设备</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="location"
            label="安装位置"
            rules={[{ required: true, message: '请输入安装位置' }]}
          >
            <Input placeholder="请输入安装位置" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="设备状态">
                <Select placeholder="请选择设备状态">
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="installDate" label="安装日期">
                <Input placeholder="请输入安装日期" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceManagement;
