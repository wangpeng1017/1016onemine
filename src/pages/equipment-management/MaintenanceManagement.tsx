import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, InputNumber, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
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

  const mockData: MaintenanceTask[] = [
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
  ];

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
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<CheckOutlined />}>完成</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('保养任务创建成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="保养管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建保养任务
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1300 }} />
      </Card>

      <Modal title="创建保养任务" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={700}>
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
