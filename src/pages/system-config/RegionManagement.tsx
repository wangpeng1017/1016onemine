import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Space, Modal, Form, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Region {
  key: string;
  projectName: string;
  regionName: string;
}

const RegionManagement: React.FC = () => {
  const [data, setData] = useState<Region[]>([
    { key: '1', projectName: '石头梅—号露天煤矿', regionName: '西排土场' },
    { key: '2', projectName: '石头梅—号露天煤矿', regionName: '南排土场' },
    { key: '3', projectName: '石头梅—号露天煤矿', regionName: '采场' },
    { key: '4', projectName: '石头梅—号露天煤矿', regionName: '地面生产区' },
    { key: '5', projectName: '石头梅—号露天煤矿', regionName: '办公区' },
    { key: '6', projectName: '石头梅—号露天煤矿', regionName: '生活区' },
    { key: '7', projectName: '石头梅—号露天煤矿', regionName: '其它' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Region | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Region> = useMemo(() => [
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    { title: '区域名称', dataIndex: 'regionName', key: 'regionName' },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>删除</Button>
        </Space>
      )
    },
  ], []);

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const onEdit = (record: Region) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const onDelete = (record: Region) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除区域 “${record.regionName}” 吗？`,
      onOk: () => {
        setData(prev => prev.filter(r => r.key !== record.key));
        message.success('已删除');
      }
    });
  };

  const onSave = async () => {
    const values = await form.validateFields();
    if (editing) {
      setData(prev => prev.map(r => r.key === editing.key ? { ...editing, ...values } : r));
      message.success('已更新');
    } else {
      setData(prev => [...prev, { key: String(Date.now()), ...values }]);
      message.success('已添加');
    }
    setModalOpen(false);
  };

  return (
    <Card className="custom-card" title="区域管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</Button>}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />

      <Modal title={editing ? '编辑区域' : '新增区域'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={onSave}>
        <Form form={form} layout="vertical">
          <Form.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="regionName" label="区域名称" rules={[{ required: true, message: '请输入区域名称' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RegionManagement;
