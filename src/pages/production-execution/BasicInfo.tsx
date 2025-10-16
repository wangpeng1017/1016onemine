import React, { useState } from 'react';
import { Tabs, Table, Button, Card, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Capacity {
  key: string;
  name: string;
  annualCapacity: number;
  dailyCapacity: number;
}

interface Team {
  key: string;
  name: string;
  type: string;
  personnel: number;
  manager: string;
}

interface Equipment {
  key: string;
  name: string;
  model: string;
  quantity: number;
  status: string;
}

interface Resource {
  key: string;
  name: string;
  area: number;
  type: string;
  status: string;
}

const BasicInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('capacity');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form] = Form.useForm();

  const capacityData: Capacity[] = [
    { key: '1', name: '全矿核定能力', annualCapacity: 2400000, dailyCapacity: 7000 },
    { key: '2', name: '1号采区', annualCapacity: 1200000, dailyCapacity: 3500 },
    { key: '3', name: '2号采区', annualCapacity: 1200000, dailyCapacity: 3500 },
  ];

  const teamData: Team[] = [
    { key: '1', name: '采煤一队', type: '自营队', personnel: 120, manager: '张队长' },
    { key: '2', name: '采煤二队', type: '自营队', personnel: 115, manager: '李队长' },
    { key: '3', name: '运输队', type: '外委队', personnel: 80, manager: '王经理' },
  ];

  const equipmentData: Equipment[] = [
    { key: '1', name: '综采设备', model: 'MG2/615-WD', quantity: 4, status: '正常' },
    { key: '2', name: '刮板输送机', model: 'SGZ-1000', quantity: 8, status: '正常' },
    { key: '3', name: '皮带输送机', model: 'DTⅡ-2250', quantity: 6, status: '维修中' },
    { key: '4', name: '采煤机', model: 'MG-350', quantity: 5, status: '正常' },
  ];

  const resourceData: Resource[] = [
    { key: '1', name: '土台阶', area: 450, type: '剥离区', status: '开采中' },
    { key: '2', name: '岩台阶', area: 320, type: '剥离区', status: '开采中' },
    { key: '3', name: '煤台阶A', area: 280, type: '采煤区', status: '开采中' },
    { key: '4', name: '煤台阶B', area: 200, type: '采煤区', status: '待采' },
  ];

  const capacityColumns: ColumnsType<Capacity> = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 150 },
    {
      title: '年度核定能力(吨)',
      dataIndex: 'annualCapacity',
      key: 'annualCapacity',
      width: 150,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '日均能力(吨)',
      dataIndex: 'dailyCapacity',
      key: 'dailyCapacity',
      width: 150,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const teamColumns: ColumnsType<Team> = [
    { title: '队伍名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '队伍类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '人数', dataIndex: 'personnel', key: 'personnel', width: 100 },
    { title: '负责人', dataIndex: 'manager', key: 'manager', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const equipmentColumns: ColumnsType<Equipment> = [
    { title: '设备名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '设备型号', dataIndex: 'model', key: 'model', width: 150 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const resourceColumns: ColumnsType<Resource> = [
    { title: '台阶名称', dataIndex: 'name', key: 'name', width: 120 },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (val: number) => val.toLocaleString(),
    },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = (type: string) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('保存成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const tabItems = [
    {
      key: 'capacity',
      label: '生产能力管理',
      children: (
        <Card
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd('capacity')}
            >
              添加能力
            </Button>
          }
        >
          <Table columns={capacityColumns} dataSource={capacityData} pagination={false} />
        </Card>
      ),
    },
    {
      key: 'team',
      label: '队伍管理',
      children: (
        <Card
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd('team')}
            >
              添加队伍
            </Button>
          }
        >
          <Table columns={teamColumns} dataSource={teamData} pagination={false} />
        </Card>
      ),
    },
    {
      key: 'equipment',
      label: '设备管理',
      children: (
        <Card
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd('equipment')}
            >
              添加设备
            </Button>
          }
        >
          <Table columns={equipmentColumns} dataSource={equipmentData} pagination={false} />
        </Card>
      ),
    },
    {
      key: 'resource',
      label: '地质资源管理',
      children: (
        <Card
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd('resource')}
            >
              添加资源
            </Button>
          }
        >
          <Table columns={resourceColumns} dataSource={resourceData} pagination={false} />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Card title="基础信息管理">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <Modal
        title={`添加${modalType === 'capacity' ? '生产能力' : modalType === 'team' ? '队伍' : modalType === 'equipment' ? '设备' : '资源'}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>

          {modalType === 'capacity' && (
            <>
              <Form.Item
                label="年度核定能力(吨)"
                name="annualCapacity"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item
                label="日均能力(吨)"
                name="dailyCapacity"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </>
          )}

          {modalType === 'team' && (
            <>
              <Form.Item
                label="队伍类型"
                name="type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="自营队">自营队</Select.Option>
                  <Select.Option value="外委队">外委队</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="人数" name="personnel" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item label="负责人" name="manager" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}

          {modalType === 'equipment' && (
            <>
              <Form.Item label="设备型号" name="model" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="数量" name="quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </>
          )}

          {modalType === 'resource' && (
            <>
              <Form.Item label="面积(m²)" name="area" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="剥离区">剥离区</Select.Option>
                  <Select.Option value="采煤区">采煤区</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default BasicInfo;
