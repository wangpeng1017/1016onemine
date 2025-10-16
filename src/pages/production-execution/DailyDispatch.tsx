import React, { useState } from 'react';
import { Table, Button, Space, Card, Tabs, Modal, Form, Input, Select, TimePicker, message, Tag } from 'antd';
import { PlusOutlined, PhoneOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Contact {
  key: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  mobile: string;
}

interface Shift {
  key: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface Handover {
  key: string;
  date: string;
  shift: string;
  onDuty: string;
  offDuty: string;
  production: string;
  equipment: string;
  safety: string;
}

const DailyDispatch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isShiftModalVisible, setIsShiftModalVisible] = useState(false);
  const [isHandoverModalVisible, setIsHandoverModalVisible] = useState(false);
  const [form] = Form.useForm();

  const contactsData: Contact[] = [
    { key: '1', name: '张三', position: '调度员', department: '调度室', phone: '0351-1234567', mobile: '138****1234' },
    { key: '2', name: '李四', position: '班长', department: '采煤一队', phone: '0351-1234568', mobile: '139****5678' },
    { key: '3', name: '王五', position: '司机', department: '运输队', phone: '0351-1234569', mobile: '137****9012' },
    { key: '4', name: '赵六', position: '维修工', department: '机电队', phone: '0351-1234570', mobile: '136****3456' },
  ];

  const shiftsData: Shift[] = [
    { key: '1', shiftName: '早班', startTime: '08:00', endTime: '16:00', duration: 8 },
    { key: '2', shiftName: '中班', startTime: '16:00', endTime: '24:00', duration: 8 },
    { key: '3', shiftName: '晚班', startTime: '00:00', endTime: '08:00', duration: 8 },
  ];

  const handoverData: Handover[] = [
    {
      key: '1',
      date: '2024-06-10',
      shift: '早班',
      onDuty: '张三',
      offDuty: '李四',
      production: '完成原煤生产1500吨，完成率102%',
      equipment: '1号采煤机正常运行，2号皮带机需维修',
      safety: '无安全事故，发现隐患3处已整改',
    },
    {
      key: '2',
      date: '2024-06-10',
      shift: '中班',
      onDuty: '李四',
      offDuty: '王五',
      production: '完成原煤生产1450吨，完成率98%',
      equipment: '所有设备正常运行',
      safety: '无异常情况',
    },
  ];

  const contactColumns: ColumnsType<Contact> = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '岗位', dataIndex: 'position', key: 'position', width: 120 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '座机', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: '手机', dataIndex: 'mobile', key: 'mobile', width: 130 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<PhoneOutlined />}>呼叫</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  const shiftColumns: ColumnsType<Shift> = [
    { title: '班次名称', dataIndex: 'shiftName', key: 'shiftName', width: 120 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 120 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 120 },
    { title: '时长(小时)', dataIndex: 'duration', key: 'duration', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
      ),
    },
  ];

  const handoverColumns: ColumnsType<Handover> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '班次', dataIndex: 'shift', key: 'shift', width: 80 },
    { title: '交班人', dataIndex: 'onDuty', key: 'onDuty', width: 100 },
    { title: '接班人', dataIndex: 'offDuty', key: 'offDuty', width: 100 },
    { title: '生产情况', dataIndex: 'production', key: 'production', width: 250 },
    { title: '设备状况', dataIndex: 'equipment', key: 'equipment', width: 200 },
    { title: '安全情况', dataIndex: 'safety', key: 'safety', width: 200 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => <Button type="link" size="small">查看详情</Button>,
    },
  ];

  const handleAddContact = () => {
    setIsContactModalVisible(true);
  };

  const handleAddShift = () => {
    setIsShiftModalVisible(true);
  };

  const handleAddHandover = () => {
    setIsHandoverModalVisible(true);
  };

  const handleModalOk = (type: string) => {
    form.validateFields().then(() => {
      message.success(`${type}成功！`);
      setIsContactModalVisible(false);
      setIsShiftModalVisible(false);
      setIsHandoverModalVisible(false);
      form.resetFields();
    });
  };

  const tabItems = [
    {
      key: 'contacts',
      label: '调度通讯录',
      children: (
        <Card extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddContact}>添加联系人</Button>}>
          <Table columns={contactColumns} dataSource={contactsData} pagination={false} />
        </Card>
      ),
    },
    {
      key: 'shifts',
      label: '班次管理',
      children: (
        <Card extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddShift}>添加班次</Button>}>
          <Table columns={shiftColumns} dataSource={shiftsData} pagination={false} />
        </Card>
      ),
    },
    {
      key: 'handover',
      label: '交接班记录',
      children: (
        <Card extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddHandover}>新建记录</Button>}>
          <Table columns={handoverColumns} dataSource={handoverData} pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Card title="日常调度管理">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <Modal title="添加联系人" open={isContactModalVisible} onOk={() => handleModalOk('添加')} onCancel={() => setIsContactModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="岗位" name="position" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="部门" name="department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="座机" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="手机" name="mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="添加班次" open={isShiftModalVisible} onOk={() => handleModalOk('添加')} onCancel={() => setIsShiftModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="班次名称" name="shiftName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="开始时间" name="startTime" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="结束时间" name="endTime" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="新建交接班记录" open={isHandoverModalVisible} onOk={() => handleModalOk('创建')} onCancel={() => setIsHandoverModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }}>
            <Form.Item label="班次" name="shift" rules={[{ required: true }]}>
              <Select style={{ width: 120 }}>
                <Select.Option value="early">早班</Select.Option>
                <Select.Option value="middle">中班</Select.Option>
                <Select.Option value="night">晚班</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="交班人" name="onDuty" rules={[{ required: true }]}>
              <Input style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="接班人" name="offDuty" rules={[{ required: true }]}>
              <Input style={{ width: 120 }} />
            </Form.Item>
          </Space>
          <Form.Item label="生产情况" name="production" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="设备状况" name="equipment" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="安全情况" name="safety" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DailyDispatch;
