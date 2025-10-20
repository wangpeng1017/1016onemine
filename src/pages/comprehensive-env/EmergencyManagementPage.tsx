import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, Select, Tag, Space, message, Alert } from 'antd';
import { WarningOutlined, PlusOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { emergencyPlanService, drillRecordService } from '../../services/environmentalMockService';
import type { EmergencyPlan, DrillRecord } from '../../types/environmental';

const { TextArea } = Input;
const { Option } = Select;

const EmergencyManagementPage: React.FC = () => {
  const [plans, setPlans] = useState<EmergencyPlan[]>([]);
  const [drills, setDrills] = useState<DrillRecord[]>([]);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [drillModalVisible, setDrillModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EmergencyPlan | null>(null);
  const [planForm] = Form.useForm();
  const [drillForm] = Form.useForm();

  useEffect(() => {
    setPlans(emergencyPlanService.getAll());
    setDrills(drillRecordService.getAll());
  }, []);

  const statusLabels = {
    draft: '草稿',
    under_review: '审批中',
    approved: '已批准',
    published: '已发布'
  };

  const statusColors = {
    draft: 'default',
    under_review: 'processing',
    approved: 'success',
    published: 'cyan'
  };

  const planColumns = [
    { title: '预案名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '适用场景', dataIndex: 'scenario', key: 'scenario', width: 150 },
    { title: '执行部门', dataIndex: 'executingDept', key: 'executingDept', width: 120 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status: EmergencyPlan['status']) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      )
    },
    { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
    { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: EmergencyPlan) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditPlan(record)}>
            编辑
          </Button>
          {record.status === 'draft' && (
            <Button type="link" size="small" onClick={() => handleUpdateStatus(record.id, 'under_review')}>
              提交审批
            </Button>
          )}
          {record.status === 'under_review' && (
            <Button type="link" size="small" onClick={() => handleUpdateStatus(record.id, 'approved')}>
              批准
            </Button>
          )}
          {record.status === 'approved' && (
            <Button type="link" size="small" onClick={() => handleUpdateStatus(record.id, 'published')}>
              发布
            </Button>
          )}
        </Space>
      )
    }
  ];

  const drillColumns = [
    { title: '演练日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '关联预案', dataIndex: 'planId', key: 'planId', render: (id: string) => plans.find(p => p.id === id)?.name || id },
    { title: '参与部门', dataIndex: 'participatingDepts', key: 'participatingDepts', render: (depts: string[]) => depts.join(', ') },
    { title: '演练评价', dataIndex: 'evaluation', key: 'evaluation', ellipsis: true }
  ];

  const handleAddPlan = () => {
    setEditingPlan(null);
    planForm.resetFields();
    setPlanModalVisible(true);
  };

  const handleEditPlan = (plan: EmergencyPlan) => {
    setEditingPlan(plan);
    planForm.setFieldsValue(plan);
    setPlanModalVisible(true);
  };

  const handlePlanSubmit = () => {
    planForm.validateFields().then(values => {
      if (editingPlan) {
        emergencyPlanService.update(editingPlan.id, values);
        message.success('预案已更新');
      } else {
        emergencyPlanService.add({ ...values, status: 'draft', version: 'v1.0' });
        message.success('预案已添加');
      }
      setPlans(emergencyPlanService.getAll());
      setPlanModalVisible(false);
      planForm.resetFields();
    });
  };

  const handleUpdateStatus = (id: string, status: EmergencyPlan['status']) => {
    emergencyPlanService.updateStatus(id, status);
    setPlans(emergencyPlanService.getAll());
    message.success(`状态已更新为: ${statusLabels[status]}`);
  };

  const handleAddDrill = () => {
    drillForm.resetFields();
    setDrillModalVisible(true);
  };

  const handleDrillSubmit = () => {
    drillForm.validateFields().then(values => {
      drillRecordService.add(values);
      setDrills(drillRecordService.getAll());
      message.success('演练记录已添加');
      setDrillModalVisible(false);
      drillForm.resetFields();
    });
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Alert
        message="关联安全模块"
        description={
          <span>
            本模块与"安全管理中心-应急管理"相关联。
            <Button type="link" icon={<LinkOutlined />} onClick={() => message.info('跳转到安全管理中心')}>
              查看安全应急管理
            </Button>
          </span>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Tabs
        items={[
          {
            key: 'plans',
            label: <span><WarningOutlined /> 应急预案管理</span>,
            children: (
              <Card
                title="环保应急预案"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
                    新增预案
                  </Button>
                }
              >
                <Table
                  columns={planColumns}
                  dataSource={plans}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'drills',
            label: '演练管理',
            children: (
              <Card
                title="应急演练记录"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDrill}>
                    新增演练记录
                  </Button>
                }
              >
                <Table
                  columns={drillColumns}
                  dataSource={drills}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />

      <Modal
        title={editingPlan ? '编辑预案' : '新增预案'}
        open={planModalVisible}
        onOk={handlePlanSubmit}
        onCancel={() => setPlanModalVisible(false)}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={planForm} layout="vertical">
          <Form.Item name="name" label="预案名称" rules={[{ required: true, message: '请输入预案名称' }]}>
            <Input placeholder="例如：水污染应急预案" />
          </Form.Item>
          <Form.Item name="scenario" label="适用场景" rules={[{ required: true, message: '请输入适用场景' }]}>
            <Input placeholder="例如：水体污染事故" />
          </Form.Item>
          <Form.Item name="executingDept" label="执行部门" rules={[{ required: true, message: '请输入执行部门' }]}>
            <Input placeholder="例如：环保部" />
          </Form.Item>
          <Form.Item name="supportingDepts" label="配合部门">
            <Select mode="tags" placeholder="输入配合部门">
              <Option value="安全部">安全部</Option>
              <Option value="生产部">生产部</Option>
              <Option value="技术部">技术部</Option>
            </Select>
          </Form.Item>
          <Form.Item name="procedure" label="具体流程" rules={[{ required: true, message: '请输入具体流程' }]}>
            <TextArea rows={4} placeholder="详细描述应急响应流程" />
          </Form.Item>
          <Form.Item name="exceptionHandling" label="异常情况处理">
            <TextArea rows={3} placeholder="描述异常情况的处理方法" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新增演练记录"
        open={drillModalVisible}
        onOk={handleDrillSubmit}
        onCancel={() => setDrillModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={drillForm} layout="vertical">
          <Form.Item name="planId" label="关联预案" rules={[{ required: true, message: '请选择关联预案' }]}>
            <Select placeholder="选择预案">
              {plans.filter(p => p.status === 'published').map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="演练日期" rules={[{ required: true, message: '请输入演练日期' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="participatingDepts" label="参与部门" rules={[{ required: true, message: '请输入参与部门' }]}>
            <Select mode="tags" placeholder="输入参与部门">
              <Option value="环保部">环保部</Option>
              <Option value="安全部">安全部</Option>
              <Option value="生产部">生产部</Option>
            </Select>
          </Form.Item>
          <Form.Item name="evaluation" label="演练评价" rules={[{ required: true, message: '请输入演练评价' }]}>
            <TextArea rows={3} placeholder="描述演练过程和效果评价" />
          </Form.Item>
          <Form.Item name="materialsAllocation" label="物资调配情况">
            <TextArea rows={2} placeholder="记录应急物资的使用和调配情况" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmergencyManagementPage;
