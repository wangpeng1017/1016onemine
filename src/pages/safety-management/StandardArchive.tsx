import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Upload, message, Tabs, Tree } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Option } = Select;

interface Standard {
  id: string;
  name: string;
  category: string;
  scope: string;
  validUntil: string;
  uploadDate: string;
}

const StandardArchive: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const categories: DataNode[] = [
    {
      title: '安全生产法律法规',
      key: 'law',
      icon: <FolderOutlined />,
      children: [
        { title: '国家法律', key: 'law-national', icon: <FolderOutlined /> },
        { title: '地方法规', key: 'law-local', icon: <FolderOutlined /> }
      ]
    },
    {
      title: '安全技术标准',
      key: 'tech',
      icon: <FolderOutlined />,
      children: [
        { title: '国家标准', key: 'tech-national', icon: <FolderOutlined /> },
        { title: '行业标准', key: 'tech-industry', icon: <FolderOutlined /> }
      ]
    },
    {
      title: '安全管理制度',
      key: 'management',
      icon: <FolderOutlined />
    },
    {
      title: '应急预案',
      key: 'emergency',
      icon: <FolderOutlined />
    }
  ];

  const standards: Standard[] = [
    {
      id: '1',
      name: '煤矿安全规程',
      category: '安全生产法律法规',
      scope: '全矿',
      validUntil: '2025-12-31',
      uploadDate: '2024-01-15'
    },
    {
      id: '2',
      name: '矿山安全生产标准化管理体系',
      category: '安全技术标准',
      scope: '全矿',
      validUntil: '2026-06-30',
      uploadDate: '2024-02-20'
    }
  ];

  const columns = [
    { title: '规范名称', dataIndex: 'name', key: 'name' },
    { title: '所属类别', dataIndex: 'category', key: 'category' },
    { title: '适用范围', dataIndex: 'scope', key: 'scope' },
    { title: '有效期限', dataIndex: 'validUntil', key: 'validUntil' },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>预览</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>下载</Button>
          <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ];

  const handleUpload = () => {
    form.validateFields().then(() => {
      message.success('上传成功');
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Tabs
      items={[
        {
          key: 'standards',
          label: <span><FileOutlined /> 规范管理</span>,
          children: (
            <Card
              title="标准规范库"
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                  上传规范
                </Button>
              }
            >
              <Table columns={columns} dataSource={standards} rowKey="id" />
            </Card>
          )
        },
        {
          key: 'categories',
          label: <span><FolderOutlined /> 类别管理</span>,
          children: (
            <Card title="类别结构">
              <Tree
                showIcon
                defaultExpandAll
                treeData={categories}
              />
            </Card>
          )
        }
      ]}
    />
  );
};

export default StandardArchive;
