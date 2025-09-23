import React, { useMemo, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, DatePicker, Modal, Radio, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface RadarAlarmItem {
  id: number;
  点名: string;
  监测类型: string; // 雷达/IDS/等
  告警时间: string;
  告警等级: '蓝色告警' | '黄色告警' | '橙色告警' | '红色告警';
  告警状态: '已处置（虚报）' | '已处置（真实告警）' | '待处置' | '处置中';
  告警描述: string;
  经度?: string;
  纬度?: string;
  高程?: string;
}

const mockData: RadarAlarmItem[] = [
  { id: 1, 点名: 'IDS_PIER', 监测类型: '雷达', 告警时间: '2025-07-11 01:12:22', 告警等级: '蓝色告警', 告警状态: '已处置（虚报）', 告警描述: '高达警戒面积475.0㎡，离自由形变>150m', 经度: '92.93916', 纬度: '44.51243', 高程: '793.00' },
  { id: 2, 点名: 'IDS_PIER', 监测类型: '雷达', 告警时间: '2025-07-07 13:58:58', 告警等级: '蓝色告警', 告警状态: '已处置（虚报）', 告警描述: '高达警戒面积200㎡', 经度: '92.93916', 纬度: '44.51243', 高程: '793.00' },
  { id: 3, 点名: 'IDS_PIER', 监测类型: '雷达', 告警时间: '2025-06-23 02:39:07', 告警等级: '蓝色告警', 告警状态: '已处置（虚报）', 告警描述: '高达警戒面积300㎡', 经度: '92.93916', 纬度: '44.51243', 高程: '793.00' },
];

const levelColor: Record<RadarAlarmItem['告警等级'], string> = {
  '蓝色告警': 'blue',
  '黄色告警': 'gold',
  '橙色告警': 'orange',
  '红色告警': 'red',
};

const RadarAlarms: React.FC = () => {
  const [level, setLevel] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [range, setRange] = useState<any>();
  const [processing, setProcessing] = useState<RadarAlarmItem | null>(null);
  const [processState, setProcessState] = useState<RadarAlarmItem['告警状态']>('待处置');
  const [processNote, setProcessNote] = useState('');

  const filtered = useMemo(() => {
    return mockData.filter(r => (!level || r.告警等级 === level) && (!status || r.告警状态 === status) && (!range || (dayjs(r.告警时间).isAfter(range[0]) && dayjs(r.告警时间).isBefore(range[1]))));
  }, [level, status, range]);

  const columns: ColumnsType<RadarAlarmItem> = [
    { title: '序号', dataIndex: 'id', width: 70 },
    { title: '点名', dataIndex: '点名', width: 140 },
    { title: '监测类型', dataIndex: '监测类型', width: 120 },
    { title: '告警时间', dataIndex: '告警时间', width: 160 },
    { title: '告警等级', dataIndex: '告警等级', width: 110, render: (v: RadarAlarmItem['告警等级']) => <Tag color={levelColor[v]}>{v}</Tag> },
    { title: '告警状态', dataIndex: '告警状态', width: 140 },
    { title: '告警描述', dataIndex: '告警描述', width: 420 },
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
      <div className="page-title">雷达告警</div>
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

export default RadarAlarms;