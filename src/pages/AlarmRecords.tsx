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
  Alert,
  Form,
  message,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AlarmRecord {
  key: string;
  id: string;
  deviceName: string;
  deviceId: string;
  alarmType: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  alarmTime: string;
  status: 'pending' | 'processing' | 'resolved';
  description: string;
  currentValue: number;
  thresholdValue: number;
  unit: string;
  location: string;
  coordinates: string;
  handler?: string;
  handleTime?: string;
  handleNote?: string;
}

const AlarmRecords: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [handleVisible, setHandleVisible] = useState(false);
  const [gisVisible, setGisVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AlarmRecord | null>(null);
  const [handleForm] = Form.useForm();

  // 模拟数据
  const mockData: AlarmRecord[] = [
    {
      key: '1',
      id: 'ALM001',
      deviceName: '雷达监测点-01',
      deviceId: 'DEV001',
      alarmType: '位移速率超限',
      level: 'high',
      alarmTime: '2024-01-15 14:30:25',
      status: 'pending',
      description: '监测点位移速率超过预警阈值',
      currentValue: 12.5,
      thresholdValue: 10.0,
      unit: 'mm/h',
      location: '边坡A区-上部',
      coordinates: '116.123456, 39.654321',
    },
    {
      key: '2',
      id: 'ALM002',
      deviceName: '土压力传感器-03',
      deviceId: 'DEV002',
      alarmType: '压力异常',
      level: 'medium',
      alarmTime: '2024-01-15 13:45:18',
      status: 'processing',
      description: '土压力值超出正常范围',
      currentValue: 135.2,
      thresholdValue: 120.0,
      unit: 'kPa',
      location: '边坡B区-中部',
      coordinates: '116.234567, 39.765432',
      handler: '张工程师',
      handleTime: '2024-01-15 14:00:00',
      handleNote: '正在现场检查设备状态',
    },
    {
      key: '3',
      id: 'ALM003',
      deviceName: '裂缝计-05',
      deviceId: 'DEV003',
      alarmType: '设备离线',
      level: 'critical',
      alarmTime: '2024-01-15 12:20:12',
      status: 'resolved',
      description: '设备通信中断，无法获取数据',
      currentValue: 0,
      thresholdValue: 0,
      unit: '',
      location: '岩体C区-底部',
      coordinates: '116.345678, 39.876543',
      handler: '李技术员',
      handleTime: '2024-01-15 13:30:00',
      handleNote: '已更换通信模块，设备恢复正常',
    },
    {
      key: '4',
      id: 'AL004',
      deviceName: '雨量计-02',
      deviceId: 'DEV004',
      alarmType: '降雨预警',
      level: 'low',
      alarmTime: '2024-01-15 11:15:08',
      status: 'resolved',
      description: '降雨量达到预警级别',
      currentValue: 25.5,
      thresholdValue: 25.0,
      unit: 'mm/h',
      location: '边坡D区-下部',
      coordinates: '116.456789, 39.987654',
    },
    {
      key: '5',
      id: 'AL005',
      deviceName: '地下水位计-04',
      deviceId: 'DEV005',
      alarmType: '水位异常',
      level: 'medium',
      alarmTime: '2024-01-15 10:10:05',
      status: 'processing',
      description: '地下水位快速上升',
      currentValue: 12.8,
      thresholdValue: 12.0,
      unit: 'm',
      location: '岩体E区-中部',
      coordinates: '116.567890, 40.098765',
    },
  ];

  const levelConfig = {
    low: { color: 'blue', text: '低级' },
    medium: { color: 'orange', text: '中级' },
    high: { color: 'red', text: '高级' },
    critical: { color: 'purple', text: '紧急' },
  };

  const statusConfig = {
    pending: { color: 'default', text: '待处理' },
    processing: { color: 'processing', text: '处理中' },
    resolved: { color: 'success', text: '已处理' },
  };

  const columns: ColumnsType<AlarmRecord> = [
    {
      title: '告警ID',
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
      title: '告警类型',
      dataIndex: 'alarmType',
      key: 'alarmType',
      width: 120,
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const config = levelConfig[level as keyof typeof levelConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      key: 'alarmTime',
      width: 160,
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
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
            icon={<EnvironmentOutlined />}
            onClick={() => handleGISLocation(record)}
          >
            定位
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              onClick={() => handleAlarmProcess(record)}
            >
              处理
            </Button>
          )}
          {record.status === 'processing' && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(record)}
            >
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetail = (record: AlarmRecord) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleAlarmProcess = (record: AlarmRecord) => {
    setSelectedRecord(record);
    handleForm.resetFields();
    setHandleVisible(true);
  };

  const handleGISLocation = (record: AlarmRecord) => {
    setSelectedRecord(record);
    setGisVisible(true);
  };

  const handleAlarmAction = (action: 'accept' | 'reject' | 'resolve') => {
    if (!selectedRecord) return;
    
    handleForm.validateFields().then((values: any) => {
      console.log('处理告警:', {
        alarmId: selectedRecord.id,
        action,
        ...values
      });
      
      // 更新告警状态
      const newStatus = action === 'accept' ? 'processing' : action === 'resolve' ? 'resolved' : 'pending';
      message.success(`告警${action === 'accept' ? '已接受' : action === 'resolve' ? '已解决' : '已拒绝'}`);
      
      setHandleVisible(false);
    });
  };

  const handleProcess = (record: AlarmRecord) => {
    Modal.confirm({
      title: '确认处理',
      content: `确定要处理告警 ${record.id} 吗？`,
      onOk() {
        console.log('开始处理告警:', record.id);
      },
    });
  };

  const handleResolve = (record: AlarmRecord) => {
    Modal.confirm({
      title: '确认完成',
      content: `确定告警 ${record.id} 已处理完成吗？`,
      onOk() {
        console.log('完成处理告警:', record.id);
      },
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="page-title">告警记录</div>
      
      {/* 告警统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日告警总数"
              value={28}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={5}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={8}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已处理"
              value={15}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 紧急告警提示 */}
      <Alert
        message="紧急告警"
        description="检测到1个紧急告警，请立即处理！"
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" danger>
            立即处理
          </Button>
        }
      />

      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={5}>
            <Input
              placeholder="请输入设备名称"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select placeholder="告警级别" style={{ width: '100%' }}>
              <Option value="low">低级</Option>
              <Option value="medium">中级</Option>
              <Option value="high">高级</Option>
              <Option value="critical">紧急</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="处理状态" style={{ width: '100%' }}>
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="resolved">已处理</Option>
            </Select>
          </Col>
          <Col span={7}>
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

      {/* 告警表格 */}
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
        title="告警详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="告警ID">
              {selectedRecord.id}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称">
              {selectedRecord.deviceName}
            </Descriptions.Item>
            <Descriptions.Item label="告警类型">
              {selectedRecord.alarmType}
            </Descriptions.Item>
            <Descriptions.Item label="告警级别">
              <Tag color={levelConfig[selectedRecord.level].color}>
                {levelConfig[selectedRecord.level].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="告警时间">
              {selectedRecord.alarmTime}
            </Descriptions.Item>
            <Descriptions.Item label="处理状态">
              <Tag color={statusConfig[selectedRecord.status].color}>
                {statusConfig[selectedRecord.status].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="当前值">
              {selectedRecord.currentValue} {selectedRecord.unit}
            </Descriptions.Item>
            <Descriptions.Item label="阈值">
              {selectedRecord.thresholdValue} {selectedRecord.unit}
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

export default AlarmRecords;
