import React, { useMemo, useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface DeviceTypeRow {
  key: string;
  name: string;        // 设备类型名称
  code: string;        // 类型编码
  enabled: boolean;    // 是否启用
  remark?: string;     // 备注
}

// 表单使用的类型，不包含 key，避免与新增时的 key 冲突
type DeviceTypeForm = Omit<DeviceTypeRow, 'key'>;

const initialRows: DeviceTypeRow[] = [
  { key: '1', name: '雷达传感器', code: 'RADAR', enabled: true },
  { key: '2', name: '压力传感器', code: 'PRESSURE', enabled: true },
  { key: '3', name: '裂缝监测仪', code: 'CRACK', enabled: true },
  { key: '4', name: '气象传感器', code: 'WEATHER', enabled: true },
  { key: '5', name: '水位传感器', code: 'WATER', enabled: true },
  { key: '6', name: '监控设备', code: 'CAMERA', enabled: true },
];

const DeviceTypes: React.FC = () => {
  const [rows, setRows] = useState<DeviceTypeRow[]>(initialRows);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<DeviceTypeRow | null>(null);
  const [form] = Form.useForm<DeviceTypeForm>();

  const columns: ColumnsType<DeviceTypeRow> = useMemo(() => [
    { title: '序号', dataIndex: 'index', key: 'index', width: 80, render: (_: any, __: DeviceTypeRow, idx: number) => idx + 1 },
    { title: '设备类型', dataIndex: 'name', key: 'name' },
    { title: '编码', dataIndex: 'code', key: 'code', width: 140, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '是否启用', dataIndex: 'enabled', key: 'enabled', width: 140, render: (v: boolean, r) => (
        <Switch checked={v} onChange={(checked) => setRows(prev => prev.map(i => i.key === r.key ? { ...i, enabled: checked } : i))} />
      )
    },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { title: '操作', key: 'action', width: 180, render: (_: any, record) => (
      <Space size="small">
        <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>编辑</Button>
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>删除</Button>
      </Space>
    ) },
  ], [rows]);

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

const onEdit = (row: DeviceTypeRow) => {
    setEditing(row);
    const { key, ...payload } = row;
    form.setFieldsValue(payload);
    setVisible(true);
  };

  const onDelete = (row: DeviceTypeRow) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定删除设备类型“${row.name}”吗？`,
      onOk: () => setRows(prev => prev.filter(i => i.key !== row.key)),
    });
  };

const onSave = async () => {
    const values = (await form.validateFields()) as DeviceTypeForm;
    if (editing) {
      setRows(prev => prev.map(i => i.key === editing.key ? { ...editing, ...values } : i));
    } else {
      const newKey = String(Date.now());
      setRows(prev => [{ key: newKey, ...values }, ...prev]);
    }
    setVisible(false);
  };

  return (
    <div>
      <div className="page-title">数据字典 - 设备类型</div>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增类型</Button>
        </Space>
      </Card>

      <Card>
        <Table rowKey="key" columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editing ? '编辑设备类型' : '新增设备类型'}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={onSave}
        width={520}
      >
        <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
          <Form.Item name="name" label="设备类型" rules={[{ required: true, message: '请输入设备类型名称' }]}>
            <Input placeholder="例如：雷达传感器" />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true, message: '请输入编码' }]}>
            <Input placeholder="例如：RADAR" />
          </Form.Item>
          <Form.Item name="enabled" label="是否启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceTypes;

