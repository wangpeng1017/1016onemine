import React, { useMemo, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, DatePicker, Modal, Radio, Input, message, Form, InputNumber, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface PointAlarmItem {
  id: number;
  点名: string;
  监测类型: string;
  告警时间: string;
  告警等级: '蓝色告警' | '黄色告警' | '橙色告警' | '红色告警';
  告警状态: '已处置（虚报）' | '已处置（真实告警）' | '待处置' | '处置中';
  告警描述: string;
  经度?: string;
  纬度?: string;
  高程?: string;
}

const initialData: PointAlarmItem[] = [
  { id: 1, 点名: 'GP-137', 监测类型: '表面位移监测', 告警时间: '2025-08-20 16:00:00', 告警等级: '红色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移Y达到阈值，判断虚警', 经度: '92.9596', 纬度: '44.48099', 高程: '-' },
  { id: 2, 点名: 'GP-131', 监测类型: '表面位移监测', 告警时间: '2025-08-18 19:00:00', 告警等级: '橙色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移Y接近阈值，观察', 经度: '92.94644', 纬度: '44.48731', 高程: '-' },
  { id: 3, 点名: 'GP-131', 监测类型: '表面位移监测', 告警时间: '2025-08-18 18:00:00', 告警等级: '黄色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移X波动', 经度: '92.94644', 纬度: '44.48731', 高程: '-' },
  { id: 4, 点名: 'GP-105', 监测类型: '表面位移监测', 告警时间: '2025-08-17 14:30:00', 告警等级: '黄色告警', 告警状态: '待处置', 告警描述: '累计位移量增大', 经度: '92.95123', 纬度: '44.49012', 高程: '825' },
  { id: 5, 点名: 'GP-96', 监测类型: '裂缝监测', 告警时间: '2025-08-16 10:15:00', 告警等级: '蓝色告警', 告警状态: '已处置（虚报）', 告警描述: '裂缝容变轻微增加', 经度: '92.94608', 纬度: '44.49493', 高程: '825' },
  { id: 6, 点名: 'GP-29', 监测类型: '土压力监测', 告警时间: '2025-08-15 08:20:00', 告警等级: '橙色告警', 告警状态: '处置中', 告警描述: '土压力值异常', 经度: '92.94802', 纬度: '44.48920', 高程: '-' },
  { id: 7, 点名: 'GP-28', 监测类型: '表面位移监测', 告警时间: '2025-08-14 16:45:00', 告警等级: '红色告警', 告警状态: '已处置（真实告警）', 告警描述: 'Z向位移量超限，需重点监控', 经度: '92.94701', 纬度: '44.48856', 高程: '830' },
  { id: 8, 点名: 'GP-40', 监测类型: '地下水位监测', 告警时间: '2025-08-13 11:30:00', 告警等级: '黄色告警', 告警状态: '待处置', 告警描述: '水位上升快速', 经度: '92.95234', 纬度: '44.49123', 高程: '-' },
  { id: 9, 点名: 'GP-21', 监测类型: '表面位移监测', 告警时间: '2025-08-12 13:10:00', 告警等级: '橙色告警', 告警状态: '处置中', 告警描述: '位移速率加快', 经度: '92.94890', 纬度: '44.49001', 高程: '828' },
  { id: 10, 点名: 'GP-17', 监测类型: '表面位移监测', 告警时间: '2025-08-11 09:25:00', 告警等级: '红色告警', 告警状态: '已处置（真实告警）', 告警描述: '累计位移量严重超限', 经度: '92.94567', 纬度: '44.48765', 高程: '832' },
];

const levelColor: Record<PointAlarmItem['告警等级'], string> = {
  '蓝色告警': 'blue',
  '黄色告警': 'gold',
  '橙色告警': 'orange',
  '红色告警': 'red',
};

const PointAlarms: React.FC = () => {
  const [data, setData] = useState<PointAlarmItem[]>(initialData);
  const [level, setLevel] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [range, setRange] = useState<any>();
  const [processing, setProcessing] = useState<PointAlarmItem | null>(null);
  const [processState, setProcessState] = useState<PointAlarmItem['告警状态']>('待处置');
  const [processNote, setProcessNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PointAlarmItem | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    let result = data;
    if (searchText) {
      result = result.filter(r => r.点名.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (level) {
      result = result.filter(r => r.告警等级 === level);
    }
    if (status) {
      result = result.filter(r => r.告警状态 === status);
    }
    if (range && range[0] && range[1]) {
      result = result.filter(r => dayjs(r.告警时间).isAfter(range[0]) && dayjs(r.告警时间).isBefore(range[1]));
    }
    return result;
  }, [data, searchText, level, status, range]);

  const columns: ColumnsType<PointAlarmItem> = [
    { title: '序号', dataIndex: 'id', width: 70 },
    { title: '点名', dataIndex: '点名', width: 120 },
    { title: '监测类型', dataIndex: '监测类型', width: 140 },
    { title: '告警时间', dataIndex: '告警时间', width: 160 },
    { title: '告警等级', dataIndex: '告警等级', width: 110, render: (v: PointAlarmItem['告警等级']) => <Tag color={levelColor[v]}>{v}</Tag> },
    { title: '告警状态', dataIndex: '告警状态', width: 140 },
    { title: '告警描述', dataIndex: '告警描述', width: 400 },
    { title: '经度(°)', dataIndex: '经度', width: 120 },
    { title: '纬度(°)', dataIndex: '纬度', width: 120 },
    { title: '高程', dataIndex: '高程', width: 100 },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right', 
      width: 200, 
      render: (_, r) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => { setProcessing(r); setProcessState(r.告警状态); setProcessNote(''); }}>处置</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(r)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const onConfirm = () => {
    if (!processing) return;
    setData(prev => prev.map(item => 
      item.id === processing.id ? { ...item, 告警状态: processState } : item
    ));
    message.success('已保存处置结果');
    setProcessing(null);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: PointAlarmItem) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: PointAlarmItem) => {
    setData(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setData(prev => prev.map(item =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        const newRecord: PointAlarmItem = {
          id: data.length + 1,
          ...values,
          告警时间: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        setData(prev => [...prev, newRecord]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const handleResetFilter = () => {
    setSearchText('');
    setLevel(undefined);
    setStatus(undefined);
    setRange(undefined);
  };

  return (
    <div>
      <div className="page-title">测点告警</div>
      <Card className="custom-card">
        <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }} wrap>
          <Space wrap>
            <Input placeholder="搜索测点" allowClear style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Select placeholder="告警等级" allowClear style={{ width: 140 }} value={level} onChange={setLevel}
              options={[{ value: '蓝色告警' }, { value: '黄色告警' }, { value: '橙色告警' }, { value: '红色告警' }]} />
            <Select placeholder="告警状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
              options={[{ value: '已处置（虚报）' }, { value: '已处置（真实告警）' }, { value: '待处置' }, { value: '处置中' }]} />
            <RangePicker value={range} onChange={setRange} />
            <Button onClick={handleResetFilter}>重置</Button>
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增告警</Button>
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal title="告警信息处置" open={!!processing} onCancel={() => setProcessing(null)} onOk={onConfirm} okText="确定">
        {processing && (
          <div>
            <div style={{ marginBottom: 8 }}>
              监测类型：{processing.监测类型}
            </div>
            <div style={{ marginBottom: 8 }}>
              告警等级：<Tag color={levelColor[processing.告警等级]}>{processing.告警等级}</Tag>
            </div>
            <div style={{ marginBottom: 12, color: '#666' }}>内容：{processing.告警描述}</div>
            <div style={{ marginBottom: 12 }}>
              告警状态：
              <Radio.Group value={processState} onChange={e => setProcessState(e.target.value)}>
                <Radio value={'已处置（虚报）'}>已处置（虚报）</Radio>
                <Radio value={'已处置（真实告警）'}>已处置（真实告警）</Radio>
                <Radio value={'待处置'}>待处置</Radio>
                <Radio value={'处置中'}>处置中</Radio>
              </Radio.Group>
            </div>
            <Input.TextArea rows={3} placeholder="请输入处置结果" value={processNote} onChange={e => setProcessNote(e.target.value)} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PointAlarms;