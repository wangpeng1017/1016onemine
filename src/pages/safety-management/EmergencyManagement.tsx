import React from 'react';
import { Card, Table, Button, Space, Tag, Tabs, Progress } from 'antd';
import { ThunderboltOutlined, FileProtectOutlined, ToolOutlined, BarChartOutlined } from '@ant-design/icons';

const EmergencyManagement: React.FC = () => {
  const plans = [
    { id: '1', name: '边坡滑坡应急预案', type: '专项预案', status: '有效', updateDate: '2024-01-01' },
    { id: '2', name: '火灾事故应急预案', type: '专项预案', status: '有效', updateDate: '2023-12-15' }
  ];

  const materials = [
    { id: '1', name: '应急物资库A', location: '北区', items: 45, lowStock: 3 },
    { id: '2', name: '应急物资库B', location: '南区', items: 38, lowStock: 1 }
  ];

  const planColumns = [
    { title: '预案名称', dataIndex: 'name', key: 'name' },
    { 
      title: '预案类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color="success">{status}</Tag>
    },
    { title: '更新日期', dataIndex: 'updateDate', key: 'updateDate' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">演练</Button>
        </Space>
      )
    }
  ];

  const materialColumns = [
    { title: '物资库', dataIndex: 'name', key: 'name' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '物资种类', dataIndex: 'items', key: 'items' },
    {
      title: '库存预警',
      dataIndex: 'lowStock',
      key: 'lowStock',
      render: (count: number) => 
        count > 0 ? <Tag color="warning">{count}项低库存</Tag> : <Tag color="success">正常</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">查看详情</Button>
          <Button type="link" size="small">补充物资</Button>
        </Space>
      )
    }
  ];

  return (
    <Tabs
      items={[
        {
          key: 'plans',
          label: <span><FileProtectOutlined /> 应急预案</span>,
          children: (
            <Card title="应急预案库">
              <Table columns={planColumns} dataSource={plans} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'materials',
          label: <span><ToolOutlined /> 应急物资</span>,
          children: (
            <Card title="应急物资管理">
              <Table columns={materialColumns} dataSource={materials} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'drills',
          label: <span><BarChartOutlined /> 应急演练</span>,
          children: (
            <Card title="演练记录">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>边坡滑坡应急演练</div>
                      <div style={{ color: '#999', fontSize: 12 }}>演练时间: 2024-01-10</div>
                    </div>
                    <Space>
                      <Tag color="success">已完成</Tag>
                      <Button type="link" size="small">查看报告</Button>
                    </Space>
                  </div>
                </Card>
              </Space>
            </Card>
          )
        }
      ]}
    />
  );
};

export default EmergencyManagement;
