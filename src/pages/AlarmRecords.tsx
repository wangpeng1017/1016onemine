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
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
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
  const [addEditVisible, setAddEditVisible] = useState(false);
  const [gisVisible, setGisVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AlarmRecord | null>(null);
  const [handleForm] = Form.useForm();
  const [addEditForm] = Form.useForm();

  // 筛选状态
  const [searchDevice, setSearchDevice] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  // 数据状态
  const [alarmData, setAlarmData] = useState<AlarmRecord[]>([
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
      id: 'ALM005',
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
    {
      key: '6',
      id: 'ALM006',
      deviceName: '土压力传感器-05',
      deviceId: 'DEV006',
      alarmType: '压力突变',
      level: 'high',
      alarmTime: '2024-01-15 09:30:45',
      status: 'resolved',
      description: '土压力值在短时间内突然上升',
      currentValue: 145.8,
      thresholdValue: 130.0,
      unit: 'kPa',
      location: '边坡B区-上部',
      coordinates: '116.234888, 39.765555',
      handler: '王工程师',
      handleTime: '2024-01-15 10:15:00',
      handleNote: '已确认为施工负载引起，现已恢复正常',
    },
    {
      key: '7',
      id: 'ALM007',
      deviceName: '雷达监测点-03',
      deviceId: 'DEV007',
      alarmType: '位移累计超限',
      level: 'critical',
      alarmTime: '2024-01-15 08:45:20',
      status: 'pending',
      description: '监测点累计位移超过危险阈值',
      currentValue: 85.2,
      thresholdValue: 80.0,
      unit: 'mm',
      location: '边坡A区-底部',
      coordinates: '116.125678, 39.656789',
    },
    {
      key: '8',
      id: 'ALM008',
      deviceName: '裂缝计-07',
      deviceId: 'DEV008',
      alarmType: '裂缝容变增大',
      level: 'medium',
      alarmTime: '2024-01-15 07:20:15',
      status: 'resolved',
      description: '裂缝宽度持续增大',
      currentValue: 15.5,
      thresholdValue: 15.0,
      unit: 'mm',
      location: '岩体C区-上部',
      coordinates: '116.346789, 39.877654',
      handler: '刘技术员',
      handleTime: '2024-01-15 09:00:00',
      handleNote: '现场检查，裂缝已稳定',
    },
    {
      key: '9',
      id: 'ALM009',
      deviceName: '摄像头-02',
      deviceId: 'DEV009',
      alarmType: '设备故障',
      level: 'low',
      alarmTime: '2024-01-15 06:15:30',
      status: 'resolved',
      description: '监控设备图像模糊',
      currentValue: 0,
      thresholdValue: 0,
      unit: '',
      location: '边坡A区-监控点',
      coordinates: '116.124567, 39.655432',
      handler: '陈维修',
      handleTime: '2024-01-15 08:00:00',
      handleNote: '清洁镜头，问题解决',
    },
    {
      key: '10',
      id: 'ALM010',
      deviceName: '雨量计-03',
      deviceId: 'DEV010',
      alarmType: '极端天气预警',
      level: 'high',
      alarmTime: '2024-01-15 05:30:00',
      status: 'processing',
      description: '预计未来将有强降雨',
      currentValue: 45.0,
      thresholdValue: 40.0,
      unit: 'mm',
      location: '监测站-北侧',
      coordinates: '116.457890, 39.988765',
      handler: '黄工程师',
      handleTime: '2024-01-15 06:00:00',
      handleNote: '已启动应急预案，持续监控',
    },
  ]);

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

  const getFilteredData = () => {
    let filtered = alarmData;

    if (searchDevice) {
      filtered = filtered.filter(record => 
        record.deviceName.toLowerCase().includes(searchDevice.toLowerCase())
      );
    }

    if (filterLevel) {
      filtered = filtered.filter(record => record.level === filterLevel);
    }

    if (filterStatus) {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    return filtered;
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleResetFilter = () => {
    setSearchDevice('');
    setFilterLevel(undefined);
    setFilterStatus(undefined);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    addEditForm.resetFields();
    setAddEditVisible(true);
  };

  const handleEditAlarm = (record: AlarmRecord) => {
    setSelectedRecord(record);
    addEditForm.setFieldsValue({
      deviceName: record.deviceName,
      deviceId: record.deviceId,
      alarmType: record.alarmType,
      level: record.level,
      description: record.description,
      currentValue: record.currentValue,
      thresholdValue: record.thresholdValue,
      unit: record.unit,
      location: record.location,
      coordinates: record.coordinates,
    });
    setAddEditVisible(true);
  };

  const handleDeleteAlarm = (record: AlarmRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除告警记录 ${record.id} 吗？`,
      onOk() {
        setAlarmData(prev => prev.filter(a => a.key !== record.key));
        message.success('告警记录删除成功');
      },
    });
  };

  const handleSaveAlarm = () => {
    addEditForm.validateFields().then(values => {
      if (selectedRecord) {
        // 编辑
        setAlarmData(prev => prev.map(item => 
          item.key === selectedRecord.key ? { ...item, ...values } : item
        ));
        message.success('告警记录更新成功');
      } else {
        // 新增
        const newAlarm: AlarmRecord = {
          key: String(alarmData.length + 1),
          id: `ALM${String(alarmData.length + 1).padStart(3, '0')}`,
          ...values,
          alarmTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          status: 'pending' as const,
        };
        setAlarmData(prev => [newAlarm, ...prev]);
        message.success('告警记录添加成功');
      }
      setAddEditVisible(false);
    });
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
      width: 260,
      fixed: 'right',
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
            onClick={() => handleEditAlarm(record)}
          >
            编辑
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
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAlarm(record)}
          >
            删除
          </Button>
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
        <Row gutter={16} align="middle">
          <Col span={5}>
            <Input
              placeholder="请输入设备名称"
              prefix={<SearchOutlined />}
              value={searchDevice}
              onChange={(e) => setSearchDevice(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Select 
              placeholder="告警级别" 
              style={{ width: '100%' }}
              value={filterLevel}
              onChange={setFilterLevel}
              allowClear
            >
              <Option value="low">低级</Option>
              <Option value="medium">中级</Option>
              <Option value="high">高级</Option>
              <Option value="critical">紧急</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="处理状态" 
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
            >
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
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleResetFilter}>
                重置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 告警表格 */}
      <Card 
        className="custom-card"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增告警
          </Button>
        }
      >
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={selectedRecord ? '编辑告警记录' : '新增告警记录'}
        open={addEditVisible}
        onCancel={() => setAddEditVisible(false)}
        onOk={handleSaveAlarm}
        width={700}
      >
        <Form form={addEditForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceId"
                label="设备ID"
                rules={[{ required: true, message: '请输入设备ID' }]}
              >
                <Input placeholder="请输入设备ID" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="alarmType"
                label="告警类型"
                rules={[{ required: true, message: '请输入告警类型' }]}
              >
                <Input placeholder="请输入告警类型" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="告警级别"
                rules={[{ required: true, message: '请选择告警级别' }]}
              >
                <Select placeholder="请选择告警级别">
                  <Option value="low">低级</Option>
                  <Option value="medium">中级</Option>
                  <Option value="high">高级</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="告警描述"
            rules={[{ required: true, message: '请输入告警描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入告警描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="currentValue"
                label="当前值"
                rules={[{ required: true, message: '请输入当前值' }]}
              >
                <Input type="number" placeholder="请输入当前值" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="thresholdValue"
                label="阈值"
                rules={[{ required: true, message: '请输入阈值' }]}
              >
                <Input type="number" placeholder="请输入阈值" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="单位">
                <Input placeholder="请输入单位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="位置"
                rules={[{ required: true, message: '请输入位置' }]}
              >
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coordinates"
                label="坐标"
                rules={[{ required: true, message: '请输入坐标' }]}
              >
                <Input placeholder="例如：116.123456, 39.654321" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AlarmRecords;
