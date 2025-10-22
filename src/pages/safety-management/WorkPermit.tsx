import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Tabs, Modal, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import { ToolOutlined, PlusOutlined, FileTextOutlined, BarChartOutlined, UploadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const WorkPermit: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const permits = [
    { id: 'WP001', type: '动火作业', content: '设备焊接维修', location: '机修车间', applicant: '张三', status: 'executing', startTime: '2024-01-15 08:00', endTime: '2024-01-15 18:00' },
    { id: 'WP002', type: '高空作业', content: '照明设备维护', location: '采矿区A', applicant: '李四', status: 'approving', startTime: '2024-01-16 09:00', endTime: '2024-01-16 17:00' },
    { id: 'WP003', type: '受限空间', content: '罐体检修', location: '储罐区', applicant: '王五', status: 'completed', startTime: '2024-01-14 10:00', endTime: '2024-01-14 16:00' }
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
    { title: '作业类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '作业内容', dataIndex: 'content', key: 'content' },
    { title: '作业地点', dataIndex: 'location', key: 'location' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: keyof typeof statusMap) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag> },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <Button type="link" size="small">查看</Button>
        {record.status === 'approving' && <Button type="link" size="small">审批</Button>}
        {record.status === 'executing' && <Button type="link" size="small">验收</Button>}
      </Space>
    )}
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        {
          key: '1',
          label: <span><FileTextOutlined /> 作业票证</span>,
          children: (
            <Card title="作业票证管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新建作业票</Button>}>
              <Table columns={columns} dataSource={permits} rowKey="id" />
            </Card>
          )
        },
        {
          key: '2',
          label: <span><ToolOutlined /> 模板管理</span>,
          children: (
            <Card title="票证模板库" extra={<Button type="primary" icon={<PlusOutlined />}>新增模板</Button>}>
              <Table 
                size="small"
                columns={[
                  { title: '模板名称', dataIndex: 'name', key: 'name' },
                  { title: '作业类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
                  { title: '必填项', dataIndex: 'required', key: 'required' },
                  { title: '审批流程', dataIndex: 'workflow', key: 'workflow' },
                  { title: '使用次数', dataIndex: 'usage', key: 'usage' },
                  { title: '操作', key: 'action', render: () => (
                    <Space>
                      <Button type="link" size="small">预览</Button>
                      <Button type="link" size="small">编辑</Button>
                      <Button type="link" size="small">下载</Button>
                    </Space>
                  )}
                ]}
                dataSource={[
                  { key: '1', name: '动火作业票', type: '动火作业', required: 8, workflow: '三级审批', usage: 156 },
                  { key: '2', name: '高空作业票', type: '高空作业', required: 7, workflow: '二级审批', usage: 98 },
                  { key: '3', name: '受限空间作业票', type: '受限空间', required: 9, workflow: '三级审批', usage: 67 },
                  { key: '4', name: '临时用电作业票', type: '临时用电', required: 6, workflow: '二级审批', usage: 45 }
                ]}
              />
            </Card>
          )
        },
        {
          key: '3',
          label: <span><BarChartOutlined /> 作业看板</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>15</div><div style={{ color: '#999' }}>今日作业票</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>8</div><div style={{ color: '#999' }}>执行中</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>3</div><div style={{ color: '#999' }}>待审批</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>4</div><div style={{ color: '#999' }}>已完成</div></div>
                </Space>
              </Card>
              <Card title="作业类型统计">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[{ type: '动火作业', count: 5 }, { type: '高空作业', count: 4 }, { type: '受限空间', count: 3 }, { type: '临时用电', count: 3 }].map(item => (
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
      ]} />

      <Modal title="新建作业票" open={modalVisible} onOk={() => { message.success('创建成功'); setModalVisible(false); form.resetFields(); }} onCancel={() => setModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="作业类型" rules={[{ required: true }]}>
            <Select placeholder="请选择作业类型">
              <Option value="fire">动火作业</Option>
              <Option value="height">高空作业</Option>
              <Option value="confined">受限空间</Option>
              <Option value="electric">临时用电</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="作业内容" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入作业内容" />
          </Form.Item>
          <Form.Item name="location" label="作业地点" rules={[{ required: true }]}>
            <Input placeholder="请输入作业地点" />
          </Form.Item>
          <Form.Item name="time" label="作业时间" rules={[{ required: true }]}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="measures" label="安全措施" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请输入安全措施" />
          </Form.Item>
          <Form.Item name="attachment" label="附件">
            <Upload><Button icon={<UploadOutlined />}>上传文件</Button></Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkPermit;
