import React from 'react';
import { Card, Table, Button, Space, Tag, Tabs, Progress, Badge } from 'antd';
import { TeamOutlined, UserOutlined, SafetyCertificateOutlined, BookOutlined, WarningOutlined } from '@ant-design/icons';

interface Personnel {
  id: string;
  name: string;
  department: string;
  position: string;
  trainings: number;
  certificates: number;
  expiringCerts: number;
}

const SafetyTraining: React.FC = () => {
  const personnel: Personnel[] = [
    {
      id: 'P001',
      name: '张三',
      department: '采矿部',
      position: '采矿工',
      trainings: 12,
      certificates: 3,
      expiringCerts: 1
    },
    {
      id: 'P002',
      name: '李四',
      department: '机电部',
      position: '电工',
      trainings: 15,
      certificates: 4,
      expiringCerts: 0
    }
  ];

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '岗位', dataIndex: 'position', key: 'position' },
    { title: '培训次数', dataIndex: 'trainings', key: 'trainings' },
    { title: '持证数量', dataIndex: 'certificates', key: 'certificates' },
    {
      title: '即将过期',
      dataIndex: 'expiringCerts',
      key: 'expiringCerts',
      render: (count: number) => 
        count > 0 ? <Badge count={count} style={{ backgroundColor: '#ff4d4f' }} /> : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">查看档案</Button>
          <Button type="link" size="small">培训记录</Button>
        </Space>
      )
    }
  ];

  return (
    <Tabs
      items={[
        {
          key: 'personnel',
          label: <span><UserOutlined /> 人员档案</span>,
          children: (
            <Card title="培训人员档案">
              <Table columns={columns} dataSource={personnel} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'training',
          label: <span><BookOutlined /> 培训管理</span>,
          children: (
            <Card title="培训计划">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card size="small" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>2024年1月安全培训</div>
                      <div style={{ color: '#999', fontSize: 12 }}>培训时间: 2024-01-20</div>
                    </div>
                    <Space>
                      <Tag color="processing">进行中</Tag>
                      <Button type="link" size="small">查看</Button>
                    </Space>
                  </div>
                </Card>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>特种作业人员复训</div>
                      <div style={{ color: '#999', fontSize: 12 }}>培训时间: 2024-01-25</div>
                    </div>
                    <Space>
                      <Tag>待开始</Tag>
                      <Button type="link" size="small">查看</Button>
                    </Space>
                  </div>
                </Card>
              </Space>
            </Card>
          )
        },
        {
          key: 'certificate',
          label: (
            <span>
              <Badge count={3} offset={[10, 0]}>
                <SafetyCertificateOutlined /> 证件管理
              </Badge>
            </span>
          ),
          children: (
            <Card title="证件预警">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card size="small" style={{ borderLeft: '3px solid #ff4d4f' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div>
                      <WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                      <span style={{ fontWeight: 'bold' }}>张三 - 特种作业证</span>
                      <div style={{ color: '#999', fontSize: 12, marginLeft: 24 }}>
                        有效期至: 2024-02-15 (15天后过期)
                      </div>
                    </div>
                    <Button type="link" size="small">处理</Button>
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

export default SafetyTraining;
