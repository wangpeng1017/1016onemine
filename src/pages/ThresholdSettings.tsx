import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
  Modal,
  message,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';



interface ThresholdRule {
  key: string;
  id: string;
  deviceType: string;
  parameter: string;
  // 四级阈值：正常、注意、预警、危险
  normalMin?: number;
  normalMax?: number;
  attentionMin?: number;
  attentionMax?: number;
  warningMin?: number;
  warningMax?: number;
  dangerMin?: number;
  dangerMax?: number;
  unit: string;
  status: 'active' | 'inactive';
  updateTime: string;
}

const ThresholdSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('displacement');
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ThresholdRule | null>(null);
  const [form] = Form.useForm();
  const [ruleForm] = Form.useForm();

  // 模拟阈值规则数据
  const mockRules: ThresholdRule[] = [
    {
      key: '1',
      id: 'RULE001',
      deviceType: '雷达传感器',
      parameter: '位移速率',
      normalMin: 0,
      normalMax: 5,
      attentionMin: 5,
      attentionMax: 8,
      warningMin: 8,
      warningMax: 12,
      dangerMin: 12,
      dangerMax: undefined,
      unit: 'mm/h',
      status: 'active',
      updateTime: '2024-01-15 10:30:00',
    },
    {
      key: '2',
      id: 'RULE002',
      deviceType: '土压力传感器',
      parameter: '压力值',
      normalMin: 90,
      normalMax: 110,
      attentionMin: 80,
      attentionMax: 120,
      warningMin: 70,
      warningMax: 130,
      dangerMin: 60,
      dangerMax: 150,
      unit: 'kPa',
      status: 'active',
      updateTime: '2024-01-14 15:20:00',
    },
    {
      key: '3',
      id: 'RULE003',
      deviceType: '裂缝计',
      parameter: '裂缝宽度',
      normalMin: 0,
      normalMax: 1,
      attentionMin: 1,
      attentionMax: 2,
      warningMin: 2,
      warningMax: 4,
      dangerMin: 4,
      dangerMax: undefined,
      unit: 'mm',
      status: 'active',
      updateTime: '2024-01-13 09:45:00',
    },
  ];

  const columns: ColumnsType<ThresholdRule> = [
    {
      title: '规则ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 120,
    },
    {
      title: '监测参数',
      dataIndex: 'parameter',
      key: 'parameter',
      width: 120,
    },
    {
      title: '正常范围',
      key: 'normal',
      width: 120,
      render: (_, record) => {
        const min = record.normalMin !== undefined ? record.normalMin : '-';
        const max = record.normalMax !== undefined ? record.normalMax : '-';
        return (
          <span style={{ color: '#52c41a' }}>
            {min} ~ {max} {record.unit}
          </span>
        );
      },
    },
    {
      title: '注意范围',
      key: 'attention',
      width: 120,
      render: (_, record) => {
        const min = record.attentionMin !== undefined ? record.attentionMin : '-';
        const max = record.attentionMax !== undefined ? record.attentionMax : '-';
        return (
          <span style={{ color: '#1890ff' }}>
            {min} ~ {max} {record.unit}
          </span>
        );
      },
    },
    {
      title: '预警范围',
      key: 'warning',
      width: 120,
      render: (_, record) => {
        const min = record.warningMin !== undefined ? record.warningMin : '-';
        const max = record.warningMax !== undefined ? record.warningMax : '-';
        return (
          <span style={{ color: '#faad14' }}>
            {min} ~ {max} {record.unit}
          </span>
        );
      },
    },
    {
      title: '危险范围',
      key: 'danger',
      width: 120,
      render: (_, record) => {
        const min = record.dangerMin !== undefined ? record.dangerMin : '-';
        const max = record.dangerMax !== undefined ? record.dangerMax : '-';
        return (
          <span style={{ color: '#ff4d4f' }}>
            {min} ~ {max} {record.unit}
          </span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        message.success('阈值设置保存成功！');
        console.log('保存阈值设置:', values);
      }, 1000);
    });
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置为默认值');
  };

  const handleAddRule = () => {
    ruleForm.resetFields();
    setSelectedRule(null);
    setEditVisible(true);
  };

  const handleEditRule = (rule: ThresholdRule) => {
    setSelectedRule(rule);
    ruleForm.setFieldsValue(rule);
    setEditVisible(true);
  };

  const handleDeleteRule = (rule: ThresholdRule) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除规则 ${rule.id} 吗？`,
      onOk() {
        message.success('删除成功');
      },
    });
  };

  const handleSaveRule = () => {
    ruleForm.validateFields().then(values => {
      console.log('保存规则:', values);
      setEditVisible(false);
      message.success('规则保存成功');
    });
  };

  const renderThresholdForm = (type: string) => {
    const getInitialValues = () => {
      switch (type) {
        case 'displacement':
          return {
            normalMin: 0,
            normalMax: 5,
            attentionMin: 5,
            attentionMax: 8,
            warningMin: 8,
            warningMax: 12,
            dangerMin: 12,
            unit: 'mm/h',
          };
        case 'pressure':
          return {
            normalMin: 90,
            normalMax: 110,
            attentionMin: 80,
            attentionMax: 120,
            warningMin: 70,
            warningMax: 130,
            dangerMin: 60,
            dangerMax: 150,
            unit: 'kPa',
          };
        case 'crack':
          return {
            normalMin: 0,
            normalMax: 1,
            attentionMin: 1,
            attentionMax: 2,
            warningMin: 2,
            warningMax: 4,
            dangerMin: 4,
            unit: 'mm',
          };
        case 'water':
          return {
            normalMin: 10,
            normalMax: 12,
            attentionMin: 8,
            attentionMax: 15,
            warningMin: 5,
            warningMax: 18,
            dangerMin: 3,
            dangerMax: 20,
            unit: 'm',
          };
        case 'rainfall':
          return {
            normalMin: 0,
            normalMax: 10,
            attentionMin: 10,
            attentionMax: 20,
            warningMin: 20,
            warningMax: 40,
            dangerMin: 40,
            unit: 'mm/h',
          };
        case 'vibration':
          return {
            normalMin: 0,
            normalMax: 1.0,
            attentionMin: 1.0,
            attentionMax: 2.0,
            warningMin: 2.0,
            warningMax: 4.0,
            dangerMin: 4.0,
            unit: 'mm/s',
          };
        default:
          return {};
      }
    };

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={getInitialValues()}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="正常范围" size="small" style={{ borderColor: '#52c41a' }}>
              <Form.Item
                name="normalMin"
                label="正常下限"
                rules={[{ required: true, message: '请输入正常下限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入正常下限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
              <Form.Item
                name="normalMax"
                label="正常上限"
                rules={[{ required: true, message: '请输入正常上限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入正常上限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="注意范围" size="small" style={{ borderColor: '#1890ff' }}>
              <Form.Item
                name="attentionMin"
                label="注意下限"
                rules={[{ required: true, message: '请输入注意下限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入注意下限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
              <Form.Item
                name="attentionMax"
                label="注意上限"
                rules={[{ required: true, message: '请输入注意上限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入注意上限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="预警范围" size="small" style={{ borderColor: '#faad14' }}>
              <Form.Item
                name="warningMin"
                label="预警下限"
                rules={[{ required: true, message: '请输入预警下限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预警下限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
              <Form.Item
                name="warningMax"
                label="预警上限"
                rules={[{ required: true, message: '请输入预警上限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预警上限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="危险范围" size="small" style={{ borderColor: '#ff4d4f' }}>
              <Form.Item
                name="dangerMin"
                label="危险下限"
                rules={[{ required: true, message: '请输入危险下限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入危险下限"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
              <Form.Item
                name="dangerMax"
                label="危险上限"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入危险上限(可选)"
                  addonAfter={getInitialValues().unit}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={16}>
          <Col span={24}>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleSave}
              >
                保存设置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  const tabItems = [
    { key: 'displacement', label: '表面位移', title: '表面位移阈值设置' },
    { key: 'pressure', label: '土压力', title: '土压力阈值设置' },
    { key: 'crack', label: '裂缝计', title: '裂缝计阈值设置' },
    { key: 'water', label: '地下水位', title: '地下水位阈值设置' },
    { key: 'rainfall', label: '降雨量', title: '降雨量阈值设置' },
    { key: 'vibration', label: '爆破振动', title: '爆破振动阈值设置' },
  ];

  return (
    <div>
      <div className="page-title">阈值设置</div>
      
      <Card className="custom-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: item.label,
            children: (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <h3>{item.title}</h3>
                </div>
                {renderThresholdForm(item.key)}
              </div>
            )
          }))}
        />
      </Card>

      {/* 阈值规则管理 */}
      <Card title="阈值规则管理" style={{ marginTop: 16 }} className="custom-card">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
            新增规则
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={mockRules}
          pagination={false}
          className="custom-table"
        />
      </Card>

      {/* 编辑规则弹窗 */}
      <Modal
        title={selectedRule ? '编辑阈值规则' : '新增阈值规则'}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleSaveRule}
        width={600}
      >
        <Form form={ruleForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceType"
                label="设备类型"
                rules={[{ required: true, message: '请输入设备类型' }]}
              >
                <Input placeholder="请输入设备类型" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parameter"
                label="监测参数"
                rules={[{ required: true, message: '请输入监测参数' }]}
              >
                <Input placeholder="请输入监测参数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="normalMin" label="正常下限">
                <InputNumber style={{ width: '100%' }} placeholder="正常下限" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="normalMax" label="正常上限">
                <InputNumber style={{ width: '100%' }} placeholder="正常上限" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请输入单位' }]}
              >
                <Input placeholder="请输入单位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="attentionMin" label="注意下限">
                <InputNumber style={{ width: '100%' }} placeholder="注意下限" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="attentionMax" label="注意上限">
                <InputNumber style={{ width: '100%' }} placeholder="注意上限" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="warningMin" label="预警下限">
                <InputNumber style={{ width: '100%' }} placeholder="预警下限" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warningMax" label="预警上限">
                <InputNumber style={{ width: '100%' }} placeholder="预警上限" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dangerMin" label="危险下限">
                <InputNumber style={{ width: '100%' }} placeholder="危险下限" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dangerMax" label="危险上限">
                <InputNumber style={{ width: '100%' }} placeholder="危险上限" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ThresholdSettings;
