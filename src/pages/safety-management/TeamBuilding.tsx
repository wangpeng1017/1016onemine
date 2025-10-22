import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Tree } from 'antd';
import { TeamOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

const TeamBuilding: React.FC = () => {
  const teams = [
    { id: '1', name: '采矿一队', leader: '张三', members: 12, score: 95 },
    { id: '2', name: '机电班组', leader: '李四', members: 8, score: 92 }
  ];

  const columns = [
    { title: '班组名称', dataIndex: 'name', key: 'name' },
    { title: '班组长', dataIndex: 'leader', key: 'leader' },
    { title: '成员数', dataIndex: 'members', key: 'members' },
    { title: '考核得分', dataIndex: 'score', key: 'score', render: (score: number) => <Tag color={score >= 90 ? 'success' : 'warning'}>{score}分</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">考核</Button></Space> }
  ];

  const orgTree = [
    { title: '矿井', key: '0', children: [
      { title: '采矿部', key: '0-0', children: [{ title: '采矿一队', key: '0-0-0' }, { title: '采矿二队', key: '0-0-1' }] },
      { title: '机电部', key: '0-1', children: [{ title: '机电班组', key: '0-1-0' }] }
    ]}
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { key: '1', label: <span><TeamOutlined /> 班组网络</span>, children: <Card title="组织架构"><Tree treeData={orgTree} defaultExpandAll /></Card> },
        { key: '2', label: <span><UserOutlined /> 班组管理</span>, children: <Card title="班组列表"><Table columns={columns} dataSource={teams} rowKey="id" /></Card> },
        { key: '3', label: <span><CheckCircleOutlined /> 标准化考核</span>, children: <Card title="考核记录"><div style={{ padding: 20, textAlign: 'center' }}>考核记录功能</div></Card> },
        { key: '4', label: <span><FileTextOutlined /> 班前会</span>, children: <Card title="班前会记录"><div style={{ padding: 20, textAlign: 'center' }}>班前会记录功能</div></Card> }
      ]} />
    </div>
  );
};

export default TeamBuilding;
