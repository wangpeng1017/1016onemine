import React, { useState } from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, Upload, message, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Document } from '../../types/environmental';

const { Search } = Input;
const { Option } = Select;

interface DocumentManagerProps {
  documents: Document[];
  onAdd: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Document>) => void;
  allowedTypes?: Document['type'][];
  title?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onAdd,
  onDelete,
  onUpdate,
  allowedTypes,
  title = '文档管理'
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [form] = Form.useForm();

  const typeLabels: Record<Document['type'], string> = {
    approval: '环保批复',
    acceptance: '验收报告',
    water_quality: '水质检测',
    soil: '土壤检测',
    solid_waste: '固废检测',
    ecology: '生态检测'
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         doc.tags.some(tag => tag.includes(searchText));
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const columns: ColumnsType<Document> = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true
    },
    {
      title: '文档类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: Document['type']) => (
        <Tag color="blue">{typeLabels[type]}</Tag>
      )
    },
    {
      title: '上传日期',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      width: 120,
      sorter: (a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} color="green" style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: '相关项目',
      dataIndex: 'relatedProject',
      key: 'relatedProject',
      width: 150,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          {onDelete && (
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  const handleUpload = () => {
    form.validateFields().then(values => {
      // 在实际应用中，这里会处理文件上传
      const newDoc: Omit<Document, 'id' | 'uploadDate'> = {
        name: values.name,
        type: values.type,
        fileSize: '0KB', // 模拟
        version: values.version || 'v1.0',
        tags: values.tags || [],
        relatedProject: values.relatedProject,
        approvalDate: values.approvalDate
      };
      onAdd(newDoc);
      message.success('文档上传成功');
      setUploadModalVisible(false);
      form.resetFields();
    });
  };

  const handleDownload = (doc: Document) => {
    message.info(`下载: ${doc.name}`);
    // 实际应用中会触发文件下载
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此文档吗？',
      onOk: () => {
        onDelete?.(id);
        message.success('删除成功');
      }
    });
  };

  const types = allowedTypes || ['approval', 'acceptance', 'water_quality', 'soil', 'solid_waste', 'ecology'];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search
            placeholder="搜索文档名称或标签"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={setSearchText}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            placeholder="筛选类型"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">全部类型</Option>
            {types.map(type => (
              <Option key={type} value={type}>
                {typeLabels[type]}
              </Option>
            ))}
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
        >
          上传文档
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDocuments}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="上传文档"
        open={uploadModalVisible}
        onOk={handleUpload}
        onCancel={() => {
          setUploadModalVisible(false);
          form.resetFields();
        }}
        okText="上传"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="文档名称"
            rules={[{ required: true, message: '请输入文档名称' }]}
          >
            <Input placeholder="例如：矿山环评批复_2024" />
          </Form.Item>

          <Form.Item
            name="type"
            label="文档类型"
            rules={[{ required: true, message: '请选择文档类型' }]}
          >
            <Select placeholder="请选择">
              {types.map(type => (
                <Option key={type} value={type}>
                  {typeLabels[type]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="relatedProject" label="相关项目">
            <Input placeholder="例如：矿山扩建项目" />
          </Form.Item>

          <Form.Item name="approvalDate" label="批准日期">
            <Input type="date" />
          </Form.Item>

          <Form.Item name="version" label="版本号">
            <Input placeholder="v1.0" defaultValue="v1.0" />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="添加标签，按回车确认">
              <Option value="重要">重要</Option>
              <Option value="已归档">已归档</Option>
              <Option value="待审核">待审核</Option>
            </Select>
          </Form.Item>

          <Form.Item name="file" label="选择文件">
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentManager;
