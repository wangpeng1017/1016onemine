import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Upload,
  Modal,
  Input,
  Select,
  Tag,
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Progress,
  Divider
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FolderOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';

const { Search } = Input;
const { Option } = Select;

interface DocumentInfo {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'txt' | 'other';
  size: number;
  uploadTime: string;
  uploader: string;
  category: string;
  description?: string;
  url: string;
  status: 'active' | 'archived';
  downloadCount: number;
}

const ReportCenter: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentInfo | null>(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // 模拟文档数据
  useEffect(() => {
    const mockDocuments: DocumentInfo[] = [
      {
        id: '1',
        name: '矿山安全监测月度报告_2025年8月.pdf',
        type: 'pdf',
        size: 2048576,
        uploadTime: '2025-09-01 10:30:00',
        uploader: '张工程师',
        category: '监测报告',
        description: '2025年8月份矿山边坡安全监测数据分析报告',
        url: '/documents/monthly_report_202508.pdf',
        status: 'active',
        downloadCount: 15
      },
      {
        id: '2',
        name: 'GNSS监测点位布设方案.docx',
        type: 'docx',
        size: 1536000,
        uploadTime: '2025-08-28 14:20:00',
        uploader: '李技术员',
        category: '技术方案',
        description: 'GNSS表面位移监测点位优化布设技术方案',
        url: '/documents/gnss_layout_plan.docx',
        status: 'active',
        downloadCount: 8
      },
      {
        id: '3',
        name: '边坡稳定性分析报告.pdf',
        type: 'pdf',
        size: 3072000,
        uploadTime: '2025-08-25 16:45:00',
        uploader: '王地质师',
        category: '分析报告',
        description: '基于多源监测数据的边坡稳定性综合分析',
        url: '/documents/slope_stability_analysis.pdf',
        status: 'active',
        downloadCount: 22
      },
      {
        id: '4',
        name: '设备维护记录表_Q3.xlsx',
        type: 'xlsx',
        size: 512000,
        uploadTime: '2025-08-20 09:15:00',
        uploader: '陈维护员',
        category: '维护记录',
        description: '2025年第三季度监测设备维护保养记录',
        url: '/documents/maintenance_q3.xlsx',
        status: 'active',
        downloadCount: 5
      },
      {
        id: '5',
        name: '应急预案操作手册.pdf',
        type: 'pdf',
        size: 4096000,
        uploadTime: '2025-08-15 11:00:00',
        uploader: '刘安全员',
        category: '应急预案',
        description: '矿山边坡失稳应急处置操作手册',
        url: '/documents/emergency_manual.pdf',
        status: 'active',
        downloadCount: 12
      }
    ];

    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined style={{ color: '#666' }} />;
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取分类标签颜色
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      '监测报告': 'blue',
      '技术方案': 'green',
      '分析报告': 'orange',
      '维护记录': 'purple',
      '应急预案': 'red'
    };
    return colorMap[category] || 'default';
  };

  // 搜索和筛选
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterDocuments(value, categoryFilter, typeFilter);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    filterDocuments(searchText, value, typeFilter);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    filterDocuments(searchText, categoryFilter, value);
  };

  const filterDocuments = (search: string, category: string, type: string) => {
    let filtered = documents;

    if (search) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(doc => doc.category === category);
    }

    if (type !== 'all') {
      filtered = filtered.filter(doc => doc.type === type);
    }

    setFilteredDocuments(filtered);
  };

  // 预览文档
  const handlePreview = (doc: DocumentInfo) => {
    setSelectedDocument(doc);
    setPreviewModalVisible(true);
  };

  // 下载文档
  const handleDownload = (doc: DocumentInfo) => {
    // 模拟下载
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.click();
    
    // 更新下载次数
    setDocuments(prev => prev.map(d => 
      d.id === doc.id 
        ? { ...d, downloadCount: d.downloadCount + 1 }
        : d
    ));
    
    message.success(`开始下载 ${doc.name}`);
  };

  // 删除文档
  const handleDelete = (doc: DocumentInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文档 "${doc.name}" 吗？`,
      onOk: () => {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        setFilteredDocuments(prev => prev.filter(d => d.id !== doc.id));
        message.success('文档删除成功');
      }
    });
  };

  // 文件上传
  const handleUpload = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      setUploadModalVisible(false);
      // 这里应该刷新文档列表
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  const columns: ColumnsType<DocumentInfo> = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => formatFileSize(size),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
      key: 'uploader',
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      render: (count) => <span>{count}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="预览">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              disabled={record.type !== 'pdf'}
            />
          </Tooltip>
          <Tooltip title="下载">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadCount, 0);

  return (
    <div style={{ padding: '24px' }}>
      <div className="page-title">报告与文档中心</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="文档总数"
              value={totalDocuments}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="存储空间"
              value={formatFileSize(totalSize)}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总下载次数"
              value={totalDownloads}
              prefix={<DownloadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div>存储使用率</div>
            <Progress percent={65} status="active" />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              6.5 GB / 10 GB
            </div>
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <Search
                placeholder="搜索文档名称或描述"
                allowClear
                style={{ width: 300 }}
                onSearch={handleSearch}
              />
              <Select
                value={categoryFilter}
                style={{ width: 120 }}
                onChange={handleCategoryFilter}
              >
                <Option value="all">全部分类</Option>
                <Option value="监测报告">监测报告</Option>
                <Option value="技术方案">技术方案</Option>
                <Option value="分析报告">分析报告</Option>
                <Option value="维护记录">维护记录</Option>
                <Option value="应急预案">应急预案</Option>
              </Select>
              <Select
                value={typeFilter}
                style={{ width: 120 }}
                onChange={handleTypeFilter}
              >
                <Option value="all">全部类型</Option>
                <Option value="pdf">PDF</Option>
                <Option value="docx">Word</Option>
                <Option value="xlsx">Excel</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              上传文档
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 文档列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredDocuments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个文档`,
          }}
        />
      </Card>

      {/* 上传模态框 */}
      <Modal
        title="上传文档"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <h4>支持的文件格式：</h4>
          <p>PDF、Word文档(.doc, .docx)、Excel表格(.xls, .xlsx)、文本文件(.txt)</p>
          <p>单个文件大小不超过 50MB</p>
        </div>

        <Upload.Dragger
          name="file"
          multiple
          action="/api/documents/upload"
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传文档文件
          </p>
        </Upload.Dragger>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={() => setUploadModalVisible(false)}>
            取消
          </Button>
        </div>
      </Modal>

      {/* PDF预览模态框 */}
      <Modal
        title={selectedDocument?.name}
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => selectedDocument && handleDownload(selectedDocument)}>
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        {selectedDocument && selectedDocument.type === 'pdf' && (
          <div style={{ height: '70vh', border: '1px solid #d9d9d9' }}>
            <iframe
              src={selectedDocument.url}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title={selectedDocument.name}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportCenter;
