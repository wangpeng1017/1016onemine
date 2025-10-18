import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, InputNumber, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MaintenanceTask {
  key: string;
  taskId: string;
  equipment: string;
  maintenanceType: string;
  cycle: string;
  lastDate: string;
  nextDate: string;
  status: string;
  assignee: string;
}

const MaintenanceManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      key: '1',
      taskId: 'MNT-001',
      equipment: 'A号采煤机',
      maintenanceType: '油液更换',
      cycle: '每500小时',
      lastDate: '2024-05-20',
      nextDate: '2024-07-15',
      status: '待执行',
      assignee: '张三',
    },
    {
      key: '2',
      taskId: 'MNT-002',
      equipment: 'B号采煤机',
      maintenanceType: '部件检修',
      cycle: '每季度',
      lastDate: '2024-03-10',
      nextDate: '2024-06-20',
      status: '进行中',
      assignee: '李四',
    },
    {
      key: '3',
      taskId: 'MNT-003',
      equipment: '皮带输送机',
      maintenanceType: '润滑维护',
      cycle: '每月',
      lastDate: '2024-06-01',
      nextDate: '2024-07-01',
      status: '已完成',
      assignee: '王五',
    },
    {
      key: '4',
      taskId: 'MNT-004',
      equipment: '装载机',
      maintenanceType: '液压系统检查',
      cycle: '每两周',
      lastDate: '2024-06-01',
      nextDate: '2024-06-15',
      status: '进行中',
      assignee: '赵六',
    },
    {
      key: '5',
      taskId: 'MNT-005',
      equipment: '破碎机',
      maintenanceType: '锤头更换',
      cycle: '每月',
      lastDate: '2024-05-28',
      nextDate: '2024-06-28',
      status: '待执行',
      assignee: '钱七',
    },
    {
      key: '6',
      taskId: 'MNT-006',
      equipment: '通风机',
      maintenanceType: '轴承润滑',
      cycle: '每周',
      lastDate: '2024-06-05',
      nextDate: '2024-06-12',
      status: '已完成',
      assignee: '孙八',
    },
    {
      key: '7',
      taskId: 'MNT-007',
      equipment: '排水泵',
      maintenanceType: '密封更换',
      cycle: '每季度',
      lastDate: '2024-04-01',
      nextDate: '2024-07-01',
      status: '待执行',
      assignee: '李四',
    },
    {
      key: '8',
      taskId: 'MNT-008',
      equipment: '2号皮带输送机',
      maintenanceType: '张紧检查',
      cycle: '每周',
      lastDate: '2024-06-03',
      nextDate: '2024-06-10',
      status: '进行中',
      assignee: '王五',
    },
    {
      key: '9',
      taskId: 'MNT-009',
      equipment: 'C号采煤机',
      maintenanceType: '电气检查',
      cycle: '每日',
      lastDate: '2024-06-09',
      nextDate: '2024-06-10',
      status: '已完成',
      assignee: '张三',
    },
    {
      key: '10',
      taskId: 'MNT-010',
      equipment: '装载机',
      maintenanceType: '冷却系统清理',
      cycle: '每月',
      lastDate: '2024-05-15',
      nextDate: '2024-06-15',
      status: '待执行',
      assignee: '赵六',
    },
  ]);

  const columns: ColumnsType<MaintenanceTask> = [
    { title: '任务ID', dataIndex: 'taskId', key: 'taskId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '保养类型', dataIndex: 'maintenanceType', key: 'maintenanceType', width: 120 },
    { title: '周期', dataIndex: 'cycle', key: 'cycle', width: 130 },
    { title: '上次保养', dataIndex: 'lastDate', key: 'lastDate', width: 120 },
    { title: '下次保养', dataIndex: 'nextDate', key: 'nextDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = '';
        if (status === '待执行') color = 'orange';
        else if (status === '进行中') color = 'processing';
        else color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '指派人', dataIndex: 'assignee', key: 'assignee', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (task: MaintenanceTask) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  const handleDelete = (task: MaintenanceTask) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务 ${task.taskId} 吗？`,
      onOk() {
        setTasks(prev => prev.filter(t => t.key !== task.key));
        message.success('删除成功');
      },
    });
  };

  const handleComplete = (task: MaintenanceTask) => {
    setTasks(prev => prev.map(t => t.key === task.key ? { ...t, status: '已完成' } : t));
    message.success('任务标记为已完成');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const payload: Partial<MaintenanceTask> = {
        ...values,
        nextDate: (values.nextDate && (values.nextDate as any).format) ? (values.nextDate as any).format('YYYY-MM-DD') : values.nextDate,
      };
      if (editingTask) {
        setTasks(prev => prev.map(t => t.key === editingTask.key ? { ...editingTask, ...payload } as MaintenanceTask : t));
        message.success('任务更新成功');
      } else {
        const newTask: MaintenanceTask = {
          ...payload,
          key: String(tasks.length + 1),
          taskId: `MNT-${String(tasks.length + 1).padStart(3, '0')}`,
          status: '待执行',
        } as MaintenanceTask;
        setTasks(prev => [newTask, ...prev]);
        message.success('任务创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (searchText) {
      filtered = filtered.filter(t =>
        t.taskId.toLowerCase().includes(searchText.toLowerCase()) ||
        t.equipment.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) filtered = filtered.filter(t => t.status === filterStatus);
    if (filterType) filtered = filtered.filter(t => t.maintenanceType === filterType);
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
            <Input placeholder="搜索任务ID/设备" value={searchText} onChange={(e) => setSearchText(e.target.value)} prefix={<SearchOutlined />} onPressEnter={() => {}} />
          </Col>
          <Col span={4}>
            <Select placeholder="状态" allowClear style={{ width: '100%' }} value={filterStatus} onChange={setFilterStatus}>
              <Select.Option value="待执行">待执行</Select.Option>
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Input placeholder="保养类型(精确匹配)" value={filterType} onChange={(e) => setFilterType(e.target.value)} />
          </Col>
          <Col span={6}>
            <Space>
              <Button onClick={handleResetFilter}>重置</Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建保养任务</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        title="保养管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建保养任务
          </Button>
        }
      >
        <Table columns={columns} dataSource={getFilteredTasks()} pagination={{ pageSize: 10, showTotal: (t)=>`共 ${t} 条` }} scroll={{ x: 1300 }} />
      </Card>

      <Modal title={editingTask ? '编辑保养任务' : '创建保养任务'} open={isModalVisible} onOk={handleSave} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="保养类型" name="maintenanceType" rules={[{ required: true }]}>
                <Input placeholder="请输入保养类型" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="保养周期" name="cycle" rules={[{ required: true }]}>
                <Input placeholder="如：每500小时" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="指派人员" name="assignee" rules={[{ required: true }]}>
                <Input placeholder="请输入指派人员" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="预计完成日期" name="nextDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceManagement;
