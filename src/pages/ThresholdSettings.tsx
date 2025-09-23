import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
  Modal,
  message,
  Divider,
  Statistic,
  Select,
  Switch,
  Tooltip,
  Alert,
  Progress,
  Timeline,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  SettingOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';



interface ThresholdRule {
  key: string;
  id: string;
  deviceType: string;
  deviceCategory: 'displacement' | 'pressure' | 'crack' | 'water' | 'rainfall' | 'vibration';
  parameter: string;
  // 四级阈值：正常、注意、预警、危险
  normalMin?: number;
  normalMax?: number;
  attentionMin?: number;
  attentionMax?: number;
  warningMin?: number;
  warningMax?: number;
  dangerMin?: number;
  dangerMax?: number;
  unit: string;
  status: 'active' | 'inactive';
  appliedDevices: number; // 应用此规则的设备数量
  alertsToday: number; // 今日基于此规则的告警数
  effectiveness: number; // 规则有效性评分 (0-100)
  updateTime: string;
  updateBy: string;
}

interface DeviceStatus {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  category: string;
  currentValue: number;
  unit: string;
  thresholdLevel: 'normal' | 'attention' | 'warning' | 'danger';
  lastUpdate: string;
  isOnline: boolean;
}

interface ThresholdHistory {
  id: string;
  ruleId: string;
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  oldValues?: any;
  newValues?: any;
  operator: string;
  timestamp: string;
  reason?: string;
}

const ThresholdSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rules');
  const [deviceCategory, setDeviceCategory] = useState<string>('displacement');
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ThresholdRule | null>(null);
  const [form] = Form.useForm();
  const [ruleForm] = Form.useForm();
  const [realTimeData, setRealTimeData] = useState<DeviceStatus[]>([]);

  // 模拟阈值规则数据
  const mockRules: ThresholdRule[] = [
    {
      key: '1',
      id: 'RULE001',
      deviceType: '雷达传感器',
      deviceCategory: 'displacement',
      parameter: '位移速率',
      normalMin: 0,
      normalMax: 5,
      attentionMin: 5,
      attentionMax: 8,
      warningMin: 8,
      warningMax: 12,
      dangerMin: 12,
      dangerMax: undefined,
      unit: 'mm/h',
      status: 'active',
      appliedDevices: 8,
      alertsToday: 2,
      effectiveness: 85,
      updateTime: '2024-01-15 10:30:00',
      updateBy: '系统管理员',
    },
    {
      key: '2',
      id: 'RULE002',
      deviceType: '土压力传感器',
      deviceCategory: 'pressure',
      parameter: '压力值',
      normalMin: 90,
      normalMax: 110,
      attentionMin: 80,
      attentionMax: 120,
      warningMin: 70,
      warningMax: 130,
      dangerMin: 60,
      dangerMax: 150,
      unit: 'kPa',
      status: 'active',
      appliedDevices: 12,
      alertsToday: 5,
      effectiveness: 92,
      updateTime: '2024-01-14 15:20:00',
      updateBy: '张工程师',
    },
    {
      key: '3',
      id: 'RULE003',
      deviceType: '裂缝计',
      deviceCategory: 'crack',
      parameter: '裂缝宽度',
      normalMin: 0,
      normalMax: 1,
      attentionMin: 1,
      attentionMax: 2,
      warningMin: 2,
      warningMax: 4,
      dangerMin: 4,
      dangerMax: undefined,
      unit: 'mm',
      status: 'active',
      appliedDevices: 15,
      alertsToday: 1,
      effectiveness: 78,
      updateTime: '2024-01-13 09:45:00',
      updateBy: '李技术员',
    },
    {
      key: '4',
      id: 'RULE004',
      deviceType: '地下水位计',
      deviceCategory: 'water',
      parameter: '水位深度',
      normalMin: 10,
      normalMax: 12,
      attentionMin: 8,
      attentionMax: 15,
      warningMin: 5,
      warningMax: 18,
      dangerMin: 3,
      dangerMax: 20,
      unit: 'm',
      status: 'active',
      appliedDevices: 6,
      alertsToday: 0,
      effectiveness: 95,
      updateTime: '2024-01-12 14:10:00',
      updateBy: '王监理',
    },
    {
      key: '5',
      id: 'RULE005',
      deviceType: '爆破振动监测仪',
      deviceCategory: 'vibration',
      parameter: '振动速度',
      normalMin: 0,
      normalMax: 1.0,
      attentionMin: 1.0,
      attentionMax: 2.0,
      warningMin: 2.0,
      warningMax: 4.0,
      dangerMin: 4.0,
      dangerMax: undefined,
      unit: 'mm/s',
      status: 'inactive',
      appliedDevices: 4,
      alertsToday: 0,
      effectiveness: 60,
      updateTime: '2024-01-10 11:25:00',
      updateBy: '赵专家',
    },
  ];

  // 模拟实时设备状态数据
  const mockDeviceStatus: DeviceStatus[] = [
    {
      deviceId: 'DEV001',
      deviceName: '雷达监测点-01',
      deviceType: '雷达传感器',
      category: 'displacement',
      currentValue: 3.2,
      unit: 'mm/h',
      thresholdLevel: 'normal',
      lastUpdate: '2024-01-15 15:30:25',
      isOnline: true,
    },
    {
      deviceId: 'DEV002',
      deviceName: '土压力传感器-03',
      deviceType: '土压力传感器',
      category: 'pressure',
      currentValue: 125.5,
      unit: 'kPa',
      thresholdLevel: 'attention',
      lastUpdate: '2024-01-15 15:28:18',
      isOnline: true,
    },
    {
      deviceId: 'DEV003',
      deviceName: '裂缝计-05',
      deviceType: '裂缝计',
      category: 'crack',
      currentValue: 1.8,
      unit: 'mm',
      thresholdLevel: 'normal',
      lastUpdate: '2024-01-15 15:25:12',
      isOnline: false,
    },
    {
      deviceId: 'DEV004',
      deviceName: '地下水位计-02',
      deviceType: '地下水位计',
      category: 'water',
      currentValue: 11.2,
      unit: 'm',
      thresholdLevel: 'normal',
      lastUpdate: '2024-01-15 15:29:45',
      isOnline: true,
    },
  ];

  // 模拟阈值历史记录
  const mockHistory: ThresholdHistory[] = [
    {
      id: 'HIS001',
      ruleId: 'RULE001',
      action: 'update',
      oldValues: { warningMax: 10 },
      newValues: { warningMax: 12 },
      operator: '系统管理员',
      timestamp: '2024-01-15 10:30:00',
      reason: '根据近期监测数据调整预警上限',
    },
    {
      id: 'HIS002',
      ruleId: 'RULE002',
      action: 'create',
      newValues: { normalMin: 90, normalMax: 110 },
      operator: '张工程师',
      timestamp: '2024-01-14 15:20:00',
      reason: '新增土压力监测阈值规则',
    },
    {
      id: 'HIS003',
      ruleId: 'RULE005',
      action: 'deactivate',
      operator: '赵专家',
      timestamp: '2024-01-10 11:25:00',
      reason: '爆破作业结束，暂停监测',
    },
  ];

  const columns: ColumnsType<ThresholdRule> = [
    {
      title: '规则ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 120,
    },
    {
      title: '监测参数',
      dataIndex: 'parameter',
      key: 'parameter',
      width: 100,
    },
    {
      title: '应用设备',
      dataIndex: 'appliedDevices',
      key: 'appliedDevices',
      width: 90,
      render: (count: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{count}</span>
      ),
    },
    {
      title: '今日告警',
      dataIndex: 'alertsToday',
      key: 'alertsToday',
      width: 90,
      render: (count: number) => (
        <Tag color={count > 0 ? 'orange' : 'green'}>{count}</Tag>
      ),
    },
    {
      title: '有效性',
      dataIndex: 'effectiveness',
      key: 'effectiveness',
      width: 100,
      render: (score: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
            style={{ width: 50, marginRight: 8 }}
          />
          <span style={{ fontSize: '12px' }}>{score}%</span>
        </div>
      ),
    },
    {
      title: '阈值设置',
      key: 'thresholds',
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: '12px', lineHeight: '1.2' }}>
          <div><span style={{ color: '#52c41a' }}>正常: {record.normalMin}-{record.normalMax}</span></div>
          <div><span style={{ color: '#faad14' }}>预警: {record.warningMin}-{record.warningMax}</span></div>
          <div><span style={{ color: '#ff4d4f' }}>危险: {record.dangerMin}+</span></div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string, record) => (
        <div>
          <Tag color={status === 'active' ? 'green' : 'default'}>
            {status === 'active' ? '启用' : '禁用'}
          </Tag>
          {status === 'active' && (
            <Tooltip title={`由 ${record.updateBy} 更新`}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px', marginLeft: 4 }} />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑规则">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditRule(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="查看历史">
            <Button
              type="link"
              icon={<HistoryOutlined />}
              onClick={() => handleViewHistory(record)}
            >
              历史
            </Button>
          </Tooltip>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        message.success('阈值设置保存成功！');
        console.log('保存阈值设置:', values);
      }, 1000);
    });
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置为默认值');
  };

  const handleAddRule = () => {
    ruleForm.resetFields();
    setSelectedRule(null);
    setEditVisible(true);
  };

  const handleEditRule = (rule: ThresholdRule) => {
    setSelectedRule(rule);
    ruleForm.setFieldsValue(rule);
    setEditVisible(true);
  };

  const handleViewHistory = (rule: ThresholdRule) => {
    setSelectedRule(rule);
    setHistoryVisible(true);
  };

  const handleDeleteRule = (rule: ThresholdRule) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除规则 ${rule.id} 吗？该操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk() {
        console.log('删除规则:', rule.id);
        message.success('规则已删除');
      },
    });
  };

  const handleToggleRule = (rule: ThresholdRule) => {
    const newStatus = rule.status === 'active' ? 'inactive' : 'active';
    console.log(`${newStatus === 'active' ? '启用' : '禁用'}规则:`, rule.id);
    message.success(`规则已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  const handleSaveRule = () => {
    ruleForm.validateFields().then(values => {
      console.log('保存规则:', values);
      setEditVisible(false);
      message.success('规则保存成功');
    });
  };

  // 设备状态表格列定义
  const deviceStatusColumns: ColumnsType<DeviceStatus> = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 150,
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 120,
    },
    {
      title: '当前数值',
      key: 'currentValue',
      width: 120,
      render: (_, record) => (
        <span>{record.currentValue} {record.unit}</span>
      ),
    },
    {
      title: '阈值状态',
      dataIndex: 'thresholdLevel',
      key: 'thresholdLevel',
      width: 100,
      render: (level: string) => {
        const config = {
          normal: { color: '#52c41a', text: '正常' },
          attention: { color: '#1890ff', text: '注意' },
          warning: { color: '#faad14', text: '预警' },
          danger: { color: '#ff4d4f', text: '危险' },
        };
        const levelConfig = config[level as keyof typeof config];
        return <Tag color={levelConfig.color}>{levelConfig.text}</Tag>;
      },
    },
    {
      title: '在线状态',
      dataIndex: 'isOnline',
      key: 'isOnline',
      width: 100,
      render: (isOnline: boolean) => (
        <Tag color={isOnline ? 'green' : 'red'}>
          {isOnline ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 160,
    },
  ];

  // 生成统计图表数据
  const generateAlarmTrendChart = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const normalAlarms = [2, 1, 3, 0, 2, 1, 2];
    const warningAlarms = [1, 2, 1, 3, 1, 0, 2];
    const dangerAlarms = [0, 0, 1, 0, 1, 0, 0];

    return {
      title: {
        text: '近七日告警趋势',
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['正常级别', '预警级别', '危险级别'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: days,
      },
      yAxis: {
        type: 'value',
        name: '告警次数',
      },
      series: [
        {
          name: '正常级别',
          type: 'line',
          data: normalAlarms,
          smooth: true,
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
        },
        {
          name: '预警级别',
          type: 'line',
          data: warningAlarms,
          smooth: true,
          itemStyle: { color: '#faad14' },
          areaStyle: { color: 'rgba(250, 173, 20, 0.1)' },
        },
        {
          name: '危险级别',
          type: 'line',
          data: dangerAlarms,
          smooth: true,
          itemStyle: { color: '#ff4d4f' },
          areaStyle: { color: 'rgba(255, 77, 79, 0.1)' },
        },
      ],
    };
  };

  return (
    <div>
      <div className="page-title">阈值设置</div>
      
      {/* 总览统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃规则"
              value={mockRules.filter(r => r.status === 'active').length}
              suffix={`/ ${mockRules.length}`}
              valueStyle={{ color: '#3f8600' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="监控设备"
              value={mockRules.reduce((sum, rule) => sum + rule.appliedDevices, 0)}
              valueStyle={{ color: '#1890ff' }}
              prefix={<MonitorOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日告警"
              value={mockRules.reduce((sum, rule) => sum + rule.alertsToday, 0)}
              valueStyle={{ color: mockRules.reduce((sum, rule) => sum + rule.alertsToday, 0) > 0 ? '#cf1322' : '#52c41a' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均有效性"
              value={Math.round(mockRules.reduce((sum, rule) => sum + rule.effectiveness, 0) / mockRules.length)}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速告警提示 */}
      {mockRules.some(rule => rule.alertsToday > 0) && (
        <Alert
          message="告警提示"
          description={`有 ${mockRules.filter(rule => rule.alertsToday > 0).length} 个规则今日产生了告警，请及时关注。`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary">
              查看告警记录
            </Button>
          }
        />
      )}

      {/* 主要内容区域 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'rules',
            label: (
              <span>
                <SettingOutlined />
                阈值规则
              </span>
            ),
            children: (
              <Card className="custom-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
                      新增规则
                    </Button>
                    <Button 
                      style={{ marginLeft: 8 }} 
                      icon={<ReloadOutlined />} 
                      onClick={() => message.info('数据已刷新')}
                    >
                      刷新
                    </Button>
                  </div>
                  <div>
                    <Select
                      placeholder="筛选设备类型"
                      style={{ width: 150, marginRight: 8 }}
                      allowClear
                    >
                      <Select.Option value="displacement">表面位移</Select.Option>
                      <Select.Option value="pressure">土压力</Select.Option>
                      <Select.Option value="crack">裂缝计</Select.Option>
                      <Select.Option value="water">地下水位</Select.Option>
                      <Select.Option value="vibration">爆破振动</Select.Option>
                    </Select>
                    <Select
                      placeholder="筛选状态"
                      style={{ width: 120 }}
                      allowClear
                    >
                      <Select.Option value="active">启用</Select.Option>
                      <Select.Option value="inactive">禁用</Select.Option>
                    </Select>
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={mockRules}
                  pagination={{
                    total: mockRules.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                  }}
                  className="custom-table"
                  scroll={{ x: 1200 }}
                />
              </Card>
            ),
          },
          {
            key: 'monitor',
            label: (
              <span>
                <MonitorOutlined />
                实时监控
              </span>
            ),
            children: (
              <Row gutter={16}>
                <Col span={16}>
                  <Card title="设备状态监控" className="custom-card">
                    <Table
                      columns={deviceStatusColumns}
                      dataSource={mockDeviceStatus}
                      pagination={false}
                      className="custom-table"
                      size="small"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="告警趋势分析" className="custom-card">
                    <ReactECharts
                      option={generateAlarmTrendChart()}
                      style={{ height: '300px', width: '100%' }}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'analytics',
            label: (
              <span>
                <HistoryOutlined />
                统计分析
              </span>
            ),
            children: (
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="规则有效性排行" className="custom-card">
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                      {mockRules
                        .sort((a, b) => b.effectiveness - a.effectiveness)
                        .map((rule, index) => (
                          <div key={rule.id} style={{ 
                            padding: '8px 0', 
                            borderBottom: index < mockRules.length - 1 ? '1px solid #f0f0f0' : 'none'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{rule.deviceType}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{rule.parameter}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div>
                                  <Progress
                                    percent={rule.effectiveness}
                                    size="small"
                                    strokeColor={rule.effectiveness >= 80 ? '#52c41a' : rule.effectiveness >= 60 ? '#faad14' : '#ff4d4f'}
                                    style={{ width: 60 }}
                                  />
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  设备: {rule.appliedDevices} | 告警: {rule.alertsToday}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="设备类型分布" className="custom-card">
                    <div style={{ padding: '20px 0' }}>
                      {[
                        { type: '表面位移', count: mockRules.filter(r => r.deviceCategory === 'displacement').length, color: '#1890ff' },
                        { type: '土压力', count: mockRules.filter(r => r.deviceCategory === 'pressure').length, color: '#52c41a' },
                        { type: '裂缝监测', count: mockRules.filter(r => r.deviceCategory === 'crack').length, color: '#faad14' },
                        { type: '地下水位', count: mockRules.filter(r => r.deviceCategory === 'water').length, color: '#722ed1' },
                        { type: '爆破振动', count: mockRules.filter(r => r.deviceCategory === 'vibration').length, color: '#f5222d' },
                      ].map(item => (
                        <div key={item.type} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>{item.type}</span>
                            <span style={{ fontWeight: 'bold', color: item.color }}>{item.count}</span>
                          </div>
                          <Progress 
                            percent={(item.count / mockRules.length) * 100} 
                            strokeColor={item.color}
                            showInfo={false}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      {/* 编辑规则弹窗 */}
      <Modal
        title={selectedRule ? '编辑阈值规则' : '新增阈值规则'}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleSaveRule}
        width={800}
        destroyOnClose
      >
        <Form form={ruleForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="deviceCategory"
                label="设备分类"
                rules={[{ required: true, message: '请选择设备分类' }]}
              >
                <Select placeholder="请选择设备分类">
                  <Select.Option value="displacement">表面位移</Select.Option>
                  <Select.Option value="pressure">土压力</Select.Option>
                  <Select.Option value="crack">裂缝计</Select.Option>
                  <Select.Option value="water">地下水位</Select.Option>
                  <Select.Option value="rainfall">降雨量</Select.Option>
                  <Select.Option value="vibration">爆破振动</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="deviceType"
                label="设备类型"
                rules={[{ required: true, message: '请输入设备类型' }]}
              >
                <Input placeholder="请输入设备类型" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="parameter"
                label="监测参数"
                rules={[{ required: true, message: '请输入监测参数' }]}
              >
                <Input placeholder="请输入监测参数" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>阈值设置</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Card title="正常范围" size="small" style={{ borderColor: '#52c41a', marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name="normalMin" label="下限">
                      <InputNumber style={{ width: '100%' }} placeholder="下限" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="normalMax" label="上限">
                      <InputNumber style={{ width: '100%' }} placeholder="上限" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="注意范围" size="small" style={{ borderColor: '#1890ff', marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name="attentionMin" label="下限">
                      <InputNumber style={{ width: '100%' }} placeholder="下限" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="attentionMax" label="上限">
                      <InputNumber style={{ width: '100%' }} placeholder="上限" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Card title="预警范围" size="small" style={{ borderColor: '#faad14', marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name="warningMin" label="下限">
                      <InputNumber style={{ width: '100%' }} placeholder="下限" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="warningMax" label="上限">
                      <InputNumber style={{ width: '100%' }} placeholder="上限" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="危险范围" size="small" style={{ borderColor: '#ff4d4f', marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name="dangerMin" label="下限">
                      <InputNumber style={{ width: '100%' }} placeholder="下限" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="dangerMax" label="上限">
                      <InputNumber style={{ width: '100%' }} placeholder="上限" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请输入单位' }]}
              >
                <Input placeholder="如：mm/h, kPa, mm, m, mm/s" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="规则状态" initialValue="active">
                <Select>
                  <Select.Option value="active">启用</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 历史记录弹窗 */}
      <Modal
        title="阈值历史记录"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedRule && (
          <div>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <strong>规则：</strong>{selectedRule.id} - {selectedRule.deviceType} ({selectedRule.parameter})
            </div>
            <Timeline>
              {mockHistory
                .filter(h => h.ruleId === selectedRule.id)
                .map(history => (
                  <Timeline.Item
                    key={history.id}
                    color={{
                      create: 'green',
                      update: 'blue',
                      delete: 'red',
                      activate: 'green',
                      deactivate: 'orange',
                    }[history.action]}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {{
                          create: '创建规则',
                          update: '更新规则',
                          delete: '删除规则',
                          activate: '启用规则',
                          deactivate: '禁用规则',
                        }[history.action]}
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        {history.operator} 于 {history.timestamp}
                      </div>
                      {history.reason && (
                        <div style={{ marginTop: 4, fontSize: '13px' }}>
                          原因：{history.reason}
                        </div>
                      )}
                      {history.oldValues && history.newValues && (
                        <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                          变更：{JSON.stringify(history.oldValues)} → {JSON.stringify(history.newValues)}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                ))
              }
            </Timeline>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ThresholdSettings;
