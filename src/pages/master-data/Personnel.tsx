import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface PersonnelData {
  key: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: string;
  hireDate: string;
  qualifications: string[];
  permissions: string;
}

const Personnel: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PersonnelData | null>(null);
  const [form] = Form.useForm();

  const mockData: PersonnelData[] = [
    {
      key: '1',
      employeeId: 'EMP001',
      name: '张三',
      department: '采煤一队',
      position: '班长',
      phone: '13800138001',
      email: 'zhangsan@mine.com',
      status: '在职',
      hireDate: '2020-01-15',
      qualifications: ['采煤工证', '班组长证', '安全员证'],
      permissions: '现场作业管理',
    },
    {
      key: '2',
      employeeId: 'EMP002',
      name: '李四',
      department: '机电队',
      position: '技术员',
      phone: '13800138002',
      email: 'lisi@mine.com',
      status: '在职',
      hireDate: '2019-06-20',
      qualifications: ['电工证', '设备维修证'],
      permissions: '设备管理',
    },
    {
      key: '3',
      employeeId: 'EMP003',
      name: '王五',
      department: '安监科',
      position: '安全员',
      phone: '13800138003',
      email: 'wangwu@mine.com',
      status: '在职',
      hireDate: '2021-03-10',
      qualifications: ['安全工程师证', '注册安全师'],
      permissions: '安全监督',
    },
  ];

  const columns: ColumnsType<PersonnelData> = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 100 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '岗位', dataIndex: 'position', key: 'position', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '入职时间', dataIndex: 'hireDate', key: 'hireDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '在职' ? 'success' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
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
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('人员信息添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="人员管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加人员
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
      </Card>

      {/* 添加人员模态框 */}
      <Modal title="添加人员" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={800}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="工号" name="employeeId" rules={[{ required: true }]}>
                <Input placeholder="请输入工号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" name="department" rules={[{ required: true }]}>
                <Select placeholder="请选择部门">
                  <Select.Option value="采煤一队">采煤一队</Select.Option>
                  <Select.Option value="采煤二队">采煤二队</Select.Option>
                  <Select.Option value="机电队">机电队</Select.Option>
                  <Select.Option value="安监科">安监科</Select.Option>
                  <Select.Option value="调度室">调度室</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="岗位" name="position" rules={[{ required: true }]}>
                <Input placeholder="请输入岗位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone" rules={[{ required: true }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="邮箱" name="email">
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入职时间" name="hireDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="权限等级" name="permissions" rules={[{ required: true }]}>
                <Select placeholder="请选择权限等级">
                  <Select.Option value="现场作业管理">现场作业管理</Select.Option>
                  <Select.Option value="设备管理">设备管理</Select.Option>
                  <Select.Option value="安全监督">安全监督</Select.Option>
                  <Select.Option value="系统管理">系统管理</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="资质证书" name="qualifications">
            <Select mode="multiple" placeholder="请选择资质证书">
              <Select.Option value="采煤工证">采煤工证</Select.Option>
              <Select.Option value="电工证">电工证</Select.Option>
              <Select.Option value="安全员证">安全员证</Select.Option>
              <Select.Option value="班组长证">班组长证</Select.Option>
              <Select.Option value="安全工程师证">安全工程师证</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 人员详情模态框 */}
      <Modal 
        title="人员详情" 
        open={isDetailVisible} 
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="工号">{selectedRecord.employeeId}</Descriptions.Item>
            <Descriptions.Item label="姓名">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="部门">{selectedRecord.department}</Descriptions.Item>
            <Descriptions.Item label="岗位">{selectedRecord.position}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedRecord.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedRecord.email}</Descriptions.Item>
            <Descriptions.Item label="入职时间">{selectedRecord.hireDate}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedRecord.status === '在职' ? 'success' : 'default'}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="权限等级">{selectedRecord.permissions}</Descriptions.Item>
            <Descriptions.Item label="资质证书">
              {selectedRecord.qualifications.map(qual => (
                <Tag key={qual} style={{ marginBottom: 4 }}>{qual}</Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Personnel;