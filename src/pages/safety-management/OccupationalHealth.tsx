import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Badge } from 'antd';
import { MedicineBoxOutlined, UserOutlined, EnvironmentOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';

const OccupationalHealth: React.FC = () => {
  const healthRecords = [
    { id: '1', name: '张三', dept: '采矿部', lastCheck: '2024-01-10', status: 'normal', abnormal: 0 },
    { id: '2', name: '李四', dept: '机电部', lastCheck: '2023-12-15', status: 'warning', abnormal: 2 }
  ];

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '最近体检', dataIndex: 'lastCheck', key: 'lastCheck' },
    { title: '异常项', dataIndex: 'abnormal', key: 'abnormal', render: (n: number) => n > 0 ? <Badge count={n} /> : '-' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'normal' ? 'success' : 'warning'}>{s === 'normal' ? '正常' : '异常'}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { key: '1', label: <span><UserOutlined /> 健康档案</span>, children: <Card title="职业健康档案"><Table columns={columns} dataSource={healthRecords} rowKey="id" /></Card> },
        { key: '2', label: <span><MedicineBoxOutlined /> 体检管理</span>, children: <Card title="体检计划"><div style={{ padding: 20, textAlign: 'center' }}>体检管理功能</div></Card> },
        { key: '3', label: <span><EnvironmentOutlined /> 防护设施</span>, children: <Card title="防护设施管理"><div style={{ padding: 20, textAlign: 'center' }}>防护设施功能</div></Card> },
        { key: '4', label: <span><ShoppingOutlined /> 劳保用品</span>, children: <Card title="劳保用品管理"><div style={{ padding: 20, textAlign: 'center' }}>劳保用品功能</div></Card> },
        { key: '5', label: <span><FileTextOutlined /> 报表管理</span>, children: <Card title="法定报表"><div style={{ padding: 20, textAlign: 'center' }}>报表管理功能</div></Card> }
      ]} />
    </div>
  );
};

export default OccupationalHealth;
