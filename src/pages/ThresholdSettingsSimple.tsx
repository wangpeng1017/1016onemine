import React, { useMemo, useState } from 'react';
import { Card, Table, Button, Space, Input, InputNumber, Modal, Form, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, SaveOutlined, CloseOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';

interface ThresholdItem {
  id: string;
  name: string; // 测点名称
  type: string; // 告警值类型，如：Y方向小时位移量/压力值/裂缝宽度/水位深度/振动速度
  unit?: string; // 单位（可选）；页面会根据 type 自动计算，若提供则作为回退
  blue: number;   // 蓝色告警
  yellow: number; // 黄色告警
  orange: number; // 橙色告警
  red: number;    // 红色告警
}

const initialData: ThresholdItem[] = [
  { id: '1', name: 'GP-96', type: 'Y方向小时位移量', unit: 'mm', blue: 8, yellow: 10, orange: 12, red: 15 },
  { id: '2', name: 'GP-95', type: 'Y方向小时位移量', unit: 'mm', blue: 8, yellow: 10, orange: 12, red: 15 },
  { id: '3', name: 'GP-105', type: 'Y方向小时位移量', unit: 'mm', blue: 8, yellow: 10, orange: 12, red: 15 },
  { id: '8', name: 'GP-96', type: 'Z方向小时位移量', unit: 'mm', blue: 10, yellow: 12.5, orange: 15, red: 17.5 },
  { id: '9', name: 'GP-95', type: 'Z方向小时位移量', unit: 'mm', blue: 10, yellow: 12.5, orange: 15, red: 17.5 },
];

const typeUnitMap: Record<string, string> = {
  'Y方向小时位移量': 'mm',
  'Z方向小时位移量': 'mm',
  '位移速率': 'mm/h',
  '压力值': 'kPa',
  '裂缝宽度': 'mm',
  '水位深度': 'm',
  '振动速度': 'mm/s',
};

const getUnitByType = (type: string, fallback?: string) => typeUnitMap[type] || fallback || '';

const validateOrder = (v: { blue?: number; yellow?: number; orange?: number; red?: number }) => {
  const { blue, yellow, orange, red } = v;
  if ([blue, yellow, orange, red].some(x => x === undefined || x === null)) return '阈值不能为空';
  if (!(Number(blue) < Number(yellow) && Number(yellow) < Number(orange) && Number(orange) < Number(red))) {
    return '阈值需递增：蓝 < 黄 < 橙 < 红';
  }
  return '';
};

const ThresholdSettingsSimple: React.FC = () => {
  const [data, setData] = useState<ThresholdItem[]>(initialData);
  const [keyword, setKeyword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rowDraft, setRowDraft] = useState<Partial<ThresholdItem>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm] = Form.useForm();

  const filtered = useMemo(() => {
    if (!keyword) return data;
    return data.filter(d => d.name.toLowerCase().includes(keyword.toLowerCase()));
  }, [data, keyword]);

  const startEdit = (record: ThresholdItem) => {
    setEditingId(record.id);
    setRowDraft({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRowDraft({});
  };

  const saveRow = () => {
    if (!editingId) return;
    const err = validateOrder(rowDraft as any);
    if (err) {
      message.error(err);
      return;
    }
    setData(prev => prev.map(it => (it.id === editingId ? { ...(it as ThresholdItem), ...(rowDraft as ThresholdItem) } : it)));
    setEditingId(null);
    setRowDraft({});
    message.success('已保存');
  };

  const onAddSubmit = async () => {
    const values = await addForm.validateFields();
    const err = validateOrder(values);
    if (err) {
      message.error(err);
      return;
    }
    const nextId = (Math.max(0, ...data.map(d => Number(d.id))) + 1).toString();
    setData(prev => [...prev, { id: nextId, name: values.name, type: values.type, blue: values.blue, yellow: values.yellow, orange: values.orange, red: values.red }]);
    setAddOpen(false);
    message.success('已新增阈值规则');
    addForm.resetFields();
  };

  const columns: ColumnsType<ThresholdItem> = [
    { title: '序号', dataIndex: 'id', width: 70 },
    { title: '测点名称', dataIndex: 'name', width: 120 },
    { title: '告警值类型', dataIndex: 'type', width: 160 },
    {
      title: '蓝色告警', dataIndex: 'blue', width: 110,
      render: (_, r) => editingId === r.id ? (
        <InputNumber value={rowDraft.blue} onChange={v => setRowDraft(s => ({ ...s, blue: Number(v) }))} style={{ width: '100%' }} />
      ) : (<span>{r.blue}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '黄色告警', dataIndex: 'yellow', width: 110,
      render: (_, r) => editingId === r.id ? (
        <InputNumber value={rowDraft.yellow} onChange={v => setRowDraft(s => ({ ...s, yellow: Number(v) }))} style={{ width: '100%' }} />
      ) : (<span>{r.yellow}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '橙色告警', dataIndex: 'orange', width: 110,
      render: (_, r) => editingId === r.id ? (
        <InputNumber value={rowDraft.orange} onChange={v => setRowDraft(s => ({ ...s, orange: Number(v) }))} style={{ width: '100%' }} />
      ) : (<span>{r.orange}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '红色告警', dataIndex: 'red', width: 110,
      render: (_, r) => editingId === r.id ? (
        <InputNumber value={rowDraft.red} onChange={v => setRowDraft(s => ({ ...s, red: Number(v) }))} style={{ width: '100%' }} />
      ) : (<span>{r.red}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '操作', key: 'action', fixed: 'right', width: 160,
      render: (_, r) => (
        <Space size="small">
          {editingId === r.id ? (
            <>
              <Button type="primary" size="small" icon={<SaveOutlined />} onClick={saveRow}>保存</Button>
              <Button size="small" icon={<CloseOutlined />} onClick={cancelEdit}>取消</Button>
            </>
          ) : (
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => startEdit(r)}>编辑</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card className="custom-card" title={<span><SettingOutlined /> 阈值设置</span>}>
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="按测点名称搜索"
          allowClear
          onSearch={setKeyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { addForm.resetFields(); setAddOpen(true); }}>新增</Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        size="middle"
      />

      <Modal
        title="新增阈值"
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onOk={onAddSubmit}
        destroyOnClose
      >
        <Form layout="vertical" form={addForm}>
          <Form.Item name="name" label="测点名称" rules={[{ required: true, message: '请输入测点名称' }]}>
            <Input placeholder="例如：GP-001" />
          </Form.Item>
          <Form.Item name="type" label="告警值类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="请选择">
              {Object.keys(typeUnitMap).map(k => (
                <Select.Option key={k} value={k}>{k}（单位：{typeUnitMap[k]}）</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="blue" label="蓝色告警" rules={[{ required: true, message: '请输入' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="yellow" label="黄色告警" rules={[{ required: true, message: '请输入' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="orange" label="橙色告警" rules={[{ required: true, message: '请输入' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="red" label="红色告警" rules={[{ required: true, message: '请输入' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ color: '#999' }}>校验：蓝 &lt; 黄 &lt; 橙 &lt; 红</div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ThresholdSettingsSimple;