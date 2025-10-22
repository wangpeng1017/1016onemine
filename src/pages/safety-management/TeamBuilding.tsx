import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Tree, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { TeamOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

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

  const meetingColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '班组', dataIndex: 'team', key: 'team', width: 120 },
    { title: '主持人', dataIndex: 'host', key: 'host', width: 100 },
    { title: '参与人数', dataIndex: 'attendees', key: 'attendees', width: 100 },
    { title: '安全要点', dataIndex: 'points', key: 'points' },
    { title: '操作', key: 'action', width: 150, render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">编辑</Button></Space> }
  ];

  const meetingData = [
    { key: '1', date: '2024-01-15', team: '采矿一队', host: '张三', attendees: 12, points: '边坡安全、爆破防护' },
    { key: '2', date: '2024-01-15', team: '机电班组', host: '李四', attendees: 8, points: '用电安全、设备检修' }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { 
          key: '1', 
          label: <span><TeamOutlined /> 班组网络</span>, 
          children: (
            <Card title="组织架构">
              <Tree 
                treeData={orgTree} 
                defaultExpandAll 
                onSelect={(keys, info) => {
                  if (keys.length > 0) {
                    Modal.info({
                      title: info.node.title as string,
                      content: `点击查看 ${info.node.title} 详细信息`
                    });
                  }
                }}
              />
            </Card>
          )
        },
        { 
          key: '2', 
          label: <span><UserOutlined /> 班组管理</span>, 
          children: (
            <Card title="班组列表" extra={<Button type="primary" icon={<PlusOutlined />}>新增班组</Button>}>
              <Table columns={columns} dataSource={teams} rowKey="id" />
            </Card>
          )
        },
        { 
          key: '3', 
          label: <span><CheckCircleOutlined /> 标准化考核</span>, 
          children: (
            <Card title="考核记录" extra={<Button type="primary" icon={<PlusOutlined />}>发起考核</Button>}>
              <Table 
                size="small"
                columns={[
                  { title: '考核日期', dataIndex: 'date', key: 'date' },
                  { title: '班组', dataIndex: 'team', key: 'team' },
                  { title: '考核类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
                  { title: '得分', dataIndex: 'score', key: 'score', render: (s: number) => <Tag color={s >= 90 ? 'success' : 'warning'}>{s}分</Tag> },
                  { title: '考核人', dataIndex: 'assessor', key: 'assessor' },
                  { title: '操作', key: 'action', render: () => <Button type="link" size="small">查看</Button> }
                ]}
                dataSource={[
                  { key: '1', date: '2024-01-10', team: '采矿一队', type: '月度考核', score: 95, assessor: '王五' },
                  { key: '2', date: '2024-01-08', team: '机电班组', type: '月度考核', score: 92, assessor: '赵六' }
                ]}
              />
            </Card>
          )
        },
        { 
          key: '4', 
          label: <span><FileTextOutlined /> 班前会</span>, 
          children: (
            <Card title="班前会记录" extra={<Button type="primary" icon={<PlusOutlined />}>记录班前会</Button>}>
              <Table columns={meetingColumns} dataSource={meetingData} rowKey="key" size="small" />
            </Card>
          )
        }
      ]} />
    </div>
  );
};

export default TeamBuilding;
