import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, message, Space, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface InspectionPlan {
  key: string;
  taskId: string;
  equipment: string;
  inspectionType: string;
  frequency: string;
  assignee: string;
  status: string;
  nextDate: string;
}

interface InspectionRecord {
  key: string;
  taskId: string;
  equipment: string;
  inspectionType: string;
  inspector: string;
  date: string;
  result: string;
  remark: string;
}

const InspectionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const [plansData, setPlansData] = useState<InspectionPlan[]>([
    { key: '1', taskId: 'INS-001', equipment: 'A号采煤机', inspectionType: '润滑系统', frequency: '每日早班', assignee: '张三', status: '进行中', nextDate: '2024-06-11' },
    { key: '2', taskId: 'INS-002', equipment: 'B号采煤机', inspectionType: '液压系统', frequency: '每周一', assignee: '李四', status: '待执行', nextDate: '2024-06-17' },
    { key: '3', taskId: 'INS-003', equipment: '皮带输送机', inspectionType: '运转状态', frequency: '每日', assignee: '王五', status: '已完成', nextDate: '2024-06-11' },
    { key: '4', taskId: 'INS-004', equipment: '电铲', inspectionType: '电气系统', frequency: '每周', assignee: '赵六', status: '进行中', nextDate: '2024-06-14' },
    { key: '5', taskId: 'INS-005', equipment: '通风机', inspectionType: '轴承检查', frequency: '每月', assignee: '陈七', status: '待执行', nextDate: '2024-07-01' },
    { key: '6', taskId: 'INS-006', equipment: '排水泵', inspectionType: '泵体检查', frequency: '每周', assignee: '刘八', status: '进行中', nextDate: '2024-06-13' },
    { key: '7', taskId: 'INS-007', equipment: 'C号采煤机', inspectionType: '冷却系统', frequency: '每日', assignee: '张三', status: '已完成', nextDate: '2024-06-12' },
    { key: '8', taskId: 'INS-008', equipment: '装载机', inspectionType: '液压油', frequency: '每周', assignee: '李四', status: '待执行', nextDate: '2024-06-15' },
    { key: '9', taskId: 'INS-009', equipment: '破碎机', inspectionType: '锤头磨损', frequency: '每日', assignee: '王五', status: '进行中', nextDate: '2024-06-11' },
    { key: '10', taskId: 'INS-010', equipment: '2号皮带输送机', inspectionType: '皮带紧度', frequency: '每周', assignee: '黄九', status: '待执行', nextDate: '2024-06-16' },
  ]);

  const [recordsData, setRecordsData] = useState<InspectionRecord[]>([
    { key: '1', taskId: 'INS-001', equipment: 'A号采煤机', inspectionType: '润滑系统', inspector: '张三', date: '2024-06-10', result: '正常', remark: '润滑油充足' },
    { key: '2', taskId: 'INS-003', equipment: '皮带输送机', inspectionType: '运转状态', inspector: '王五', date: '2024-06-10', result: '异常', remark: '发现皮带磨损' },
    { key: '3', taskId: 'INS-002', equipment: 'B号采煤机', inspectionType: '液压系统', inspector: '李四', date: '2024-06-09', result: '正常', remark: '液压系统运行良好' },
    { key: '4', taskId: 'INS-004', equipment: '电铲', inspectionType: '电气系统', inspector: '赵六', date: '2024-06-09', result: '正常', remark: '电气参数正常' },
    { key: '5', taskId: 'INS-006', equipment: '排水泵', inspectionType: '泵体检查', inspector: '刘八', date: '2024-06-08', result: '异常', remark: '发现轻微渗漏' },
    { key: '6', taskId: 'INS-007', equipment: 'C号采煤机', inspectionType: '冷却系统', inspector: '张三', date: '2024-06-08', result: '正常', remark: '冷却水清洁' },
    { key: '7', taskId: 'INS-009', equipment: '破碎机', inspectionType: '锤头磨损', inspector: '王五', date: '2024-06-07', result: '异常', remark: '锤头磨损较严重' },
    { key: '8', taskId: 'INS-005', equipment: '通风机', inspectionType: '轴承检查', inspector: '陈七', date: '2024-06-07', result: '正常', remark: '轴承运转正常' },
    { key: '9', taskId: 'INS-008', equipment: '装载机', inspectionType: '液压油', inspector: '李四', date: '2024-06-06', result: '正常', remark: '液压油质量良好' },
    { key: '10', taskId: 'INS-010', equipment: '2号皮带输送机', inspectionType: '皮带紧度', inspector: '黄九', date: '2024-06-06', result: '正常', remark: '皮帧紧度合适' },
  ]);

  const plansColumns: ColumnsType<InspectionPlan> = [
    { title: '任务ID', dataIndex: 'taskId', key: 'taskId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '检查类型', dataIndex: 'inspectionType', key: 'inspectionType', width: 130 },
    { title: '频率', dataIndex: 'frequency', key: 'frequency', width: 130 },
    { title: '指派人', dataIndex: 'assignee', key: 'assignee', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '进行中' ? 'processing' : status === '已完成' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    { title: '下次检查日期', dataIndex: 'nextDate', key: 'nextDate', width: 130 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<CheckOutlined />}>完成</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeletePlan(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const recordsColumns: ColumnsType<InspectionRecord> = [
    { title: '任务ID', dataIndex: 'taskId', key: 'taskId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '检查类型', dataIndex: 'inspectionType', key: 'inspectionType', width: 130 },
    { title: '检查人', dataIndex: 'inspector', key: 'inspector', width: 100 },
    { title: '检查日期', dataIndex: 'date', key: 'date', width: 120 },
    {
      title: '检查结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => (
        <Tag color={result === '正常' ? 'green' : 'red'}>{result}</Tag>
      ),
    },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 200 },
  ];

  const handleAddPlan = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('点检计划创建成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDeletePlan = (record: InspectionPlan) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除计划 ${record.taskId} 吗？`,
      onOk() {
        setPlansData(prev => prev.filter(item => item.key !== record.key));
        message.success('删除成功');
      },
    });
  };

  const getFilteredPlans = () => {
    let filtered = plansData;
    if (searchText) {
      filtered = filtered.filter(item => 
        item.equipment.toLowerCase().includes(searchText.toLowerCase()) ||
        item.taskId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    return filtered;
  };

  const handleResetFilter = () => {
    setSearchText('');
    setFilterStatus(undefined);
  };

  return (
    <div>
      {activeTab === 'plans' ? (
        <Card
          title="点检计划管理"
          extra={
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
                新建计划
              </Button>
              <Select value={activeTab} onChange={setActiveTab} style={{ width: 150 }}>
                <Select.Option value="plans">点检计划</Select.Option>
                <Select.Option value="records">检查记录</Select.Option>
              </Select>
            </Space>
          }
        >
          <Table columns={plansColumns} dataSource={plansData} pagination={false} scroll={{ x: 1200 }} />
        </Card>
      ) : (
        <Card
          title="点检记录查询"
          extra={
            <Select value={activeTab} onChange={setActiveTab} style={{ width: 150 }}>
              <Select.Option value="plans">点检计划</Select.Option>
              <Select.Option value="records">检查记录</Select.Option>
            </Select>
          }
        >
          <Table columns={recordsColumns} dataSource={recordsData} pagination={false} scroll={{ x: 1000 }} />
        </Card>
      )}

      <Modal
        title="创建新的点检计划"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                  <Select.Option value="皮带输送机">皮带输送机</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检查类型" name="inspectionType" rules={[{ required: true }]}>
                <Input placeholder="请输入检查类型" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="检查频率" name="frequency" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="每日">每日</Select.Option>
                  <Select.Option value="每周">每周</Select.Option>
                  <Select.Option value="每月">每月</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="指派人员" name="assignee" rules={[{ required: true }]}>
                <Input placeholder="请输入指派人员" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default InspectionManagement;
