import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message, Tabs, Badge } from 'antd';
import { AlertOutlined, WarningOutlined, CheckCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DangerZone } from './components/PersonnelMap';

const { Option } = Select;
const { TextArea } = Input;

interface SafetyAlert {
  id: string;
  personnelId: string;
  personnelName: string;
  department: string;
  zoneId: string;
  zoneName: string;
  type: 'enter' | 'stay' | 'sos';
  level: 1 | 2 | 3;
  timestamp: string;
  handled: boolean;
  handlerNote?: string;
}

const SafetyAlert: React.FC = () => {
  const [alertFilter, setAlertFilter] = useState<'all' | 'unhandled' | 'handled'>('unhandled');
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [editingZone, setEditingZone] = useState<DangerZone | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [zoneForm] = Form.useForm();
  const [handleForm] = Form.useForm();

  // 模拟告警数据
  const [alerts, setAlerts] = useState<SafetyAlert[]>([
    {
      id: 'A001',
      personnelId: 'P003',
      personnelName: '王五',
      department: '安全部',
      zoneId: 'DZ001',
      zoneName: '爆破作业区',
      type: 'sos',
      level: 3,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A002',
      personnelId: 'P001',
      personnelName: '张三',
      department: '采矿部',
      zoneId: 'DZ002',
      zoneName: '边坡监测区',
      type: 'stay',
      level: 2,
      timestamp: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A003',
      personnelId: 'P002',
      personnelName: '李四',
      department: '采矿部',
      zoneId: 'DZ001',
      zoneName: '爆破作业区',
      type: 'enter',
      level: 3,
      timestamp: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: true,
      handlerNote: '已联系人员，正在撤离'
    },
    {
      id: 'A004',
      personnelId: 'P007',
      personnelName: '周九',
      department: '运输部',
      zoneId: 'DZ002',
      zoneName: '边坡监测区',
      type: 'stay',
      level: 2,
      timestamp: dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A005',
      personnelId: 'P008',
      personnelName: '吴十',
      department: '运输部',
      zoneId: 'DZ003',
      zoneName: '高压线路区',
      type: 'enter',
      level: 3,
      timestamp: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A006',
      personnelId: 'P004',
      personnelName: '赵六',
      department: '机电部',
      zoneId: 'DZ001',
      zoneName: '爆破作业区',
      type: 'enter',
      level: 3,
      timestamp: dayjs().subtract(45, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: true,
      handlerNote: '已确认人员撤离'
    },
    {
      id: 'A007',
      personnelId: 'P010',
      personnelName: '陈十二',
      department: '安全部',
      zoneId: 'DZ002',
      zoneName: '边坡监测区',
      type: 'stay',
      level: 2,
      timestamp: dayjs().subtract(20, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A008',
      personnelId: 'P001',
      personnelName: '张三',
      department: '采矿部',
      zoneId: 'DZ001',
      zoneName: '爆破作业区',
      type: 'enter',
      level: 3,
      timestamp: dayjs().subtract(60, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: true,
      handlerNote: '安全巡视，已离开'
    },
    {
      id: 'A009',
      personnelId: 'P006',
      personnelName: '孙八',
      department: '安全部',
      zoneId: 'DZ003',
      zoneName: '高压线路区',
      type: 'enter',
      level: 3,
      timestamp: dayjs().subtract(25, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: false
    },
    {
      id: 'A010',
      personnelId: 'P009',
      personnelName: '郑十一',
      department: '机电部',
      zoneId: 'DZ002',
      zoneName: '边坡监测区',
      type: 'stay',
      level: 2,
      timestamp: dayjs().subtract(35, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      handled: true,
      handlerNote: '设备维护完成，人员已离开'
    }
  ]);

  // 模拟危险区域数据
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([
    {
      id: 'DZ001',
      name: '爆破作业区',
      type: 'forbidden',
      level: 3,
      coordinates: [
        [87.6190, 43.7970],
        [87.6210, 43.7970],
        [87.6210, 43.7990],
        [87.6190, 43.7990]
      ],
      alertRule: {
        enterAlert: true
      }
    },
    {
      id: 'DZ002',
      name: '边坡监测区',
      type: 'restricted',
      level: 2,
      coordinates: [
        [87.6110, 43.7890],
        [87.6140, 43.7890],
        [87.6140, 43.7920],
        [87.6110, 43.7920]
      ],
      alertRule: {
        enterAlert: true,
        stayDuration: 30
      }
    }
  ]);

  const handleAlertAction = (alert: SafetyAlert) => {
    setSelectedAlert(alert);
    setHandleModalVisible(true);
  };

  const handleAlertSubmit = () => {
    handleForm.validateFields().then(values => {
      setAlerts(prev => prev.map(alert => 
        alert.id === selectedAlert?.id 
          ? { ...alert, handled: true, handlerNote: values.note }
          : alert
      ));
      message.success('告警已处理');
      setHandleModalVisible(false);
      handleForm.resetFields();
    });
  };

  const handleAddZone = () => {
    setEditingZone(null);
    zoneForm.resetFields();
    setZoneModalVisible(true);
  };

  const handleEditZone = (zone: DangerZone) => {
    setEditingZone(zone);
    zoneForm.setFieldsValue({
      name: zone.name,
      type: zone.type,
      level: zone.level,
      enterAlert: zone.alertRule.enterAlert,
      stayDuration: zone.alertRule.stayDuration
    });
    setZoneModalVisible(true);
  };

  const handleDeleteZone = (zoneId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此危险区域吗？',
      onOk: () => {
        setDangerZones(prev => prev.filter(z => z.id !== zoneId));
        message.success('删除成功');
      }
    });
  };

  const handleZoneSubmit = () => {
    zoneForm.validateFields().then(values => {
      if (editingZone) {
        setDangerZones(prev => prev.map(zone =>
          zone.id === editingZone.id
            ? {
                ...zone,
                name: values.name,
                type: values.type,
                level: values.level,
                alertRule: {
                  enterAlert: values.enterAlert,
                  stayDuration: values.stayDuration
                }
              }
            : zone
        ));
        message.success('更新成功');
      } else {
        const newZone: DangerZone = {
          id: `DZ${String(dangerZones.length + 1).padStart(3, '0')}`,
          name: values.name,
          type: values.type,
          level: values.level,
          coordinates: [[87.615, 43.795], [87.620, 43.795], [87.620, 43.800], [87.615, 43.800]],
          alertRule: {
            enterAlert: values.enterAlert,
            stayDuration: values.stayDuration
          }
        };
        setDangerZones(prev => [...prev, newZone]);
        message.success('添加成功');
      }
      setZoneModalVisible(false);
      zoneForm.resetFields();
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'unhandled') return !alert.handled;
    if (alertFilter === 'handled') return alert.handled;
    return true;
  });

  const alertColumns = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const config = {
          enter: { icon: <WarningOutlined />, text: '进入告警', color: 'warning' },
          stay: { icon: <AlertOutlined />, text: '滞留告警', color: 'orange' },
          sos: { icon: <AlertOutlined />, text: 'SOS求救', color: 'error' }
        };
        const item = config[type as keyof typeof config];
        return <Tag icon={item.icon} color={item.color}>{item.text}</Tag>;
      }
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: number) => {
        const colors = { 1: 'default', 2: 'warning', 3: 'error' };
        return <Tag color={colors[level as keyof typeof colors]}>级别{level}</Tag>;
      }
    },
    {
      title: '人员',
      dataIndex: 'personnelName',
      key: 'personnelName',
      width: 100
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100
    },
    {
      title: '危险区域',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 120
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'handled',
      key: 'handled',
      width: 80,
      render: (handled: boolean) => (
        handled 
          ? <Tag icon={<CheckCircleOutlined />} color="success">已处理</Tag>
          : <Tag color="error">待处理</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: SafetyAlert) => (
        !record.handled ? (
          <Button type="link" size="small" onClick={() => handleAlertAction(record)}>
            处理
          </Button>
        ) : (
          <span style={{ color: '#999' }}>已处理</span>
        )
      )
    }
  ];

  const zoneColumns = [
    {
      title: '区域名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '区域类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          forbidden: '禁止进入',
          restricted: '限制区域',
          safety: '安全区域'
        };
        return typeMap[type as keyof typeof typeMap];
      }
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: number) => <Tag color={level === 3 ? 'error' : level === 2 ? 'warning' : 'default'}>级别{level}</Tag>
    },
    {
      title: '进入告警',
      key: 'enterAlert',
      render: (_: any, record: DangerZone) => (
        record.alertRule.enterAlert ? <Tag color="success">开启</Tag> : <Tag>关闭</Tag>
      )
    },
    {
      title: '滞留时长(分钟)',
      key: 'stayDuration',
      render: (_: any, record: DangerZone) => (
        record.alertRule.stayDuration || '-'
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DangerZone) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditZone(record)}>
            编辑
          </Button>
          <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteZone(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const unhandledCount = alerts.filter(a => !a.handled).length;
  const sosCount = alerts.filter(a => a.type === 'sos' && !a.handled).length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        defaultActiveKey="alerts"
        items={[
          {
            key: 'alerts',
            label: (
              <span>
                <Badge count={unhandledCount} offset={[10, 0]}>
                  <AlertOutlined /> 告警列表
                </Badge>
              </span>
            ),
            children: (
              <Card
                title="安全告警"
                extra={
                  <Space>
                    <Select value={alertFilter} onChange={setAlertFilter} style={{ width: 120 }}>
                      <Option value="all">全部告警</Option>
                      <Option value="unhandled">待处理 ({unhandledCount})</Option>
                      <Option value="handled">已处理</Option>
                    </Select>
                    {sosCount > 0 && (
                      <Tag color="error" icon={<AlertOutlined />}>
                        紧急SOS: {sosCount}
                      </Tag>
                    )}
                  </Space>
                }
              >
                <Table
                  columns={alertColumns}
                  dataSource={filteredAlerts}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  rowClassName={(record) => record.type === 'sos' && !record.handled ? 'sos-alert-row' : ''}
                />
              </Card>
            )
          },
          {
            key: 'zones',
            label: (
              <span>
                <WarningOutlined /> 危险区域配置
              </span>
            ),
            children: (
              <Card
                title="危险区域管理"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddZone}>
                    添加区域
                  </Button>
                }
              >
                <Table
                  columns={zoneColumns}
                  dataSource={dangerZones}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 处理告警模态框 */}
      <Modal
        title="处理告警"
        open={handleModalVisible}
        onOk={handleAlertSubmit}
        onCancel={() => setHandleModalVisible(false)}
        okText="确认处理"
        cancelText="取消"
      >
        {selectedAlert && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>人员：</strong>{selectedAlert.personnelName} ({selectedAlert.department})</p>
            <p><strong>告警类型：</strong>{selectedAlert.type === 'sos' ? 'SOS求救' : selectedAlert.type === 'enter' ? '进入告警' : '滞留告警'}</p>
            <p><strong>危险区域：</strong>{selectedAlert.zoneName}</p>
            <p><strong>告警时间：</strong>{selectedAlert.timestamp}</p>
          </div>
        )}
        <Form form={handleForm} layout="vertical">
          <Form.Item name="note" label="处理备注" rules={[{ required: true, message: '请输入处理备注' }]}>
            <TextArea rows={4} placeholder="请输入处理情况说明..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 危险区域配置模态框 */}
      <Modal
        title={editingZone ? '编辑危险区域' : '添加危险区域'}
        open={zoneModalVisible}
        onOk={handleZoneSubmit}
        onCancel={() => setZoneModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={zoneForm} layout="vertical">
          <Form.Item name="name" label="区域名称" rules={[{ required: true, message: '请输入区域名称' }]}>
            <Input placeholder="例如：爆破作业区" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="区域类型" rules={[{ required: true, message: '请选择区域类型' }]}>
                <Select placeholder="请选择">
                  <Option value="forbidden">禁止进入</Option>
                  <Option value="restricted">限制区域</Option>
                  <Option value="safety">安全区域</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="告警级别" rules={[{ required: true, message: '请选择告警级别' }]}>
                <Select placeholder="请选择">
                  <Option value={1}>级别1 - 一般</Option>
                  <Option value={2}>级别2 - 重要</Option>
                  <Option value={3}>级别3 - 紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="enterAlert" label="进入告警" valuePropName="checked" initialValue={true}>
            <Select>
              <Option value={true}>开启</Option>
              <Option value={false}>关闭</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stayDuration" label="滞留时长(分钟)">
            <InputNumber min={1} max={120} placeholder="超过此时长将触发告警" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .sos-alert-row {
          background-color: #fff2f0 !important;
        }
        .sos-alert-row:hover {
          background-color: #ffe7e6 !important;
        }
      `}</style>
    </div>
  );
};

export default SafetyAlert;
