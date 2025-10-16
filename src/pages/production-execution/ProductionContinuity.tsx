import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Statistic, Row, Col, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface PlanRecord {
  key: string;
  planName: string;
  period: string;
  targetOre: number;
  targetRock: number;
  status: string;
  createTime: string;
  creator: string;
}

const ProductionContinuity: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const mockData: PlanRecord[] = [
    {
      key: '1',
      planName: '2024年度采剥接续计划',
      period: '2024-01 至 2024-12',
      targetOre: 500000,
      targetRock: 300000,
      status: 'approved',
      createTime: '2024-01-05',
      creator: '张三',
    },
    {
      key: '2',
      planName: '2024年Q2季度采剥计划',
      period: '2024-04 至 2024-06',
      targetOre: 125000,
      targetRock: 75000,
      status: 'published',
      createTime: '2024-03-20',
      creator: '李四',
    },
    {
      key: '3',
      planName: '2024年6月采剥计划',
      period: '2024-06-01 至 2024-06-30',
      targetOre: 42000,
      targetRock: 25000,
      status: 'draft',
      createTime: '2024-05-25',
      creator: '王五',
    },
    {
      key: '4',
      planName: '南部采区中长期计划',
      period: '2024-07 至 2025-06',
      targetOre: 800000,
      targetRock: 480000,
      status: 'pending',
      createTime: '2024-06-10',
      creator: '赵六',
    },
  ];

  const statusMap: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'processing', text: '待审批' },
    approved: { color: 'success', text: '已批准' },
    published: { color: 'blue', text: '已发布' },
    rejected: { color: 'error', text: '已驳回' },
  };

  const columns: ColumnsType<PlanRecord> = [
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
    },
    {
      title: '计划周期',
      dataIndex: 'period',
      key: 'period',
      width: 180,
    },
    {
      title: '目标矿石量(吨)',
      dataIndex: 'targetOre',
      key: 'targetOre',
      width: 130,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '目标岩石量(吨)',
      dataIndex: 'targetRock',
      key: 'targetRock',
      width: 130,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status === 'draft' && (
            <Button type="link" size="small" icon={<EditOutlined />}>
              编辑
            </Button>
          )}
          {record.status === 'pending' && (
            <Button type="link" size="small" icon={<CheckOutlined />}>
              审批
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreatePlan = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="在编计划" value={1} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待审批" value={1} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已发布" value={1} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="年度总目标" value={500000} suffix="吨" />
          </Card>
        </Col>
      </Row>

      <Card
        title="生产接续计划列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePlan}>
            创建计划
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="创建生产接续计划"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="计划名称"
            name="planName"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入计划名称" />
          </Form.Item>
          <Form.Item
            label="计划周期"
            name="period"
            rules={[{ required: true, message: '请选择计划周期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="目标矿石量(吨)"
                name="targetOre"
                rules={[{ required: true, message: '请输入目标矿石量' }]}
              >
                <Input type="number" placeholder="请输入目标矿石量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="目标岩石量(吨)"
                name="targetRock"
                rules={[{ required: true, message: '请输入目标岩石量' }]}
              >
                <Input type="number" placeholder="请输入目标岩石量" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="备注说明" name="remark">
            <TextArea rows={4} placeholder="请输入备注说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductionContinuity;
