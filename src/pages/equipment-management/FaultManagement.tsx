import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
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

  const mockData: Fault[] = [
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
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">查看</Button>
          {record.status !== '已完成' && (
            <Button type="link" size="small" icon={<CheckOutlined />}>处理</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('故障报告提交成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="设备故障管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            故障报告
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>

      <Modal title="故障报告" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择故障设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                  <Select.Option value="皮带输送机">皮带输送机</Select.Option>
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
          <Form.Item label="报告人" name="reporter" rules={[{ required: true }]}>
            <Input placeholder="请输入报告人姓名" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FaultManagement;