import React, { useMemo, useState } from 'react';
import { Card, Table, Button, Space, Input, InputNumber, Modal, Form, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, SaveOutlined, CloseOutlined, SettingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface ThresholdItem {
  id: string;
  name: string; // 测点名称
  type: string; // 告警值类型，如：Y方向小时位移量/压力值/裂缝宽度/水位深度/振动速度
  unit?: string; // 单位（可选）；页面会根据 type 自动计算，若提供则作为回退
  blueMin: number;  // 蓝色下限
  blueMax: number;  // 蓝色上限
  yellowMin: number;
  yellowMax: number;
  orangeMin: number;
  orangeMax: number;
  redMin: number;
  redMax: number;
}

const initialData: ThresholdItem[] = [
  { id: '1', name: 'GP-96', type: 'Y方向小时位移量', unit: 'mm', blueMin: 6, blueMax: 8, yellowMin: 8, yellowMax: 10, orangeMin: 10, orangeMax: 12, redMin: 12, redMax: 15 },
  { id: '2', name: 'GP-95', type: 'Y方向小时位移量', unit: 'mm', blueMin: 6, blueMax: 8, yellowMin: 8, yellowMax: 10, orangeMin: 10, orangeMax: 12, redMin: 12, redMax: 15 },
  { id: '3', name: 'GP-105', type: 'Y方向小时位移量', unit: 'mm', blueMin: 6, blueMax: 8, yellowMin: 8, yellowMax: 10, orangeMin: 10, orangeMax: 12, redMin: 12, redMax: 15 },
  { id: '4', name: '土压力计', type: '土压力', unit: 'kPa', blueMin: 80, blueMax: 100, yellowMin: 100, yellowMax: 120, orangeMin: 120, orangeMax: 140, redMin: 140, redMax: 160 },
  { id: '5', name: '土压力计2', type: '土压力', unit: 'kPa', blueMin: 85, blueMax: 105, yellowMin: 105, yellowMax: 125, orangeMin: 125, orangeMax: 145, redMin: 145, redMax: 165 },
  { id: '6', name: '裂缝计01', type: '裂缝值', unit: 'mm', blueMin: 10, blueMax: 12, yellowMin: 12, yellowMax: 15, orangeMin: 15, orangeMax: 18, redMin: 18, redMax: 20 },
  { id: '7', name: '裂缝计02', type: '裂缝值', unit: 'mm', blueMin: 10, blueMax: 12, yellowMin: 12, yellowMax: 15, orangeMin: 15, orangeMax: 18, redMin: 18, redMax: 20 },
  { id: '8', name: 'GP-96', type: 'Z方向小时位移量', unit: 'mm', blueMin: 9, blueMax: 10, yellowMin: 10, yellowMax: 12.5, orangeMin: 12.5, orangeMax: 15, redMin: 15, redMax: 17.5 },
  { id: '9', name: 'GP-95', type: 'Z方向小时位移量', unit: 'mm', blueMin: 9, blueMax: 10, yellowMin: 10, yellowMax: 12.5, orangeMin: 12.5, orangeMax: 15, redMin: 15, redMax: 17.5 },
  { id: '10', name: 'A1', type: '水面高程', unit: 'm', blueMin: 10, blueMax: 11, yellowMin: 11, yellowMax: 12, orangeMin: 12, orangeMax: 13, redMin: 13, redMax: 14 },
];

const typeUnitMap: Record<string, string> = {
  'Y方向小时位移量': 'mm',
  'Z方向小时位移量': 'mm',
  '位移速率': 'mm/h',
  '压力值': 'kPa',
  '土压力': 'kPa',
  '裂缝宽度': 'mm',
  '裂缝值': 'mm',
  '水位深度': 'm',
  '水面高程': 'm',
  '振动速度': 'mm/s',
  'X方向峰值振动速度': 'mm/s',
  'Y方向峰值振动速度': 'mm/s',
  'Z方向峰值振动速度': 'mm/s',
};

const getUnitByType = (type: string, fallback?: string) => typeUnitMap[type] || fallback || '';

// 从“监测数据”页面的样例数据汇总得到的测点->默认告警值类型映射
const measurementCatalog: { name: string; type: string; group: string }[] = [
  // 表面位移（默认：Y方向小时位移量）
  ...['GP-29','GP-28','GP-27','GP-26','GP-25','GP-24','GP-22','GP-21','GP-17','GP-40'].map(n => ({ name: n, type: 'Y方向小时位移量', group: '表面位移' })),
  // 裂缝计
  ...['裂缝计01','裂缝计02','裂缝计03','裂缝计04'].map(n => ({ name: n, type: '裂缝值', group: '裂缝计' })),
  // 土压力
  ...['土压力计','土压力计2'].map(n => ({ name: n, type: '土压力', group: '土压力' })),
  // 地下水
  ...['A1','A2','A4','SK001'].map(n => ({ name: n, type: '水面高程', group: '地下水' })),
  // 爆破振动
  ...['爆破振动','爆破振动1','爆破振动2'].map(n => ({ name: n, type: '振动速度', group: '爆破振动' })),
];

const validateOrder = (v: Partial<ThresholdItem>) => {
  const required = ['blueMin','blueMax','yellowMin','yellowMax','orangeMin','orangeMax','redMin','redMax'] as const;
  if (required.some(k => (v as any)[k] === undefined || (v as any)[k] === null)) return '阈值范围不能为空';
  const {
    blueMin, blueMax, yellowMin, yellowMax, orangeMin, orangeMax, redMin, redMax
  } = v as ThresholdItem;
  if (!(blueMin < blueMax && yellowMin < yellowMax && orangeMin < orangeMax && redMin < redMax)) {
    return '每个颜色的下限需小于上限';
  }
  if (!(blueMax <= yellowMin && yellowMax <= orangeMin && orangeMax <= redMin)) {
    return '范围需有序且不重叠：蓝≤黄≤橙≤红（相邻可接壤）';
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
    setData(prev => [...prev, { id: nextId, name: values.name, type: values.type, blueMin: values.blueMin, blueMax: values.blueMax, yellowMin: values.yellowMin, yellowMax: values.yellowMax, orangeMin: values.orangeMin, orangeMax: values.orangeMax, redMin: values.redMin, redMax: values.redMax }]);
    setAddOpen(false);
    message.success('已新增阈值规则');
    addForm.resetFields();
  };

  const handleDelete = (record: ThresholdItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除测点 ${record.name} 的阈值规则吗？`,
      onOk() {
        setData(prev => prev.filter(item => item.id !== record.id));
        message.success('已删除阈值规则');
      },
    });
  };

  const columns: ColumnsType<ThresholdItem> = [
    { title: '序号', dataIndex: 'id', width: 70 },
    { title: '测点名称', dataIndex: 'name', width: 120 },
    { title: '告警值类型', dataIndex: 'type', width: 160 },
    {
      title: '蓝色告警', key: 'blue', width: 150,
      render: (_, r) => editingId === r.id ? (
        <Space size={4}>
          <InputNumber value={rowDraft.blueMin} onChange={v => setRowDraft(s => ({ ...s, blueMin: Number(v) }))} style={{ width: 60 }} />
          <span>-</span>
          <InputNumber value={rowDraft.blueMax} onChange={v => setRowDraft(s => ({ ...s, blueMax: Number(v) }))} style={{ width: 60 }} />
        </Space>
      ) : (<span>{r.blueMin}-{r.blueMax}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '黄色告警', key: 'yellow', width: 150,
      render: (_, r) => editingId === r.id ? (
        <Space size={4}>
          <InputNumber value={rowDraft.yellowMin} onChange={v => setRowDraft(s => ({ ...s, yellowMin: Number(v) }))} style={{ width: 60 }} />
          <span>-</span>
          <InputNumber value={rowDraft.yellowMax} onChange={v => setRowDraft(s => ({ ...s, yellowMax: Number(v) }))} style={{ width: 60 }} />
        </Space>
      ) : (<span>{r.yellowMin}-{r.yellowMax}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '橙色告警', key: 'orange', width: 150,
      render: (_, r) => editingId === r.id ? (
        <Space size={4}>
          <InputNumber value={rowDraft.orangeMin} onChange={v => setRowDraft(s => ({ ...s, orangeMin: Number(v) }))} style={{ width: 60 }} />
          <span>-</span>
          <InputNumber value={rowDraft.orangeMax} onChange={v => setRowDraft(s => ({ ...s, orangeMax: Number(v) }))} style={{ width: 60 }} />
        </Space>
      ) : (<span>{r.orangeMin}-{r.orangeMax}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '红色告警', key: 'red', width: 150,
      render: (_, r) => editingId === r.id ? (
        <Space size={4}>
          <InputNumber value={rowDraft.redMin} onChange={v => setRowDraft(s => ({ ...s, redMin: Number(v) }))} style={{ width: 60 }} />
          <span>-</span>
          <InputNumber value={rowDraft.redMax} onChange={v => setRowDraft(s => ({ ...s, redMax: Number(v) }))} style={{ width: 60 }} />
        </Space>
      ) : (<span>{r.redMin}-{r.redMax}{getUnitByType(r.type, r.unit)}</span>)
    },
    {
      title: '操作', key: 'action', fixed: 'right', width: 200,
      render: (_, r) => (
        <Space size="small">
          {editingId === r.id ? (
            <>
              <Button type="primary" size="small" icon={<SaveOutlined />} onClick={saveRow}>保存</Button>
              <Button size="small" icon={<CloseOutlined />} onClick={cancelEdit}>取消</Button>
            </>
          ) : (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => startEdit(r)}>编辑</Button>
              <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r)}>删除</Button>
            </>
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
          <Form.Item name="name" label="测点名称" rules={[{ required: true, message: '请选择测点名称' }]}>
            <Select
              placeholder="请选择监测数据中的测点"
              showSearch
              optionFilterProp="label"
              onChange={(val: string) => {
                const hit = measurementCatalog.find(m => m.name === val);
                if (hit) {
                  addForm.setFieldsValue({ type: hit.type });
                }
              }}
            >
              {Array.from(new Map(measurementCatalog.map(m => [m.group, m.group])).keys()).map(group => (
                <Select.OptGroup key={group} label={group}>
                  {measurementCatalog.filter(m => m.group === group).map(m => (
                    <Select.Option key={m.name} value={m.name} label={`${group}-${m.name}`}>{m.name}</Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="告警值类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="自动根据测点带出，可手动调整">
              {Object.keys(typeUnitMap).map(k => (
                <Select.Option key={k} value={k}>{k}（单位：{typeUnitMap[k]}）</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="蓝色告警（范围）" required>
            <Space>
              <Form.Item name="blueMin" noStyle rules={[{ required: true, message: '请输入下限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="下限" />
              </Form.Item>
              <span>-</span>
              <Form.Item name="blueMax" noStyle rules={[{ required: true, message: '请输入上限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="上限" />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="黄色告警（范围）" required>
            <Space>
              <Form.Item name="yellowMin" noStyle rules={[{ required: true, message: '请输入下限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="下限" />
              </Form.Item>
              <span>-</span>
              <Form.Item name="yellowMax" noStyle rules={[{ required: true, message: '请输入上限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="上限" />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="橙色告警（范围）" required>
            <Space>
              <Form.Item name="orangeMin" noStyle rules={[{ required: true, message: '请输入下限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="下限" />
              </Form.Item>
              <span>-</span>
              <Form.Item name="orangeMax" noStyle rules={[{ required: true, message: '请输入上限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="上限" />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="红色告警（范围）" required>
            <Space>
              <Form.Item name="redMin" noStyle rules={[{ required: true, message: '请输入下限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="下限" />
              </Form.Item>
              <span>-</span>
              <Form.Item name="redMax" noStyle rules={[{ required: true, message: '请输入上限' }]}>
                <InputNumber style={{ width: 120 }} placeholder="上限" />
              </Form.Item>
            </Space>
          </Form.Item>
          <div style={{ color: '#999' }}>校验：每个颜色为范围且有序：蓝Max ≤ 黄Min ≤ 橙Min ≤ 红Min</div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ThresholdSettingsSimple;