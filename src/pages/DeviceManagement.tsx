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
  DatePicker,
  Timeline,
  Badge,
  Progress,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  ToolOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
  maintenanceRecords?: MaintenanceRecord[];
  faultRecords?: FaultRecord[];
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'upgrade';
  description: string;
  technician: string;
  status: 'completed' | 'pending' | 'cancelled';
  cost?: number;
}

interface FaultRecord {
  id: string;
  reportTime: string;
  faultType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  resolveTime?: string;
  solution?: string;
}

const DeviceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [maintenanceVisible, setMaintenanceVisible] = useState(false);
  const [faultVisible, setFaultVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [detailTab, setDetailTab] = useState('info');
  const [form] = Form.useForm();
  const [maintenanceForm] = Form.useForm();
  const [faultForm] = Form.useForm();

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
      maintenanceRecords: [
        {
          id: 'M001',
          date: '2025-01-10',
          type: 'routine',
          description: '定期检查雷达天线和信号质量',
          technician: '张维修',
          status: 'completed',
          cost: 200
        },
        {
          id: 'M002',
          date: '2024-12-15',
          type: 'repair',
          description: '更换电池模块',
          technician: '李技师',
          status: 'completed',
          cost: 800
        }
      ],
      faultRecords: [
        {
          id: 'F001',
          reportTime: '2024-11-20 14:30:00',
          faultType: '信号异常',
          severity: 'medium',
          description: '雷达信号强度下降，可能是天线松动',
          status: 'resolved',
          resolveTime: '2024-11-21 10:00:00',
          solution: '重新固定天线，调整角度'
        }
      ]
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
            icon={<ToolOutlined />}
            onClick={() => handleMaintenance(record)}
          >
            维护
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

  const handleMaintenance = (device: Device) => {
    setSelectedDevice(device);
    maintenanceForm.resetFields();
    setMaintenanceVisible(true);
  };

  const handleFault = (device: Device) => {
    setSelectedDevice(device);
    faultForm.resetFields();
    setFaultVisible(true);
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
        case 'radar':
          return device.type === '雷达传感器';
        case 'sensor':
          return ['压力传感器', '裂缝监测仪', '气象传感器', '水位传感器'].includes(device.type);
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
          <TabPane tab="雷达设备" key="radar" />
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
        width={900}
      >
        {selectedDevice && (
          <Tabs activeKey={detailTab} onChange={setDetailTab}>
            <TabPane tab="基本信息" key="info">
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
                    <Progress 
                      percent={selectedDevice.batteryLevel} 
                      size="small"
                      status={selectedDevice.batteryLevel > 20 ? 'active' : 'exception'}
                    />
                  </Descriptions.Item>
                )}
                {selectedDevice.signalStrength && (
                  <Descriptions.Item label="信号强度">
                    <Progress 
                      percent={selectedDevice.signalStrength} 
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </Descriptions.Item>
                )}
              </Descriptions>
            </TabPane>
            
            <TabPane tab="维护记录" key="maintenance">
              <div style={{ marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => handleMaintenance(selectedDevice)}
                >
                  新增维护记录
                </Button>
              </div>
              <Timeline>
                {selectedDevice.maintenanceRecords?.map(record => (
                  <Timeline.Item
                    key={record.id}
                    dot={
                      record.status === 'completed' ? 
                        <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                        record.status === 'pending' ?
                          <ClockCircleOutlined style={{ color: '#1890ff' }} /> :
                          <WarningOutlined style={{ color: '#faad14' }} />
                    }
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {record.type === 'routine' ? '例行维护' : 
                         record.type === 'repair' ? '故障维修' : '设备升级'}
                        <Tag 
                          color={
                            record.status === 'completed' ? 'green' :
                            record.status === 'pending' ? 'blue' : 'orange'
                          }
                          style={{ marginLeft: 8 }}
                        >
                          {record.status === 'completed' ? '已完成' :
                           record.status === 'pending' ? '进行中' : '已取消'}
                        </Tag>
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        {record.date} | 技术员: {record.technician}
                        {record.cost && ` | 费用: ¥${record.cost}`}
                      </div>
                      <div style={{ marginTop: 4 }}>{record.description}</div>
                    </div>
                  </Timeline.Item>
                )) || <div style={{ textAlign: 'center', color: '#999' }}>暂无维护记录</div>}
              </Timeline>
            </TabPane>
            
            <TabPane tab="故障记录" key="fault">
              <div style={{ marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => handleFault(selectedDevice)}
                >
                  报告故障
                </Button>
              </div>
              <Timeline>
                {selectedDevice.faultRecords?.map(record => (
                  <Timeline.Item
                    key={record.id}
                    dot={
                      record.status === 'resolved' ? 
                        <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                        record.status === 'in_progress' ?
                          <ClockCircleOutlined style={{ color: '#1890ff' }} /> :
                          <WarningOutlined style={{ color: '#ff4d4f' }} />
                    }
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {record.faultType}
                        <Tag 
                          color={
                            record.severity === 'critical' ? 'red' :
                            record.severity === 'high' ? 'orange' :
                            record.severity === 'medium' ? 'yellow' : 'blue'
                          }
                          style={{ marginLeft: 8 }}
                        >
                          {record.severity === 'critical' ? '严重' :
                           record.severity === 'high' ? '高' :
                           record.severity === 'medium' ? '中' : '低'}
                        </Tag>
                        <Tag 
                          color={
                            record.status === 'resolved' ? 'green' :
                            record.status === 'in_progress' ? 'blue' : 'red'
                          }
                          style={{ marginLeft: 4 }}
                        >
                          {record.status === 'resolved' ? '已解决' :
                           record.status === 'in_progress' ? '处理中' : '待处理'}
                        </Tag>
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        报告时间: {record.reportTime}
                        {record.resolveTime && ` | 解决时间: ${record.resolveTime}`}
                      </div>
                      <div style={{ marginTop: 4 }}>{record.description}</div>
                      {record.solution && (
                        <div style={{ marginTop: 4, padding: 8, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                          <strong>解决方案:</strong> {record.solution}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                )) || <div style={{ textAlign: 'center', color: '#999' }}>暂无故障记录</div>}
              </Timeline>
            </TabPane>
          </Tabs>
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

      {/* 维护记录弹窗 */}
      <Modal
        title="新增维护记录"
        open={maintenanceVisible}
        onCancel={() => setMaintenanceVisible(false)}
        onOk={() => {
          maintenanceForm.validateFields().then(values => {
            console.log('新增维护记录:', values);
            setMaintenanceVisible(false);
          });
        }}
        width={600}
      >
        <Form form={maintenanceForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="维护类型"
                rules={[{ required: true, message: '请选择维护类型' }]}
              >
                <Select placeholder="请选择维护类型">
                  <Option value="routine">例行维护</Option>
                  <Option value="repair">故障维修</Option>
                  <Option value="upgrade">设备升级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="维护日期"
                rules={[{ required: true, message: '请选择维护日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="维护描述"
            rules={[{ required: true, message: '请输入维护描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细描述维护内容" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="technician"
                label="技术员"
                rules={[{ required: true, message: '请输入技术员姓名' }]}
              >
                <Input placeholder="请输入技术员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cost" label="维护费用">
                <Input placeholder="请输入维护费用" addonAfter="元" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="维护状态" initialValue="pending">
            <Select>
              <Option value="pending">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 故障记录弹窗 */}
      <Modal
        title="报告故障"
        open={faultVisible}
        onCancel={() => setFaultVisible(false)}
        onOk={() => {
          faultForm.validateFields().then(values => {
            console.log('新增故障记录:', values);
            setFaultVisible(false);
          });
        }}
        width={600}
      >
        <Form form={faultForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="faultType"
                label="故障类型"
                rules={[{ required: true, message: '请输入故障类型' }]}
              >
                <Input placeholder="请输入故障类型" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="严重程度"
                rules={[{ required: true, message: '请选择严重程度' }]}
              >
                <Select placeholder="请选择严重程度">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="故障描述"
            rules={[{ required: true, message: '请输入故障描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细描述故障现象和可能原因" />
          </Form.Item>
          <Form.Item name="status" label="处理状态" initialValue="open">
            <Select>
              <Option value="open">待处理</Option>
              <Option value="in_progress">处理中</Option>
              <Option value="resolved">已解决</Option>
            </Select>
          </Form.Item>
          <Form.Item name="solution" label="解决方案">
            <Input.TextArea rows={2} placeholder="如已解决，请输入解决方案" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceManagement;
