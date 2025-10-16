import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Tabs, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface PlanRecord {
  key: string;
  planName: string;
  year: number;
  month?: number;
  area: string;
  targetAmount: number;
  equipment: string;
  personnel: number;
  status: string;
}

const CoalOperationPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('annual');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const annualData: PlanRecord[] = [
    {
      key: '1',
      planName: '2024年度原煤作业计划',
      year: 2024,
      area: '全矿区',
      targetAmount: 2000000,
      equipment: '综采设备12台',
      personnel: 450,
      status: 'published',
    },
    {
      key: '2',
      planName: '2025年度原煤作业计划',
      year: 2025,
      area: '全矿区',
      targetAmount: 2200000,
      equipment: '综采设备15台',
      personnel: 480,
      status: 'draft',
    },
  ];

  const monthlyData: PlanRecord[] = [
    {
      key: '1',
      planName: '2024年6月原煤作业计划',
      year: 2024,
      month: 6,
      area: '1号采区',
      targetAmount: 180000,
      equipment: '综采设备4台',
      personnel: 120,
      status: 'published',
    },
    {
      key: '2',
      planName: '2024年7月原煤作业计划',
      year: 2024,
      month: 7,
      area: '1号采区',
      targetAmount: 185000,
      equipment: '综采设备4台',
      personnel: 120,
      status: 'pending',
    },
    {
      key: '3',
      planName: '2024年7月原煤作业计划',
      year: 2024,
      month: 7,
      area: '2号采区',
      targetAmount: 95000,
      equipment: '综采设备2台',
      personnel: 60,
      status: 'draft',
    },
  ];

  const statusMap: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'processing', text: '待审批' },
    published: { color: 'blue', text: '已发布' },
  };

  const columns: ColumnsType<PlanRecord> = [
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 220,
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 80,
    },
    ...(activeTab === 'monthly'
      ? [
          {
            title: '月份',
            dataIndex: 'month',
            key: 'month',
            width: 80,
            render: (month: number) => `${month}月`,
          },
        ]
      : []),
    {
      title: '作业区域',
      dataIndex: 'area',
      key: 'area',
      width: 120,
    },
    {
      title: '目标产量(吨)',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      width: 130,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '所需设备',
      dataIndex: 'equipment',
      key: 'equipment',
      width: 150,
    },
    {
      title: '所需人力',
      dataIndex: 'personnel',
      key: 'personnel',
      width: 100,
      render: (value: number) => `${value}人`,
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
      title: '操作',
      key: 'action',
      width: 180,
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
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    setIsModalVisible(true);
    form.setFieldsValue({ year: 2024, month: activeTab === 'monthly' ? 6 : undefined });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      message.success('作业计划创建成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const tabItems = [
    {
      key: 'annual',
      label: '年度计划',
      children: (
        <Table
          columns={columns.filter((col) => 'dataIndex' in col && col.dataIndex !== 'month')}
          dataSource={annualData}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: 'monthly',
      label: '月度计划',
      children: (
        <Table
          columns={columns}
          dataSource={monthlyData}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1300 }}
        />
      ),
    },
  ];

  return (
    <div>
      <Card
        title="原煤作业计划"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建{activeTab === 'annual' ? '年度' : '月度'}计划
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      <Modal
        title={`创建${activeTab === 'annual' ? '年度' : '月度'}原煤作业计划`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="计划名称"
            name="planName"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入计划名称" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="年份"
              name="year"
              rules={[{ required: true, message: '请选择年份' }]}
            >
              <Select style={{ width: 120 }}>
                <Select.Option value={2024}>2024</Select.Option>
                <Select.Option value={2025}>2025</Select.Option>
              </Select>
            </Form.Item>
            {activeTab === 'monthly' && (
              <Form.Item
                label="月份"
                name="month"
                rules={[{ required: true, message: '请选择月份' }]}
              >
                <Select style={{ width: 120 }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <Select.Option key={m} value={m}>
                      {m}月
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Space>
          <Form.Item
            label="作业区域"
            name="area"
            rules={[{ required: true, message: '请输入作业区域' }]}
          >
            <Input placeholder="请输入作业区域" />
          </Form.Item>
          <Form.Item
            label="目标产量(吨)"
            name="targetAmount"
            rules={[{ required: true, message: '请输入目标产量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入目标产量" />
          </Form.Item>
          <Form.Item
            label="所需设备"
            name="equipment"
            rules={[{ required: true, message: '请输入所需设备' }]}
          >
            <Input placeholder="请输入所需设备" />
          </Form.Item>
          <Form.Item
            label="所需人力"
            name="personnel"
            rules={[{ required: true, message: '请输入所需人力' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入所需人力" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoalOperationPlan;
