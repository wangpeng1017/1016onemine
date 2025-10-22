import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Progress, Row, Col, Statistic, Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { DollarOutlined, FileTextOutlined, BarChartOutlined, AuditOutlined, PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { TextArea } = Input;
const { Option } = Select;

const SafetyCost: React.FC = () => {
  const expenses = [
    { id: '1', category: '安全设备购置', amount: 50000, budget: 60000, status: 'approved', date: '2024-01-15' },
    { id: '2', category: '安全培训', amount: 15000, budget: 20000, status: 'pending', date: '2024-01-20' }
  ];

  const columns = [
    { title: '费用类别', dataIndex: 'category', key: 'category' },
    { title: '申请金额', dataIndex: 'amount', key: 'amount', render: (a: number) => `￥${a.toLocaleString()}` },
    { title: '预算额度', dataIndex: 'budget', key: 'budget', render: (b: number) => `￥${b.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'approved' ? 'success' : 'processing'}>{s === 'approved' ? '已批准' : '待审批'}</Tag> },
    { title: '申请日期', dataIndex: 'date', key: 'date' },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
  ];

  const chartOption = { title: { text: '费用使用结构', left: 'center' }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: '50%', data: [{ value: 50000, name: '安全设备' }, { value: 15000, name: '安全培训' }, { value: 20000, name: '应急物资' }] }] };

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { key: '1', label: <span><DollarOutlined /> 费用总览</span>, children: (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="年度预算" value={1000000} prefix="￥" /></Card></Col>
              <Col span={6}><Card><Statistic title="已使用" value={650000} prefix="￥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="剩余额度" value={350000} prefix="￥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
              <Col span={6}><Card><Progress type="circle" percent={65} /></Card></Col>
            </Row>
            <Card><ReactECharts option={chartOption} style={{ height: 300 }} /></Card>
          </div>
        )},
        { key: '2', label: <span><FileTextOutlined /> 费用申请</span>, children: (
          <Card title="费用申请记录" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('新增申请')}>新增申请</Button>}>
            <Table columns={columns} dataSource={expenses} rowKey="id" />
          </Card>
        )},
        { key: '3', label: <span><AuditOutlined /> 审批管理</span>, children: (
          <Card title="待审批项目">
            <Table 
              size="small"
              columns={[
                { title: '申请编号', dataIndex: 'id', key: 'id' },
                { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
                { title: '费用类别', dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
                { title: '申请金额', dataIndex: 'amount', key: 'amount', render: (a: number) => `￥${a.toLocaleString()}` },
                { title: '申请日期', dataIndex: 'date', key: 'date' },
                { title: '审批状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="processing">{s}</Tag> },
                { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">审批</Button><Button type="link" size="small">查看</Button></Space> }
              ]}
              dataSource={[
                { key: '1', id: 'SC202401001', applicant: '张三', category: '安全设备购置', amount: 50000, date: '2024-01-15', status: '一级审批中' },
                { key: '2', id: 'SC202401002', applicant: '李四', category: '安全培训', amount: 15000, date: '2024-01-20', status: '待审批' }
              ]}
            />
          </Card>
        )},
        { key: '4', label: <span><BarChartOutlined /> 统计分析</span>, children: (
          <div>
            <Card title="费用使用趋势" style={{ marginBottom: 16 }}>
              <ReactECharts 
                option={{
                  title: { text: '月度费用使用情况', left: 'center' },
                  tooltip: { trigger: 'axis' },
                  legend: { bottom: 0 },
                  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
                  yAxis: { type: 'value' },
                  series: [
                    { name: '计划预算', type: 'line', data: [150000, 150000, 150000, 150000, 150000, 150000], itemStyle: { color: '#1890ff' } },
                    { name: '实际使用', type: 'line', data: [120000, 135000, 128000, 142000, 125000, 0], itemStyle: { color: '#52c41a' } }
                  ]
                }}
                style={{ height: 300 }}
              />
            </Card>
            <Card title="费用分类统计">
              <Table 
                size="small"
                columns={[
                  { title: '费用类别', dataIndex: 'category', key: 'category' },
                  { title: '年度预算', dataIndex: 'budget', key: 'budget', render: (b: number) => `￥${b.toLocaleString()}` },
                  { title: '已使用', dataIndex: 'used', key: 'used', render: (u: number) => `￥${u.toLocaleString()}` },
                  { title: '剩余', dataIndex: 'remaining', key: 'remaining', render: (r: number) => `￥${r.toLocaleString()}` },
                  { title: '使用率', dataIndex: 'rate', key: 'rate', render: (r: number) => <Progress percent={r} size="small" /> }
                ]}
                dataSource={[
                  { key: '1', category: '安全设备购置', budget: 300000, used: 180000, remaining: 120000, rate: 60 },
                  { key: '2', category: '安全培训', budget: 150000, used: 95000, remaining: 55000, rate: 63 },
                  { key: '3', category: '应急物资', budget: 200000, used: 125000, remaining: 75000, rate: 63 },
                  { key: '4', category: '劳保用品', budget: 180000, used: 120000, remaining: 60000, rate: 67 },
                  { key: '5', category: '其他', budget: 170000, used: 130000, remaining: 40000, rate: 76 }
                ]}
                pagination={false}
              />
            </Card>
          </div>
        )}
      ]} />
    </div>
  );
};

export default SafetyCost;
