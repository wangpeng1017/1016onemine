import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

interface Fault {
  key: string;
  faultId: string;
  equipment: string;
  faultType: string;
  description: string;
  reporter: string;
  reportTime: string;
  assignee: string;
  status: string;
  solution: string;
}

const FaultManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFault, setEditingFault] = useState<Fault | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  const [faults, setFaults] = useState<Fault[]>([
    {
      key: '1',
      faultId: 'FLT-001',
      equipment: 'A号采煤机',
      faultType: '机械故障',
      description: '截割电机异响',
      reporter: '操作员甲',
      reportTime: '2024-06-10 08:30',
      assignee: '张维修',
      status: '处理中',
      solution: '正在检查电机轴承',
    },
    {
      key: '2',
      faultId: 'FLT-002',
      equipment: '皮带输送机',
      faultType: '电气故障',
      description: '启动失败',
      reporter: '操作员乙',
      reportTime: '2024-06-10 14:20',
      assignee: '李电工',
      status: '已完成',
      solution: '更换启动接触器',
    },
    {
      key: '3',
      faultId: 'FLT-003',
      equipment: 'B号采煤机',
      faultType: '液压故障',
      description: '液压系统压力不足',
      reporter: '班长',
      reportTime: '2024-06-11 09:15',
      assignee: '王师傅',
      status: '待处理',
      solution: '',
    },
    {
      key: '4',
      faultId: 'FLT-004',
      equipment: '通风机',
      faultType: '机械故障',
      description: '轴承温度过高',
      reporter: '监测员',
      reportTime: '2024-06-12 10:45',
      assignee: '赵师傅',
      status: '处理中',
      solution: '正在更换轴承',
    },
    {
      key: '5',
      faultId: 'FLT-005',
      equipment: '排水泵',
      faultType: '电气故障',
      description: '电机无法启动',
      reporter: '值班员',
      reportTime: '2024-06-13 07:20',
      assignee: '孙电工',
      status: '待处理',
      solution: '',
    },
    {
      key: '6',
      faultId: 'FLT-006',
      equipment: '破碎机',
      faultType: '机械故障',
      description: '锤头磨损严重',
      reporter: '操作员丙',
      reportTime: '2024-06-14 15:10',
      assignee: '钱师傅',
      status: '已完成',
      solution: '更换新锤头',
    },
    {
      key: '7',
      faultId: 'FLT-007',
      equipment: '装载机',
      faultType: '液压故障',
      description: '液压油泄漏',
      reporter: '驾驶员',
      reportTime: '2024-06-15 11:30',
      assignee: '周维修',
      status: '处理中',
      solution: '正在更换密封件',
    },
    {
      key: '8',
      faultId: 'FLT-008',
      equipment: 'C号采煤机',
      faultType: '电气故障',
      description: '控制系统故障',
      reporter: '班长',
      reportTime: '2024-06-16 09:00',
      assignee: '吴工程师',
      status: '已完成',
      solution: '重置控制系统并更新程序',
    },
    {
      key: '9',
      faultId: 'FLT-009',
      equipment: '2号皮带输送机',
      faultType: '机械故障',
      description: '皮带跑偏',
      reporter: '巡检员',
      reportTime: '2024-06-17 13:45',
      assignee: '郑师傅',
      status: '待处理',
      solution: '',
    },
    {
      key: '10',
      faultId: 'FLT-010',
      equipment: '提升机',
      faultType: '电气故障',
      description: '制动器失灵',
      reporter: '安全员',
      reportTime: '2024-06-18 08:15',
      assignee: '冯电工',
      status: '处理中',
      solution: '正在检修制动系统',
    },
  ];

  const columns: ColumnsType<Fault> = [
    { title: '故障ID', dataIndex: 'faultId', key: 'faultId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '故障类型', dataIndex: 'faultType', key: 'faultType', width: 120 },
    { title: '故障描述', dataIndex: 'description', key: 'description', width: 180 },
    { title: '报告人', dataIndex: 'reporter', key: 'reporter', width: 100 },
    { title: '报告时间', dataIndex: 'reportTime', key: 'reportTime', width: 150 },
    { title: '处理人', dataIndex: 'assignee', key: 'assignee', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = '';
        if (status === '待处理') color = 'red';
        else if (status === '处理中') color = 'processing';
        else color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.status !== '已完成' && (
            <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleComplete(record)}>完成</Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingFault(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (fault: Fault) => {
    setEditingFault(fault);
    form.setFieldsValue(fault);
    setIsModalVisible(true);
  };

  const handleDelete = (fault: Fault) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除故障记录 ${fault.faultId} 吗？`,
      onOk() {
        setFaults(prev => prev.filter(f => f.key !== fault.key));
        message.success('删除成功');
      },
    });
  };

  const handleComplete = (fault: Fault) => {
    setFaults(prev => prev.map(f => f.key === fault.key ? { ...f, status: '已完成' } : f));
    message.success('故障标记为已完成');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const payload: Partial<Fault> = {
        ...values,
        reportTime: values.reportTime || new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\/|\//g, '-'),
      };
      if (editingFault) {
        setFaults(prev => prev.map(f => f.key === editingFault.key ? { ...editingFault, ...payload } as Fault : f));
        message.success('故障记录更新成功');
      } else {
        const newFault: Fault = {
          ...payload,
          key: String(faults.length + 1),
          faultId: `FLT-${String(faults.length + 1).padStart(3, '0')}`,
          status: '待处理',
        } as Fault;
        setFaults(prev => [newFault, ...prev]);
        message.success('故障报告提交成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getFilteredFaults = () => {
    let filtered = faults;
    if (searchText) {
      filtered = filtered.filter(f =>
        f.faultId.toLowerCase().includes(searchText.toLowerCase()) ||
        f.equipment.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) filtered = filtered.filter(f => f.status === filterStatus);
    if (filterType) filtered = filtered.filter(f => f.faultType === filterType);
    return filtered;
  };

  const handleResetFilter = () => {
    setSearchText('');
    setFilterStatus(undefined);
    setFilterType(undefined);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input 
              placeholder="搜索故障ID/设备" 
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)} 
              prefix={<SearchOutlined />} 
            />
          </Col>
          <Col span={4}>
            <Select 
              placeholder="状态" 
              allowClear 
              style={{ width: '100%' }} 
              value={filterStatus} 
              onChange={setFilterStatus}
            >
              <Select.Option value="待处理">待处理</Select.Option>
              <Select.Option value="处理中">处理中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="故障类型" 
              allowClear 
              style={{ width: '100%' }} 
              value={filterType} 
              onChange={setFilterType}
            >
              <Select.Option value="机械故障">机械故障</Select.Option>
              <Select.Option value="电气故障">电气故障</Select.Option>
              <Select.Option value="液压故障">液压故障</Select.Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button onClick={handleResetFilter}>重置</Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建故障报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        title="设备故障管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            故障报告
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={getFilteredFaults()} 
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} 
          scroll={{ x: 1400 }} 
        />
      </Card>

      <Modal 
        title={editingFault ? '编辑故障记录' : '新建故障报告'} 
        open={isModalVisible} 
        onOk={handleSave} 
        onCancel={() => setIsModalVisible(false)} 
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择故障设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                  <Select.Option value="C号采煤机">C号采煤机</Select.Option>
                  <Select.Option value="皮带输送机">皮带输送机</Select.Option>
                  <Select.Option value="2号皮带输送机">2号皮带输送机</Select.Option>
                  <Select.Option value="通风机">通风机</Select.Option>
                  <Select.Option value="排水泵">排水泵</Select.Option>
                  <Select.Option value="破碎机">破碎机</Select.Option>
                  <Select.Option value="装载机">装载机</Select.Option>
                  <Select.Option value="提升机">提升机</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="故障类型" name="faultType" rules={[{ required: true }]}>
                <Select placeholder="请选择故障类型">
                  <Select.Option value="机械故障">机械故障</Select.Option>
                  <Select.Option value="电气故障">电气故障</Select.Option>
                  <Select.Option value="液压故障">液压故障</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="故障描述" name="description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述故障现象" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="报告人" name="reporter" rules={[{ required: true }]}>
                <Input placeholder="请输入报告人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="处理人" name="assignee" rules={[{ required: true }]}>
                <Input placeholder="请输入处理人姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="解决方案" name="solution">
            <TextArea rows={3} placeholder="请输入解决方案（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FaultManagement;
