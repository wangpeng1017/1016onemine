import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Upload,
  Progress,
  Descriptions,

} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface Model {
  key: string;
  id: string;
  name: string;
  type: string;
  version: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  accuracy: number;
  createTime: string;
  updateTime: string;
  description: string;
  fileSize: string;
}

const ModelManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: Model[] = [
    {
      key: '1',
      id: 'MODEL001',
      name: '边坡稳定性预测模型',
      type: '机器学习模型',
      version: 'v2.1.0',
      status: 'active',
      accuracy: 94.5,
      createTime: '2023-12-01 10:30:00',
      updateTime: '2024-01-10 15:20:00',
      description: '基于历史监测数据训练的边坡稳定性预测模型',
      fileSize: '125.6MB',
    },
    {
      key: '2',
      id: 'MODEL002',
      name: '降雨诱发滑坡预警模型',
      type: '深度学习模型',
      version: 'v1.3.2',
      status: 'active',
      accuracy: 89.2,
      createTime: '2023-11-15 14:45:00',
      updateTime: '2024-01-05 09:15:00',
      description: '结合降雨量和地质条件的滑坡预警模型',
      fileSize: '89.3MB',
    },
    {
      key: '3',
      id: 'MODEL003',
      name: '岩体裂缝扩展预测模型',
      type: '数值模拟模型',
      version: 'v1.0.5',
      status: 'training',
      accuracy: 0,
      createTime: '2024-01-08 11:20:00',
      updateTime: '2024-01-15 16:30:00',
      description: '基于有限元方法的岩体裂缝扩展预测模型',
      fileSize: '67.8MB',
    },
    {
      key: '4',
      id: 'MODEL004',
      name: '地下水位变化预测模型',
      type: '时间序列模型',
      version: 'v2.0.1',
      status: 'inactive',
      accuracy: 87.6,
      createTime: '2023-10-20 16:10:00',
      updateTime: '2023-12-25 13:45:00',
      description: '基于LSTM的地下水位变化预测模型',
      fileSize: '45.2MB',
    },
    {
      key: '5',
      id: 'MODEL005',
      name: '多传感器数据融合模型',
      type: '集成学习模型',
      version: 'v1.2.0',
      status: 'error',
      accuracy: 0,
      createTime: '2024-01-12 09:30:00',
      updateTime: '2024-01-14 14:20:00',
      description: '融合多种传感器数据的综合预测模型',
      fileSize: '156.9MB',
    },
  ];

  const statusConfig = {
    active: { color: 'green', text: '运行中' },
    inactive: { color: 'default', text: '未激活' },
    training: { color: 'blue', text: '训练中' },
    error: { color: 'red', text: '错误' },
  };

  const columns: ColumnsType<Model> = [
    {
      title: '模型ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '模型类型',
      dataIndex: 'type',
      key: 'type',
      width: 140,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 100,
      render: (accuracy: number) => {
        if (accuracy === 0) return '-';
        return (
          <div>
            <Progress
              percent={accuracy}
              size="small"
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'active' && (
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              onClick={() => handleRun(record)}
            >
              运行
            </Button>
          )}
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (model: Model) => {
    setSelectedModel(model);
    setDetailVisible(true);
  };

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    form.setFieldsValue(model);
    setEditVisible(true);
  };

  const handleRun = (model: Model) => {
    Modal.confirm({
      title: '运行模型',
      content: `确定要运行模型 ${model.name} 吗？`,
      onOk() {
        console.log('运行模型:', model.id);
      },
    });
  };

  const handleDownload = (model: Model) => {
    console.log('下载模型:', model.id);
  };

  const handleDelete = (model: Model) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模型 ${model.name} 吗？`,
      onOk() {
        console.log('删除模型:', model.id);
      },
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedModel(null);
    setEditVisible(true);
  };

  const handleUpload = () => {
    setUploadVisible(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('保存模型信息:', values);
      setEditVisible(false);
    });
  };

  return (
    <div>
      <div className="page-title">模型管理</div>
      
      {/* 模型统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="模型总数"
              value={12}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中"
              value={8}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="训练中"
              value={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均准确率"
              value={91.2}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="请输入模型名称"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select placeholder="模型类型" style={{ width: '100%' }}>
              <Option value="ml">机器学习模型</Option>
              <Option value="dl">深度学习模型</Option>
              <Option value="numerical">数值模拟模型</Option>
              <Option value="timeseries">时间序列模型</Option>
              <Option value="ensemble">集成学习模型</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="模型状态" style={{ width: '100%' }}>
              <Option value="active">运行中</Option>
              <Option value="inactive">未激活</Option>
              <Option value="training">训练中</Option>
              <Option value="error">错误</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增模型
              </Button>
              <Button icon={<UploadOutlined />} onClick={handleUpload}>
                上传模型
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 模型列表 */}
      <Card className="custom-card">
        <Table
          columns={columns}
          dataSource={mockData}
          loading={loading}
          pagination={{
            total: 50,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          className="custom-table"
        />
      </Card>

      {/* 模型详情弹窗 */}
      <Modal
        title="模型详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedModel && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="模型ID">
                {selectedModel.id}
              </Descriptions.Item>
              <Descriptions.Item label="模型名称">
                {selectedModel.name}
              </Descriptions.Item>
              <Descriptions.Item label="模型类型">
                {selectedModel.type}
              </Descriptions.Item>
              <Descriptions.Item label="版本">
                {selectedModel.version}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusConfig[selectedModel.status].color}>
                  {statusConfig[selectedModel.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="准确率">
                {selectedModel.accuracy > 0 ? `${selectedModel.accuracy}%` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">
                {selectedModel.fileSize}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {selectedModel.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {selectedModel.updateTime}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {selectedModel.description}
              </Descriptions.Item>
            </Descriptions>
            
            {/* 模型性能图表区域 */}
            <Card title="模型性能" size="small">
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                <span style={{ color: '#999' }}>模型性能图表展示区域</span>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑模型弹窗 */}
      <Modal
        title={selectedModel ? '编辑模型' : '新增模型'}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模型名称"
                rules={[{ required: true, message: '请输入模型名称' }]}
              >
                <Input placeholder="请输入模型名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模型类型"
                rules={[{ required: true, message: '请选择模型类型' }]}
              >
                <Select placeholder="请选择模型类型">
                  <Option value="机器学习模型">机器学习模型</Option>
                  <Option value="深度学习模型">深度学习模型</Option>
                  <Option value="数值模拟模型">数值模拟模型</Option>
                  <Option value="时间序列模型">时间序列模型</Option>
                  <Option value="集成学习模型">集成学习模型</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="version"
                label="版本"
                rules={[{ required: true, message: '请输入版本号' }]}
              >
                <Input placeholder="请输入版本号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态">
                  <Option value="active">运行中</Option>
                  <Option value="inactive">未激活</Option>
                  <Option value="training">训练中</Option>
                  <Option value="error">错误</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入模型描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传模型弹窗 */}
      <Modal
        title="上传模型"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadVisible(false)}>
            取消
          </Button>,
          <Button key="upload" type="primary">
            开始上传
          </Button>,
        ]}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          action="/api/upload"
          accept=".pkl,.h5,.pb,.onnx"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .pkl, .h5, .pb, .onnx 等格式的模型文件
          </p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default ModelManagement;
