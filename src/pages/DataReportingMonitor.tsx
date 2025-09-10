import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  Switch,
  Tooltip,
  Badge,
  Timeline,
  Alert
} from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DeviceReportStatus {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  location: string;
  status: 'online' | 'offline' | 'error';
  lastReportTime: string;
  reportInterval: number; // 上报间隔(分钟)
  successRate: number; // 成功率
  todayReports: number;
  failedReports: number;
  batteryLevel?: number;
  signalStrength?: number;
}

interface ReportRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  reportTime: string;
  status: 'success' | 'failed' | 'timeout';
  dataSize: number;
  responseTime: number;
  errorMessage?: string;
}

const DataReportingMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceReportStatus[]>([]);
  const [reportRecords, setReportRecords] = useState<ReportRecord[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [timeRange, setTimeRange] = useState<[any, any] | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [form] = Form.useForm();

  // 模拟设备上报状态数据
  useEffect(() => {
    const mockDeviceStatuses: DeviceReportStatus[] = [
      {
        deviceId: 'DEV001',
        deviceName: '雷达监测点-01',
        deviceType: '雷达传感器',
        location: '边坡A区-上部',
        status: 'online',
        lastReportTime: '2025-01-15 14:30:25',
        reportInterval: 5,
        successRate: 98.5,
        todayReports: 288,
        failedReports: 4,
        batteryLevel: 85,
        signalStrength: 92
      },
      {
        deviceId: 'DEV002',
        deviceName: '土压力传感器-03',
        deviceType: '压力传感器',
        location: '边坡B区-中部',
        status: 'online',
        lastReportTime: '2025-01-15 14:25:18',
        reportInterval: 10,
        successRate: 95.2,
        todayReports: 144,
        failedReports: 7,
        batteryLevel: 72,
        signalStrength: 88
      },
      {
        deviceId: 'DEV003',
        deviceName: '裂缝计-05',
        deviceType: '裂缝监测仪',
        location: '岩体C区-底部',
        status: 'offline',
        lastReportTime: '2025-01-15 12:20:12',
        reportInterval: 15,
        successRate: 0,
        todayReports: 0,
        failedReports: 96,
        batteryLevel: 15,
        signalStrength: 0
      },
      {
        deviceId: 'DEV004',
        deviceName: '雨量计-02',
        deviceType: '气象传感器',
        location: '监测站-顶部',
        status: 'online',
        lastReportTime: '2025-01-15 14:15:08',
        reportInterval: 30,
        successRate: 99.8,
        todayReports: 48,
        failedReports: 0,
        batteryLevel: 95,
        signalStrength: 95
      },
      {
        deviceId: 'DEV005',
        deviceName: '地下水位计-04',
        deviceType: '水位传感器',
        location: '钻孔D-深度15m',
        status: 'error',
        lastReportTime: '2025-01-15 13:45:22',
        reportInterval: 60,
        successRate: 75.5,
        todayReports: 18,
        failedReports: 6,
        batteryLevel: 60,
        signalStrength: 75
      }
    ];

    const mockReportRecords: ReportRecord[] = [
      {
        id: 'R001',
        deviceId: 'DEV001',
        deviceName: '雷达监测点-01',
        reportTime: '2025-01-15 14:30:25',
        status: 'success',
        dataSize: 1024,
        responseTime: 120
      },
      {
        id: 'R002',
        deviceId: 'DEV002',
        deviceName: '土压力传感器-03',
        reportTime: '2025-01-15 14:25:18',
        status: 'success',
        dataSize: 512,
        responseTime: 95
      },
      {
        id: 'R003',
        deviceId: 'DEV003',
        deviceName: '裂缝计-05',
        reportTime: '2025-01-15 12:20:12',
        status: 'failed',
        dataSize: 0,
        responseTime: 0,
        errorMessage: '设备离线，无法连接'
      },
      {
        id: 'R004',
        deviceId: 'DEV005',
        deviceName: '地下水位计-04',
        reportTime: '2025-01-15 13:45:22',
        status: 'timeout',
        dataSize: 256,
        responseTime: 5000,
        errorMessage: '响应超时'
      }
    ];

    setDeviceStatuses(mockDeviceStatuses);
    setReportRecords(mockReportRecords);
  }, []);

  // 自动刷新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
      }, 30000); // 30秒刷新一次
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDeviceControl = (deviceId: string, action: 'start' | 'stop' | 'restart') => {
    Modal.confirm({
      title: '确认操作',
      content: `确定要${action === 'start' ? '启动' : action === 'stop' ? '停止' : '重启'}设备 ${deviceId} 的数据上报吗？`,
      onOk: () => {
        console.log(`${action} device:`, deviceId);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'error': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线';
      case 'offline': return '离线';
      case 'error': return '异常';
      default: return '未知';
    }
  };

  const deviceColumns: ColumnsType<DeviceReportStatus> = [
    {
      title: '设备信息',
      key: 'device',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.deviceName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.deviceId} | {record.deviceType}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.location}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '上报成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 120,
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small"
          status={rate > 90 ? 'active' : rate > 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '今日上报',
      key: 'reports',
      width: 100,
      render: (_, record) => (
        <div>
          <div style={{ color: '#52c41a' }}>成功: {record.todayReports}</div>
          <div style={{ color: '#ff4d4f' }}>失败: {record.failedReports}</div>
        </div>
      ),
    },
    {
      title: '最后上报',
      dataIndex: 'lastReportTime',
      key: 'lastReportTime',
      width: 150,
    },
    {
      title: '上报间隔',
      dataIndex: 'reportInterval',
      key: 'reportInterval',
      width: 100,
      render: (interval) => `${interval}分钟`,
    },
    {
      title: '电池/信号',
      key: 'battery',
      width: 120,
      render: (_, record) => (
        <div>
          {record.batteryLevel && (
            <div style={{ fontSize: '12px' }}>
              电池: <span style={{ color: record.batteryLevel > 20 ? '#52c41a' : '#ff4d4f' }}>
                {record.batteryLevel}%
              </span>
            </div>
          )}
          {record.signalStrength && (
            <div style={{ fontSize: '12px' }}>
              信号: <span style={{ color: record.signalStrength > 50 ? '#52c41a' : '#faad14' }}>
                {record.signalStrength}%
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="启动上报">
            <Button
              type="text"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleDeviceControl(record.deviceId, 'start')}
              disabled={record.status === 'online'}
            />
          </Tooltip>
          <Tooltip title="停止上报">
            <Button
              type="text"
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleDeviceControl(record.deviceId, 'stop')}
              disabled={record.status === 'offline'}
            />
          </Tooltip>
          <Tooltip title="重启设备">
            <Button
              type="text"
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleDeviceControl(record.deviceId, 'restart')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const recordColumns: ColumnsType<ReportRecord> = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          success: { color: 'green', icon: <CheckCircleOutlined />, text: '成功' },
          failed: { color: 'red', icon: <CloseCircleOutlined />, text: '失败' },
          timeout: { color: 'orange', icon: <ExclamationCircleOutlined />, text: '超时' }
        };
        const { color, icon, text } = config[status as keyof typeof config];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '数据大小',
      dataIndex: 'dataSize',
      key: 'dataSize',
      render: (size) => `${size} B`,
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => `${time} ms`,
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (message) => message || '-',
    },
  ];

  // 统计数据
  const totalDevices = deviceStatuses.length;
  const onlineDevices = deviceStatuses.filter(d => d.status === 'online').length;
  const offlineDevices = deviceStatuses.filter(d => d.status === 'offline').length;
  const errorDevices = deviceStatuses.filter(d => d.status === 'error').length;
  const avgSuccessRate = deviceStatuses.reduce((sum, d) => sum + d.successRate, 0) / totalDevices;

  return (
    <div style={{ padding: '24px' }}>
      <div className="page-title">数据上报监控</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={totalDevices}
              prefix={<Badge count={totalDevices} showZero color="#1890ff" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDevices}
              valueStyle={{ color: '#52c41a' }}
              prefix={<Badge count={onlineDevices} showZero color="#52c41a" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={offlineDevices}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<Badge count={offlineDevices} showZero color="#ff4d4f" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均成功率"
              value={avgSuccessRate.toFixed(1)}
              suffix="%"
              valueStyle={{ color: avgSuccessRate > 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 控制面板 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <span>自动刷新:</span>
              <Switch 
                checked={autoRefresh} 
                onChange={setAutoRefresh}
                checkedChildren="开"
                unCheckedChildren="关"
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
              >
                手动刷新
              </Button>
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setSettingsVisible(true)}
              >
                批量设置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 设备状态列表 */}
      <Card title="设备上报状态" style={{ marginBottom: '16px' }}>
        <Table
          columns={deviceColumns}
          dataSource={deviceStatuses}
          rowKey="deviceId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个设备`,
          }}
        />
      </Card>

      {/* 上报记录 */}
      <Card title="上报历史记录">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Select
              placeholder="选择设备"
              style={{ width: 200 }}
              allowClear
              value={selectedDevice}
              onChange={setSelectedDevice}
            >
              {deviceStatuses.map(device => (
                <Option key={device.deviceId} value={device.deviceId}>
                  {device.deviceName}
                </Option>
              ))}
            </Select>
            <RangePicker
              showTime
              value={timeRange}
              onChange={setTimeRange}
              placeholder={['开始时间', '结束时间']}
            />
            <Button type="primary" icon={<SearchOutlined />}>
              查询
            </Button>
          </Space>
        </div>
        
        <Table
          columns={recordColumns}
          dataSource={reportRecords}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 批量设置弹窗 */}
      <Modal
        title="批量设备设置"
        visible={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            console.log('批量设置:', values);
            setSettingsVisible(false);
          });
        }}
        width={600}
      >
        <Alert
          message="批量操作提醒"
          description="批量设置将应用到所有选中的设备，请谨慎操作。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form form={form} layout="vertical">
          <Form.Item name="devices" label="选择设备">
            <Select
              mode="multiple"
              placeholder="请选择要设置的设备"
              style={{ width: '100%' }}
            >
              {deviceStatuses.map(device => (
                <Option key={device.deviceId} value={device.deviceId}>
                  {device.deviceName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="reportInterval" label="上报间隔(分钟)">
            <Select placeholder="请选择上报间隔">
              <Option value={1}>1分钟</Option>
              <Option value={5}>5分钟</Option>
              <Option value={10}>10分钟</Option>
              <Option value={15}>15分钟</Option>
              <Option value={30}>30分钟</Option>
              <Option value={60}>60分钟</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="action" label="批量操作">
            <Select placeholder="请选择批量操作">
              <Option value="start">启动上报</Option>
              <Option value="stop">停止上报</Option>
              <Option value="restart">重启设备</Option>
              <Option value="reset">重置配置</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataReportingMonitor;
