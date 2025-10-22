import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Tabs, Form, Input, InputNumber, Upload, message } from 'antd';
import { AuditOutlined, FileTextOutlined, TrophyOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

interface AssessmentItem {
  id: string;
  category: string;
  content: string;
  standardScore: number;
  selfScore?: number;
  checkScore?: number;
  status: 'pending' | 'self-assessed' | 'checked';
}

const SafetyStandardization: React.FC = () => {
  const [form] = Form.useForm();

  const assessmentData: AssessmentItem[] = [
    {
      id: '1',
      category: '安全基础管理',
      content: '安全生产目标',
      standardScore: 100,
      selfScore: 95,
      checkScore: 92,
      status: 'checked'
    },
    {
      id: '2',
      category: '安全基础管理',
      content: '组织保障',
      standardScore: 100,
      selfScore: 90,
      status: 'self-assessed'
    },
    {
      id: '3',
      category: '重大灾害防治',
      content: '边坡管理',
      standardScore: 150,
      status: 'pending'
    }
  ];

  const columns = [
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '考核内容', dataIndex: 'content', key: 'content' },
    { title: '标准分值', dataIndex: 'standardScore', key: 'standardScore' },
    { 
      title: '自评分', 
      dataIndex: 'selfScore', 
      key: 'selfScore',
      render: (score?: number) => score || '-'
    },
    { 
      title: '检查得分', 
      dataIndex: 'checkScore', 
      key: 'checkScore',
      render: (score?: number) => score || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'default', text: '待评估' },
          'self-assessed': { color: 'processing', text: '已自评' },
          checked: { color: 'success', text: '已检查' }
        };
        const s = statusMap[status as keyof typeof statusMap];
        return <Tag color={s.color}>{s.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AssessmentItem) => (
        <Space>
          <Button type="link" size="small">自评</Button>
          <Button type="link" size="small">查看</Button>
          {record.status === 'self-assessed' && (
            <Button type="link" size="small">转隐患</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Tabs
      items={[
        {
          key: 'overview',
          label: <span><TrophyOutlined /> 标准化总览</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div>
                    <Progress type="circle" percent={92.5} width={100} />
                    <div style={{ textAlign: 'center', marginTop: 8 }}>总体得分</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>一级</div>
                    <div style={{ color: '#999' }}>标准化等级</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>925</div>
                    <div style={{ color: '#999' }}>总得分</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>1000</div>
                    <div style={{ color: '#999' }}>满分</div>
                  </div>
                </Space>
              </Card>
              <Card title="考核项目进度">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <div style={{ marginBottom: 8 }}>安全基础管理</div>
                    <Progress percent={95} status="active" />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>重大灾害防治</div>
                    <Progress percent={88} status="active" />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>专业管理</div>
                    <Progress percent={92} status="active" />
                  </div>
                </Space>
              </Card>
            </div>
          )
        },
        {
          key: 'assessment',
          label: <span><AuditOutlined /> 考核评分</span>,
          children: (
            <Card
              title="标准化考核表"
              extra={
                <Button type="primary" icon={<PlusOutlined />}>
                  新增考核项
                </Button>
              }
            >
              <Table columns={columns} dataSource={assessmentData} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'templates',
          label: <span><FileTextOutlined /> 模板库</span>,
          children: (
            <Card title="文档模板">
              <Space direction="vertical" style={{ width: '100%' }}>
                {['安全生产承诺书', '安全管理方案', '年度安全报告', '隐患整改方案'].map(name => (
                  <Card key={name} size="small" style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><FileTextOutlined /> {name}</span>
                      <Space>
                        <Button type="link" size="small" icon={<UploadOutlined />}>下载</Button>
                        <Button type="link" size="small">在线填写</Button>
                      </Space>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>
          )
        }
      ]}
    />
  );
};

export default SafetyStandardization;
