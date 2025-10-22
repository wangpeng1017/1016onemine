import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Tabs, Tree, Modal, Form, DatePicker, Upload, message } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, DownloadOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;

const StandardArchive: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const standards = [
    { key: '1', name: '煤矿安全规程', category: '国家标准', scope: '全矿', validUntil: '2026-12-31', status: '有效', uploadDate: '2024-01-01' },
    { key: '2', name: '煤矿防治水细则', category: '行业标准', scope: '防排水系统', validUntil: '2025-06-30', status: '有效', uploadDate: '2023-12-15' },
    { key: '3', name: '矿山安全生产标准化', category: '国家标准', scope: '全矿', validUntil: '2026-03-31', status: '有效', uploadDate: '2024-02-01' }
  ];

  const columns = [
    { title: '规范名称', dataIndex: 'name', key: 'name' },
    { title: '所属类别', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color='blue'>{c}</Tag> },
    { title: '适用范围', dataIndex: 'scope', key: 'scope' },
    { title: '有效期限', dataIndex: 'validUntil', key: 'validUntil' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color='success'>{s}</Tag> },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type='link' size='small' icon={<EyeOutlined />}>预览</Button>
        <Button type='link' size='small' icon={<DownloadOutlined />}>下载</Button>
        <Button type='link' danger size='small' icon={<DeleteOutlined />}>删除</Button>
      </Space>
    )}
  ];

  const categoryTree = [
    { title: '安全生产法律法规', key: '0-0', icon: <FolderOutlined />, children: [
      { title: '国家法律', key: '0-0-0', icon: <FolderOutlined /> },
      { title: '地方法规', key: '0-0-1', icon: <FolderOutlined /> }
    ]},
    { title: '安全技术标准', key: '0-1', icon: <FolderOutlined />, children: [
      { title: '国家标准', key: '0-1-0', icon: <FolderOutlined /> },
      { title: '行业标准', key: '0-1-1', icon: <FolderOutlined /> }
    ]},
    { title: '安全管理制度', key: '0-2', icon: <FolderOutlined /> },
    { title: '应急预案', key: '0-3', icon: <FolderOutlined /> }
  ];

  const chartOption = {
    title: { text: '档案类别分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 45, name: '法律法规' },
        { value: 38, name: '技术标准' },
        { value: 28, name: '管理制度' },
        { value: 15, name: '应急预案' }
      ]
    }]
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        {
          key: '1',
          label: <span><FileTextOutlined /> 规范管理</span>,
          children: (
            <Card title="标准规范库" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>上传规范</Button>}>
              <Space style={{ marginBottom: 16 }}>
                <Input placeholder='搜索规范名称' prefix={<SearchOutlined />} style={{ width: 250 }} />
                <Select placeholder='所属类别' style={{ width: 150 }}>
                  <Option value='national'>国家标准</Option>
                  <Option value='industry'>行业标准</Option>
                </Select>
                <Button type='primary' icon={<SearchOutlined />}>查询</Button>
              </Space>
              <Table columns={columns} dataSource={standards} pagination={{ pageSize: 10 }} />
            </Card>
          )
        },
        {
          key: '2',
          label: <span><FolderOutlined /> 类别管理</span>,
          children: (
            <Card title="类别结构" extra={<Button type="primary" icon={<PlusOutlined />}>新增类别</Button>}>
              <Tree showIcon defaultExpandAll treeData={categoryTree} />
            </Card>
          )
        },
        {
          key: '3',
          label: <span><FileTextOutlined /> 档案信息</span>,
          children: (
            <Card title="档案信息管理">
              <Tabs tabPosition="left" items={[
                { key: '3-1', label: '作业人员信息', children: <div style={{ padding: 20 }}>作业人员档案管理</div> },
                { key: '3-2', label: '设备信息', children: <div style={{ padding: 20 }}>设备档案管理</div> },
                { key: '3-3', label: '安全管理制度', children: <div style={{ padding: 20 }}>制度档案管理</div> },
                { key: '3-4', label: '应急预案', children: <div style={{ padding: 20 }}>预案档案管理</div> }
              ]} />
            </Card>
          )
        },
        {
          key: '4',
          label: <span><SearchOutlined /> 统计分析</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>126</div><div style={{ color: '#999' }}>档案总数</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>45</div><div style={{ color: '#999' }}>法律法规</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>38</div><div style={{ color: '#999' }}>技术标准</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>28</div><div style={{ color: '#999' }}>管理制度</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>15</div><div style={{ color: '#999' }}>应急预案</div></div>
                </Space>
              </Card>
              <Card>
                <ReactECharts option={chartOption} style={{ height: 400 }} />
              </Card>
            </div>
          )
        }
      ]} />

      <Modal
        title="上传规范文档"
        open={modalVisible}
        onOk={() => { message.success('上传成功'); setModalVisible(false); form.resetFields(); }}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规范名称" rules={[{ required: true }]}>
            <Input placeholder="请输入规范名称" />
          </Form.Item>
          <Form.Item name="category" label="所属类别" rules={[{ required: true }]}>
            <Select placeholder="请选择类别">
              <Option value="national">国家标准</Option>
              <Option value="industry">行业标准</Option>
            </Select>
          </Form.Item>
          <Form.Item name="scope" label="适用范围" rules={[{ required: true }]}>
            <Input placeholder="请输入适用范围" />
          </Form.Item>
          <Form.Item name="validUntil" label="有效期限" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="file" label="上传文件" rules={[{ required: true }]}>
            <Upload><Button icon={<UploadOutlined />}>选择文件</Button></Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StandardArchive;
