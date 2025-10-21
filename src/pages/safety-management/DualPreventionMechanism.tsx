import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Tabs, Modal, Form, Input, Select, DatePicker, Upload, message, Progress } from 'antd';
import { PlusOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface Risk {
  id: string;
  name: string;
  location: string;
  type: string;
  level: 'red' | 'orange' | 'yellow' | 'blue';
  measures: string;
  responsible: string;
}

interface Hazard {
  id: string;
  description: string;
  level: '一般' | '重大';
  location: string;
  reporter: string;
  reportTime: string;
  status: 'pending' | 'processing' | 'completed';
  deadline: string;
}

const DualPreventionMechanism: React.FC = () => {
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [hazardModalVisible, setHazardModalVisible] = useState(false);
  const [form] = Form.useForm();

  const risks: Risk[] = [
    {
      id: 'R001',
      name: '边坡滑坡风险',
      location: '北区边坡',
      type: '地质灾害',
      level: 'red',
      measures: '24小时监测、设置警戒线',
      responsible: '张三'
    },
    {
      id: 'R002',
      name: '爆破作业风险',
      location: '采矿区A',
      type: '爆破作业',
      level: 'orange',
      measures: '严格执行爆破规程、人员撤离',
      responsible: '李四'
    }
  ];

  const hazards: Hazard[] = [
    {
      id: 'H001',
      description: '边坡防护网破损',
      level: '一般',
      location: '北区边坡',
      reporter: '王五',
      reportTime: '2024-01-15 10:30',
      status: 'processing',
      deadline: '2024-01-20'
    },
    {
      id: 'H002',
      description: '爆破器材存储不规范',
      level: '重大',
      location: '爆破器材库',
      reporter: '赵六',
      reportTime: '2024-01-14 14:20',
      status: 'pending',
      deadline: '2024-01-16'
    }
  ];

  const levelColors = {
    red: { color: '#ff4d4f', text: '重大风险' },
    orange: { color: '#ff7a45', text: '较大风险' },
    yellow: { color: '#ffc53d', text: '一般风险' },
    blue: { color: '#1890ff', text: '低风险' }
  };

  const statusMap = {
    pending: { color: 'error', text: '待处理', icon: <ClockCircleOutlined /> },
    processing: { color: 'warning', text: '处理中', icon: <ClockCircleOutlined /> },
    completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> }
  };

  const riskColumns = [
    { title: '风险点名称', dataIndex: 'name', key: 'name' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '风险类型', dataIndex: 'type', key: 'type' },
    {
      title: '风险等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: keyof typeof levelColors) => (
        <Tag color={levelColors[level].color}>{levelColors[level].text}</Tag>
      )
    },
    { title: '管控措施', dataIndex: 'measures', key: 'measures' },
    { title: '责任人', dataIndex: 'responsible', key: 'responsible' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">查看详情</Button>
        </Space>
      )
    }
  ];

  const hazardColumns = [
    { title: '隐患描述', dataIndex: 'description', key: 'description' },
    {
      title: '隐患等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={level === '重大' ? 'red' : 'orange'}>{level}</Tag>
      )
    },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '上报人', dataIndex: 'reporter', key: 'reporter' },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusMap) => (
        <Tag icon={statusMap[status].icon} color={statusMap[status].color}>
          {statusMap[status].text}
        </Tag>
      )
    },
    { title: '整改期限', dataIndex: 'deadline', key: 'deadline' },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Hazard) => (
        <Space>
          {record.status !== 'completed' && <Button type="link" size="small">处理</Button>}
          <Button type="link" size="small">查看</Button>
        </Space>
      )
    }
  ];

  return (
    <Tabs
      items={[
        {
          key: 'risk',
          label: <span><WarningOutlined /> 风险分级管控</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>45</div>
                    <div style={{ color: '#999' }}>风险点总数</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>3</div>
                    <div style={{ color: '#999' }}>重大风险</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff7a45' }}>12</div>
                    <div style={{ color: '#999' }}>较大风险</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ffc53d' }}>18</div>
                    <div style={{ color: '#999' }}>一般风险</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>12</div>
                    <div style={{ color: '#999' }}>低风险</div>
                  </div>
                </Space>
              </Card>
              <Card
                title="风险清单"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setRiskModalVisible(true)}>
                    新增风险点
                  </Button>
                }
              >
                <Table columns={riskColumns} dataSource={risks} rowKey="id" />
              </Card>
            </div>
          )
        },
        {
          key: 'hazard',
          label: <span><CheckCircleOutlined /> 隐患排查治理</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>28</div>
                    <div style={{ color: '#999' }}>本月隐患数</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>20</div>
                    <div style={{ color: '#999' }}>已整改</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>6</div>
                    <div style={{ color: '#999' }}>整改中</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>2</div>
                    <div style={{ color: '#999' }}>逾期未改</div>
                  </div>
                  <div>
                    <Progress type="circle" percent={71} width={60} />
                    <div style={{ color: '#999', marginTop: 8 }}>整改率</div>
                  </div>
                </Space>
              </Card>
              <Card
                title="隐患台账"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setHazardModalVisible(true)}>
                    上报隐患
                  </Button>
                }
              >
                <Table columns={hazardColumns} dataSource={hazards} rowKey="id" />
              </Card>
            </div>
          )
        }
      ]}
    />
  );
};

export default DualPreventionMechanism;
