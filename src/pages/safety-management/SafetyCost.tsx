import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Progress, Row, Col, Statistic } from 'antd';
import { DollarOutlined, FileTextOutlined, BarChartOutlined, AuditOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

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
        { key: '2', label: <span><FileTextOutlined /> 费用申请</span>, children: <Card title="费用申请记录"><Table columns={columns} dataSource={expenses} rowKey="id" /></Card> },
        { key: '3', label: <span><AuditOutlined /> 审批管理</span>, children: <Card title="待审批项目"><div style={{ padding: 20, textAlign: 'center' }}>审批管理功能</div></Card> },
        { key: '4', label: <span><BarChartOutlined /> 统计分析</span>, children: <Card title="费用分析"><div style={{ padding: 20, textAlign: 'center' }}>统计分析功能</div></Card> }
      ]} />
    </div>
  );
};

export default SafetyCost;
