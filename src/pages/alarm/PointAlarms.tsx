import React, { useMemo, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, DatePicker, Modal, Radio, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
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

const mockData: PointAlarmItem[] = [
  { id: 1, 点名: 'GP-137', 监测类型: '表面位移监测', 告警时间: '2025-08-20 16:00:00', 告警等级: '红色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移Y达到阈值，判断虚警', 经度: '92.9596', 纬度: '44.48099', 高程: '-' },
  { id: 2, 点名: 'GP-131', 监测类型: '表面位移监测', 告警时间: '2025-08-18 19:00:00', 告警等级: '橙色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移Y接近阈值，观察', 经度: '92.94644', 纬度: '44.48731', 高程: '-' },
  { id: 3, 点名: 'GP-131', 监测类型: '表面位移监测', 告警时间: '2025-08-18 18:00:00', 告警等级: '黄色告警', 告警状态: '已处置（虚报）', 告警描述: '小时位移X波动', 经度: '92.94644', 纬度: '44.48731', 高程: '-' },
];

const levelColor: Record<PointAlarmItem['告警等级'], string> = {
  '蓝色告警': 'blue',
  '黄色告警': 'gold',
  '橙色告警': 'orange',
  '红色告警': 'red',
};

const PointAlarms: React.FC = () => {
  const [level, setLevel] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [range, setRange] = useState<any>();
  const [processing, setProcessing] = useState<PointAlarmItem | null>(null);
  const [processState, setProcessState] = useState<PointAlarmItem['告警状态']>('待处置');
  const [processNote, setProcessNote] = useState('');

  const filtered = useMemo(() => {
    return mockData.filter(r => (!level || r.告警等级 === level) && (!status || r.告警状态 === status) && (!range || (dayjs(r.告警时间).isAfter(range[0]) && dayjs(r.告警时间).isBefore(range[1]))));
  }, [level, status, range]);

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
    { title: '操作', key: 'action', fixed: 'right', width: 100, render: (_, r) => (<Button type="link" onClick={() => { setProcessing(r); setProcessState(r.告警状态); setProcessNote(''); }}>处置</Button>) },
  ];

  const onConfirm = () => {
    if (!processing) return;
    message.success('已保存处置结果');
    setProcessing(null);
  };

  return (
    <div>
      <div className="page-title">测点告警</div>
      <Card className="custom-card">
        <Space style={{ marginBottom: 12 }} wrap>
          <Select placeholder="告警等级" allowClear style={{ width: 140 }} value={level} onChange={setLevel}
            options={[{ value: '蓝色告警' }, { value: '黄色告警' }, { value: '橙色告警' }, { value: '红色告警' }]} />
          <Select placeholder="告警状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
            options={[{ value: '已处置（虚报）' }, { value: '已处置（真实告警）' }, { value: '待处置' }, { value: '处置中' }]} />
          <RangePicker value={range} onChange={setRange} />
          <Button icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ReloadOutlined />}>重置</Button>
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