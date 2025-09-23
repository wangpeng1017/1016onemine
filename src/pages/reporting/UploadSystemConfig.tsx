import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface ServerConfigItem {
  key: string;
  username: string;
  serverIP: string;
  port: number;
  protocol: 'FTP' | 'SFTP' | 'HTTP';
  directory: string;
  isGlobal: boolean;
}

const UploadSystemConfig: React.FC = () => {
  const [data, setData] = useState<ServerConfigItem[]>([
    {
      key: '1',
      username: 'vsftp',
      serverIP: '172.41.90.16',
      port: 21,
      protocol: 'FTP',
      directory: '/home/yingjiting/652222053708',
      isGlobal: true,
    },
    {
      key: '2',
      username: 'ftp_user',
      serverIP: '172.41.90.93',
      port: 21,
      protocol: 'FTP',
      directory: '/home/ftp_user/datapush_test',
      isGlobal: false,
    },
    {
      key: '3',
      username: 'ftp_user',
      serverIP: '172.41.90.92',
      port: 21,
      protocol: 'FTP',
      directory: '/datapush_test',
      isGlobal: false,
    },
  ]);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ServerConfigItem | null>(null);
  const [form] = Form.useForm<ServerConfigItem>();

  const columns: ColumnsType<ServerConfigItem> = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    { title: '登录用户名', dataIndex: 'username', key: 'username', width: 140 },
    { title: '服务器IP', dataIndex: 'serverIP', key: 'serverIP', width: 150 },
    { title: '服务器端口号', dataIndex: 'port', key: 'port', width: 130 },
    { title: '协议', dataIndex: 'protocol', key: 'protocol', width: 100 },
    { title: '指定目录', dataIndex: 'directory', key: 'directory', width: 260 },
    {
      title: '全局',
      dataIndex: 'isGlobal',
      key: 'isGlobal',
      width: 90,
      align: 'center',
      render: (val: boolean) => (
        <Tag color={val ? 'green' : 'default'}>{val ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => onDelete(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  const onEdit = (record?: ServerConfigItem) => {
    const target = record ?? null;
    setEditing(target);
    setEditOpen(true);
    form.resetFields();
    if (target) form.setFieldsValue(target);
  };

  const onDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('已删除');
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      setData(prev => prev.map(it => (it.key === editing.key ? { ...editing, ...values } : it)));
      message.success('已更新配置');
    } else {
      setData(prev => [{ key: Date.now().toString(), ...values }, ...prev]);
      message.success('已新增配置');
    }
    setEditOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="page-title">数据上报 - 系统配置</div>
      <Card
        extra={
          <Button type="primary" onClick={() => onEdit()}>新增</Button>
        }
        className="custom-card"
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑配置' : '新增配置'}
        open={editOpen}
        onOk={handleOk}
        onCancel={() => { setEditOpen(false); setEditing(null); }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="登录用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="如：ftp_user" />
          </Form.Item>
          <Form.Item label="服务器IP" name="serverIP" rules={[{ required: true, message: '请输入服务器IP' }]}>
            <Input placeholder="如：172.41.90.16" />
          </Form.Item>
          <Form.Item label="端口" name="port" initialValue={21} rules={[{ required: true }]}>
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="协议" name="protocol" initialValue="FTP" rules={[{ required: true }]}>
            <Select>
              <Option value="FTP">FTP</Option>
              <Option value="SFTP">SFTP</Option>
              <Option value="HTTP">HTTP</Option>
            </Select>
          </Form.Item>
          <Form.Item label="指定目录" name="directory" rules={[{ required: true, message: '请输入目录' }]}>
            <Input placeholder="如：/home/ftp_user/datapush" />
          </Form.Item>
          <Form.Item label="是否全局" name="isGlobal" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UploadSystemConfig;
