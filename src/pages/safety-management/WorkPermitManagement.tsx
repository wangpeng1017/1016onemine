import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Tabs, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { ToolOutlined, PlusOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface WorkPermit {
  id: string;
  type: string;
  content: string;
  location: string;
  applicant: string;
  status: 'pending' | 'approving' | 'executing' | 'completed' | 'closed';
  startTime: string;
  endTime: string;
}

const WorkPermitManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const permits: WorkPermit[] = [
    {
      id: 'WP001',
      type: '动火作业',
      content: '设备焊接维修',
      location: '机修车间',
      applicant: '张三',
      status: 'executing',
      startTime: '2024-01-15 08:00',
      endTime: '2024-01-15 18:00'
    },
    {
      id: 'WP002',
      type: '高空作业',
      content: '照明设备维护',
      location: '采矿区A',
      applicant: '李四',
      status: 'approving',
      startTime: '2024-01-16 09:00',
      endTime: '2024-01-16 17:00'
    }
  ];

  const statusMap = {
    pending: { color: 'default', text: '待办理' },
    approving: { color: 'processing', text: '审批中' },
    executing: { color: 'warning', text: '执行中' },
    completed: { color: 'success', text: '已验收' },
    closed: { color: 'default', text: '已关闭' }
  };

  const columns = [
    { title: '票证编号', dataIndex: 'id', key: 'id' },
    { 
      title: '作业类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { title: '作业内容', dataIndex: 'content', key: 'content' },
    { title: '作业地点', dataIndex: 'location', key: 'location' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusMap) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      )
    },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WorkPermit) => (
        <Space>
          <Button type="link" size="small">查看</Button>
          {record.status === 'approving' && <Button type="link" size="small">审批</Button>}
          {record.status === 'executing' && <Button type="link" size="small">验收</Button>}
        </Space>
      )
    }
  ];

  return (
    <Tabs
      items={[
        {
          key: 'list',
          label: <span><FileTextOutlined /> 作业票证</span>,
          children: (
            <Card
              title="作业票证管理"
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                  新建作业票
                </Button>
              }
            >
              <Table columns={columns} dataSource={permits} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'dashboard',
          label: <span><BarChartOutlined /> 作业看板</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>15</div>
                    <div style={{ color: '#999' }}>今日作业票</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>8</div>
                    <div style={{ color: '#999' }}>执行中</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>3</div>
                    <div style={{ color: '#999' }}>待审批</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>4</div>
                    <div style={{ color: '#999' }}>已完成</div>
                  </div>
                </Space>
              </Card>
              <Card title="作业类型统计">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[
                    { type: '动火作业', count: 5 },
                    { type: '高空作业', count: 4 },
                    { type: '受限空间', count: 3 },
                    { type: '临时用电', count: 3 }
                  ].map(item => (
                    <div key={item.type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.type}</span>
                      <span>{item.count}张</span>
                    </div>
                  ))}
                </Space>
              </Card>
            </div>
          )
        }
      ]}
    />
  );
};

export default WorkPermitManagement;
