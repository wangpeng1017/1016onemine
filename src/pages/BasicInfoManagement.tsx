import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Tabs,
  message,
  Popconfirm,
  Tooltip,
  Upload,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface SlopeInfo {
  id: string;
  name: string;
  type: 'natural' | 'artificial';
  height: number;
  angle: number;
  length: number;
  area: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: string;
  description?: string;
  createTime: string;
  updateTime: string;
  status: 'active' | 'inactive';
}

interface StepInfo {
  id: string;
  slopeId: string;
  stepNumber: number;
  height: number;
  width: number;
  angle: number;
  material: string;
  stability: 'stable' | 'unstable' | 'monitoring';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  createTime: string;
  updateTime: string;
}

const BasicInfoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('slopes');
  const [slopes, setSlopes] = useState<SlopeInfo[]>([]);
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<SlopeInfo | StepInfo | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    const mockSlopes: SlopeInfo[] = [
      {
        id: 'SLOPE001',
        name: '北区主边坡',
        type: 'artificial',
        height: 120,
        angle: 45,
        length: 800,
        area: 96000,
        riskLevel: 'medium',
        location: '北区采场',
        coordinates: '116.123456, 39.654321',
        description: '主要开采边坡，需重点监测',
        createTime: '2024-01-10 09:00:00',
        updateTime: '2024-01-15 14:30:00',
        status: 'active'
      },
      {
        id: 'SLOPE002',
        name: '东区边坡A',
        type: 'natural',
        height: 85,
        angle: 38,
        length: 600,
        area: 51000,
        riskLevel: 'low',
        location: '东区边界',
        coordinates: '116.234567, 39.765432',
        description: '天然边坡，稳定性良好',
        createTime: '2024-01-08 10:15:00',
        updateTime: '2024-01-12 16:20:00',
        status: 'active'
      }
    ];

    const mockSteps: StepInfo[] = [
      {
        id: 'STEP001',
        slopeId: 'SLOPE001',
        stepNumber: 1,
        height: 15,
        width: 20,
        angle: 45,
        material: '花岗岩',
        stability: 'stable',
        riskLevel: 'low',
        description: '第一台阶，岩体完整',
        createTime: '2024-01-10 09:30:00',
        updateTime: '2024-01-15 14:45:00'
      },
      {
        id: 'STEP002',
        slopeId: 'SLOPE001',
        stepNumber: 2,
        height: 15,
        width: 18,
        angle: 50,
        material: '花岗岩',
        stability: 'monitoring',
        riskLevel: 'medium',
        description: '第二台阶，发现裂隙',
        createTime: '2024-01-10 09:45:00',
        updateTime: '2024-01-15 15:00:00'
      }
    ];

    setSlopes(mockSlopes);
    setSteps(mockSteps);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'critical': return 'purple';
      default: return 'default';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
      case 'critical': return '极高风险';
      default: return '未知';
    }
  };

  const slopeColumns: ColumnsType<SlopeInfo> = [
    {
      title: '边坡名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'natural' ? 'blue' : 'green'}>
          {type === 'natural' ? '天然边坡' : '人工边坡'}
        </Tag>
      ),
    },
    {
      title: '高度(m)',
      dataIndex: 'height',
      key: 'height',
      width: 100,
    },
    {
      title: '坡角(°)',
      dataIndex: 'angle',
      key: 'angle',
      width: 100,
    },
    {
      title: '长度(m)',
      dataIndex: 'length',
      key: 'length',
      width: 100,
    },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (area) => area.toLocaleString(),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level) => (
        <Tag color={getRiskLevelColor(level)}>
          {getRiskLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewSlope(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditSlope(record)}
            />
          </Tooltip>
          <Tooltip title="GIS定位">
            <Button
              type="text"
              size="small"
              icon={<EnvironmentOutlined />}
              onClick={() => handleLocateOnMap(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除这个边坡吗？"
            onConfirm={() => handleDeleteSlope(record.id)}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stepColumns: ColumnsType<StepInfo> = [
    {
      title: '台阶编号',
      dataIndex: 'stepNumber',
      key: 'stepNumber',
      width: 100,
      render: (num) => `第${num}台阶`,
    },
    {
      title: '所属边坡',
      dataIndex: 'slopeId',
      key: 'slopeId',
      width: 120,
      render: (slopeId) => {
        const slope = slopes.find(s => s.id === slopeId);
        return slope ? slope.name : slopeId;
      },
    },
    {
      title: '高度(m)',
      dataIndex: 'height',
      key: 'height',
      width: 100,
    },
    {
      title: '宽度(m)',
      dataIndex: 'width',
      key: 'width',
      width: 100,
    },
    {
      title: '坡角(°)',
      dataIndex: 'angle',
      key: 'angle',
      width: 100,
    },
    {
      title: '岩体材料',
      dataIndex: 'material',
      key: 'material',
      width: 120,
    },
    {
      title: '稳定性',
      dataIndex: 'stability',
      key: 'stability',
      width: 100,
      render: (stability) => {
        const config = {
          stable: { color: 'green', text: '稳定' },
          unstable: { color: 'red', text: '不稳定' },
          monitoring: { color: 'orange', text: '监测中' }
        };
        const { color, text } = config[stability as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level) => (
        <Tag color={getRiskLevelColor(level)}>
          {getRiskLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStep(record)}
          />
          <Popconfirm
            title="确定删除这个台阶吗？"
            onConfirm={() => handleDeleteStep(record.id)}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddSlope = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditSlope = (slope: SlopeInfo) => {
    setEditingItem(slope);
    form.setFieldsValue(slope);
    setModalVisible(true);
  };

  const handleViewSlope = (slope: SlopeInfo) => {
    Modal.info({
      title: `边坡详情 - ${slope.name}`,
      width: 600,
      content: (
        <div>
          <p><strong>类型：</strong>{slope.type === 'natural' ? '天然边坡' : '人工边坡'}</p>
          <p><strong>尺寸：</strong>高度 {slope.height}m，长度 {slope.length}m，坡角 {slope.angle}°</p>
          <p><strong>面积：</strong>{slope.area.toLocaleString()} m²</p>
          <p><strong>位置：</strong>{slope.location}</p>
          <p><strong>坐标：</strong>{slope.coordinates}</p>
          <p><strong>风险等级：</strong>{getRiskLevelText(slope.riskLevel)}</p>
          <p><strong>描述：</strong>{slope.description || '无'}</p>
          <p><strong>创建时间：</strong>{slope.createTime}</p>
          <p><strong>更新时间：</strong>{slope.updateTime}</p>
        </div>
      ),
    });
  };

  const handleLocateOnMap = (slope: SlopeInfo) => {
    message.info(`正在GIS地图上定位边坡：${slope.name}`);
    // 这里可以集成GIS地图定位功能
  };

  const handleDeleteSlope = (id: string) => {
    setSlopes(slopes.filter(s => s.id !== id));
    message.success('边坡删除成功');
  };

  const handleAddStep = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditStep = (step: StepInfo) => {
    setEditingItem(step);
    form.setFieldsValue(step);
    setModalVisible(true);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
    message.success('台阶删除成功');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (activeTab === 'slopes') {
        if (editingItem) {
          // 编辑边坡
          setSlopes(slopes.map(s => s.id === editingItem.id ? { ...s, ...values } : s));
          message.success('边坡更新成功');
        } else {
          // 新增边坡
          const newSlope: SlopeInfo = {
            ...values,
            id: `SLOPE${Date.now()}`,
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
          };
          setSlopes([...slopes, newSlope]);
          message.success('边坡创建成功');
        }
      } else {
        if (editingItem) {
          // 编辑台阶
          setSteps(steps.map(s => s.id === editingItem.id ? { ...s, ...values } : s));
          message.success('台阶更新成功');
        } else {
          // 新增台阶
          const newStep: StepInfo = {
            ...values,
            id: `STEP${Date.now()}`,
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
          };
          setSteps([...steps, newStep]);
          message.success('台阶创建成功');
        }
      }
      setModalVisible(false);
    });
  };

  const renderSlopeForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="边坡名称"
            rules={[{ required: true, message: '请输入边坡名称' }]}
          >
            <Input placeholder="请输入边坡名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="边坡类型"
            rules={[{ required: true, message: '请选择边坡类型' }]}
          >
            <Select placeholder="请选择边坡类型">
              <Option value="natural">天然边坡</Option>
              <Option value="artificial">人工边坡</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="height"
            label="高度(m)"
            rules={[{ required: true, message: '请输入高度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入高度" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="angle"
            label="坡角(°)"
            rules={[{ required: true, message: '请输入坡角' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入坡角" min={0} max={90} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="length"
            label="长度(m)"
            rules={[{ required: true, message: '请输入长度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入长度" min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="area"
            label="面积(m²)"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入面积" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="riskLevel"
            label="风险等级"
            rules={[{ required: true, message: '请选择风险等级' }]}
          >
            <Select placeholder="请选择风险等级">
              <Option value="low">低风险</Option>
              <Option value="medium">中风险</Option>
              <Option value="high">高风险</Option>
              <Option value="critical">极高风险</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input placeholder="请输入位置" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="coordinates"
            label="坐标"
            rules={[{ required: true, message: '请输入坐标' }]}
          >
            <Input placeholder="经度,纬度" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="description" label="描述">
        <TextArea rows={3} placeholder="请输入描述信息" />
      </Form.Item>
    </Form>
  );

  const renderStepForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="slopeId"
            label="所属边坡"
            rules={[{ required: true, message: '请选择所属边坡' }]}
          >
            <Select placeholder="请选择所属边坡">
              {slopes.map(slope => (
                <Option key={slope.id} value={slope.id}>{slope.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="stepNumber"
            label="台阶编号"
            rules={[{ required: true, message: '请输入台阶编号' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入台阶编号" min={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="height"
            label="高度(m)"
            rules={[{ required: true, message: '请输入高度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入高度" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="width"
            label="宽度(m)"
            rules={[{ required: true, message: '请输入宽度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入宽度" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="angle"
            label="坡角(°)"
            rules={[{ required: true, message: '请输入坡角' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入坡角" min={0} max={90} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="material"
            label="岩体材料"
            rules={[{ required: true, message: '请输入岩体材料' }]}
          >
            <Input placeholder="请输入岩体材料" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="stability"
            label="稳定性"
            rules={[{ required: true, message: '请选择稳定性' }]}
          >
            <Select placeholder="请选择稳定性">
              <Option value="stable">稳定</Option>
              <Option value="unstable">不稳定</Option>
              <Option value="monitoring">监测中</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="riskLevel"
            label="风险等级"
            rules={[{ required: true, message: '请选择风险等级' }]}
          >
            <Select placeholder="请选择风险等级">
              <Option value="low">低风险</Option>
              <Option value="medium">中风险</Option>
              <Option value="high">高风险</Option>
              <Option value="critical">极高风险</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="description" label="描述">
        <TextArea rows={3} placeholder="请输入描述信息" />
      </Form.Item>
    </Form>
  );

  const tabItems = [
    {
      key: 'slopes',
      label: '边坡信息',
      children: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSlope}>
                新增边坡
              </Button>
              <Button icon={<UploadOutlined />}>
                批量导入
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Space>
          </div>
          <Table
            columns={slopeColumns}
            dataSource={slopes}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个边坡`,
            }}
          />
        </Card>
      ),
    },
    {
      key: 'steps',
      label: '台阶信息',
      children: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStep}>
                新增台阶
              </Button>
              <Button icon={<UploadOutlined />}>
                批量导入
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Space>
          </div>
          <Table
            columns={stepColumns}
            dataSource={steps}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个台阶`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div className="page-title">基础信息管理</div>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <Modal
        title={`${editingItem ? '编辑' : '新增'}${activeTab === 'slopes' ? '边坡' : '台阶'}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        width={800}
        destroyOnClose
      >
        {activeTab === 'slopes' ? renderSlopeForm() : renderStepForm()}
      </Modal>
    </div>
  );
};

export default BasicInfoManagement;
