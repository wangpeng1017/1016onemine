import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Row, Col, Progress, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface RepairPlan {
  key: string;
  planId: string;
  equipment: string;
  repairType: string;
  planDate: string;
  actualDate: string;
  responsible: string;
  status: string;
  progress: number;
  description: string;
  budget: number;
}

const RepairPlan: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RepairPlan | null>(null);
  const [editingRecord, setEditingRecord] = useState<RepairPlan | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  const [records, setRecords] = useState<RepairPlan[]>([
    {
      key: '1',
      planId: 'REP-001',
      equipment: 'A号采煤机',
      repairType: '大修',
      planDate: '2024-06-15',
      actualDate: '2024-06-16',
      responsible: '检修队张队长',
      status: '进行中',
      progress: 65,
      description: '更换截割头、检修液压系统',
      budget: 50000,
    },
    {
      key: '2',
      planId: 'REP-002',
      equipment: '皮带输送机',
      repairType: '中修',
      planDate: '2024-06-20',
      actualDate: '',
      responsible: '机电队李工',
      status: '计划中',
      progress: 0,
      description: '更换传动滚筒、调整皮带张紧度',
      budget: 20000,
    },
    {
      key: '3',
      planId: 'REP-003',
      equipment: '主通风机',
      repairType: '小修',
      planDate: '2024-06-10',
      actualDate: '2024-06-10',
      responsible: '通风队王师傅',
      status: '已完成',
      progress: 100,
      description: '清理叶轮、检查轴承',
      budget: 8000,
    },
    {
      key: '4',
      planId: 'REP-004',
      equipment: 'B号采煤机',
      repairType: '大修',
      planDate: '2024-07-01',
      actualDate: '',
      responsible: '检修队李队长',
      status: '计划中',
      progress: 0,
      description: '全面检修、更换主要部件',
      budget: 80000,
    },
    {
      key: '5',
      planId: 'REP-005',
      equipment: '破碎机',
      repairType: '中修',
      planDate: '2024-06-25',
      actualDate: '2024-06-26',
      responsible: '机电队赵工',
      status: '进行中',
      progress: 40,
      description: '更换锤头、检修电机',
      budget: 25000,
    },
    {
      key: '6',
      planId: 'REP-006',
      equipment: '装载机',
      repairType: '小修',
      planDate: '2024-06-18',
      actualDate: '2024-06-18',
      responsible: '设备队孙师傅',
      status: '已完成',
      progress: 100,
      description: '更换液压油、检查油缸',
      budget: 6000,
    },
    {
      key: '7',
      planId: 'REP-007',
      equipment: '排水泵',
      repairType: '中修',
      planDate: '2024-07-05',
      actualDate: '',
      responsible: '维修班周班长',
      status: '计划中',
      progress: 0,
      description: '更换叶轮、密封件检修',
      budget: 18000,
    },
    {
      key: '8',
      planId: 'REP-008',
      equipment: 'C号采煤机',
      repairType: '小修',
      planDate: '2024-06-22',
      actualDate: '2024-06-22',
      responsible: '检修工吴师傅',
      status: '已完成',
      progress: 100,
      description: '更换截割齿、调整链条',
      budget: 12000,
    },
    {
      key: '9',
      planId: 'REP-009',
      equipment: '2号皮带输送机',
      repairType: '中修',
      planDate: '2024-06-28',
      actualDate: '2024-06-29',
      responsible: '输送班郑工',
      status: '进行中',
      progress: 55,
      description: '更换皮带、调整导向轮',
      budget: 22000,
    },
    {
      key: '10',
      planId: 'REP-010',
      equipment: '提升机',
      repairType: '大修',
      planDate: '2024-07-10',
      actualDate: '',
      responsible: '提升班冯队长',
      status: '计划中',
      progress: 0,
      description: '更换钢丝绳、检修制动系统',
      budget: 60000,
    },
  ]);

  const columns: ColumnsType<RepairPlan> = [
    { title: '计划ID', dataIndex: 'planId', key: 'planId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '检修类型', dataIndex: 'repairType', key: 'repairType', width: 100 },
    { title: '计划日期', dataIndex: 'planDate', key: 'planDate', width: 120 },
    { title: '负责人', dataIndex: 'responsible', key: 'responsible', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = '';
        if (status === '计划中') color = 'default';
        else if (status === '进行中') color = 'processing';
        else color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: '预算(元)',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget: number) => budget.toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setIsDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.status === '进行中' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleComplete(record)}>
              完成
            </Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: RepairPlan) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: RepairPlan) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除检修计划 ${record.planId} 吗？`,
      onOk() {
        setRecords(prev => prev.filter(r => r.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const handleComplete = (record: RepairPlan) => {
    setRecords(prev => prev.map(r => r.key === record.key ? { ...r, status: '已完成', progress: 100 } : r));
    message.success('检修计划完成');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const payload: Partial<RepairPlan> = { ...values };
      if (editingRecord) {
        setRecords(prev => prev.map(r => r.key === editingRecord.key ? { ...editingRecord, ...payload } as RepairPlan : r));
        message.success('检修计划更新成功');
      } else {
        const newRecord: RepairPlan = {
          ...payload,
          key: String(records.length + 1),
          planId: `REP-${String(records.length + 1).padStart(3, '0')}`,
          status: '计划中',
          progress: 0,
          actualDate: '',
        } as RepairPlan;
        setRecords(prev => [newRecord, ...prev]);
        message.success('检修计划创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getFilteredRecords = () => {
    let filtered = records;
    if (searchText) {
      filtered = filtered.filter(r =>
        r.planId.toLowerCase().includes(searchText.toLowerCase()) ||
        r.equipment.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) filtered = filtered.filter(r => r.status === filterStatus);
    if (filterType) filtered = filtered.filter(r => r.repairType === filterType);
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
              placeholder="搜索计划ID/设备" 
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
              <Select.Option value="计划中">计划中</Select.Option>
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="检修类型" 
              allowClear 
              style={{ width: '100%' }} 
              value={filterType} 
              onChange={setFilterType}
            >
              <Select.Option value="小修">小修</Select.Option>
              <Select.Option value="中修">中修</Select.Option>
              <Select.Option value="大修">大修</Select.Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button onClick={handleResetFilter}>重置</Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>创建计划</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="检修计划管理">
        <Table 
          columns={columns} 
          dataSource={getFilteredRecords()} 
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} 
          scroll={{ x: 1400 }} 
        />
      </Card>

      <Modal 
        title={editingRecord ? '编辑检修计划' : '创建检修计划'} 
        open={isModalVisible} 
        onOk={handleSave} 
        onCancel={() => setIsModalVisible(false)} 
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                  <Select.Option value="皮带输送机">皮带输送机</Select.Option>
                  <Select.Option value="主通风机">主通风机</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检修类型" name="repairType" rules={[{ required: true }]}>
                <Select placeholder="请选择检修类型">
                  <Select.Option value="小修">小修</Select.Option>
                  <Select.Option value="中修">中修</Select.Option>
                  <Select.Option value="大修">大修</Select.Option>
                  <Select.Option value="应急检修">应急检修</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划开始时间" name="planStartDate" rules={[{ required: true }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="计划结束时间" name="planEndDate" rules={[{ required: true }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责人" name="responsible" rules={[{ required: true }]}>
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预算(元)" name="budget" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入检修预算" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="检修内容" name="description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述检修内容和要求" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 检修计划详情模态框 */}
      <Modal 
        title="检修计划详情" 
        open={isDetailVisible} 
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="计划ID">{selectedRecord.planId}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{selectedRecord.equipment}</Descriptions.Item>
              <Descriptions.Item label="检修类型">{selectedRecord.repairType}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedRecord.responsible}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{selectedRecord.planDate}</Descriptions.Item>
              <Descriptions.Item label="实际日期">
                {selectedRecord.actualDate || '未开始'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  selectedRecord.status === '计划中' ? 'default' : 
                  selectedRecord.status === '进行中' ? 'processing' : 'success'
                }>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="预算">
                ¥{selectedRecord.budget.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="检修内容" span={2}>
                {selectedRecord.description}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 16 }}>
              <h4>检修进度</h4>
              <Progress 
                percent={selectedRecord.progress} 
                status={selectedRecord.progress === 100 ? 'success' : 'active'}
                strokeWidth={10}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RepairPlan;