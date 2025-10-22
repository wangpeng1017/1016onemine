import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Badge } from 'antd';
import { SolutionOutlined, TeamOutlined, SafetyCertificateOutlined, BarChartOutlined } from '@ant-design/icons';

const ContractorManagement: React.FC = () => {
  const contractors = [
    { id: '1', name: '建设公司A', personnel: 25, projects: 3, score: 95, status: 'active' },
    { id: '2', name: '维修公司B', personnel: 18, projects: 2, score: 88, status: 'active' }
  ];

  const columns = [
    { title: '承包商名称', dataIndex: 'name', key: 'name' },
    { title: '人员数量', dataIndex: 'personnel', key: 'personnel' },
    { title: '在场项目', dataIndex: 'projects', key: 'projects' },
    { title: '安全绩效', dataIndex: 'score', key: 'score', render: (s: number) => <Tag color={s >= 90 ? 'success' : 'warning'}>{s}分</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'active' ? 'success' : 'default'} text={s === 'active' ? '在场' : '离场'} /> },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">管理</Button></Space> }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { key: '1', label: <span><SolutionOutlined /> 承包商信息库</span>, children: <Card title="承包商列表"><Table columns={columns} dataSource={contractors} rowKey="id" /></Card> },
        { key: '2', label: <span><TeamOutlined /> 人员管理</span>, children: <Card title="承包商人员"><div style={{ padding: 20, textAlign: 'center' }}>人员管理功能</div></Card> },
        { key: '3', label: <span><SafetyCertificateOutlined /> 资质管理</span>, children: <Card title="资质档案"><div style={{ padding: 20, textAlign: 'center' }}>资质管理功能</div></Card> },
        { key: '4', label: <span><BarChartOutlined /> 绩效评估</span>, children: <Card title="安全绩效"><div style={{ padding: 20, textAlign: 'center' }}>绩效评估功能</div></Card> }
      ]} />
    </div>
  );
};

export default ContractorManagement;
