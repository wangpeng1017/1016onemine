import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Select, DatePicker, Row, Col, Tag, Typography, Statistic, Progress } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface PlanRecord {
  key: string;
  planId: string;
  planName: string;
  planDate: string;
  oreType: string;
  planQuantity: number;
  targetGrade: number;
  blendingScheme: string;
  status: string;
  createTime: string;
  creator: string;
}

const BlendingPlanContent: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockData: PlanRecord[] = [
    {
      key: '1',
      planId: 'PLAN-2025-001',
      planName: '1月上旬配矿计划',
      planDate: '2025-01-10',
      oreType: '铁矿石',
      planQuantity: 50000,
      targetGrade: 35.5,
      blendingScheme: '一号矿区(40%) + 二号矿区(35%) + 外购(25%)',
      status: '执行中',
      createTime: '2025-01-08 09:00:00',
      creator: '张三',
    },
    {
      key: '2',
      planId: 'PLAN-2025-002',
      planName: '1月中旬配矿计划',
      planDate: '2025-01-15',
      oreType: '铁矿石',
      planQuantity: 48000,
      targetGrade: 36.0,
      blendingScheme: '一号矿区(45%) + 三号矿区(30%) + 外购(25%)',
      status: '待执行',
      createTime: '2025-01-10 14:30:00',
      creator: '李四',
    },
    {
      key: '3',
      planId: 'PLAN-2025-003',
      planName: '12月下旬配矿计划',
      planDate: '2024-12-25',
      oreType: '铁矿石',
      planQuantity: 52000,
      targetGrade: 34.8,
      blendingScheme: '一号矿区(50%) + 二号矿区(50%)',
      status: '已完成',
      createTime: '2024-12-20 10:15:00',
      creator: '王五',
    },
  ];

  const [dataSource] = useState<PlanRecord[]>(mockData);

  const columns: ColumnsType<PlanRecord> = [
    {
      title: '计划编号',
      dataIndex: 'planId',
      key: 'planId',
      width: 140,
      fixed: 'left',
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ fontWeight: 500 }}>
          {text}
        </Text>
      ),
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      width: 120,
      render: (text: string) => (
        <Text>
          <CalendarOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
          {text}
        </Text>
      ),
    },
    {
      title: '矿石类型',
      dataIndex: 'oreType',
      key: 'oreType',
      width: 100,
      render: (text: string) => (
        <Tag color="blue" style={{ borderRadius: 12 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '计划量(吨)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
      width: 130,
      align: 'right',
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          {value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '目标品位(%)',
      dataIndex: 'targetGrade',
      key: 'targetGrade',
      width: 120,
      align: 'right',
      render: (value: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          {value}%
        </Text>
      ),
    },
    {
      title: '配矿方案',
      dataIndex: 'blendingScheme',
      key: 'blendingScheme',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ color: '#595959' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => {
        let config: { color: string; icon: React.ReactNode } = { color: 'default', icon: null };
        if (status === '执行中') {
          config = { color: 'processing', icon: <ClockCircleOutlined /> };
        } else if (status === '已完成') {
          config = { color: 'success', icon: <CheckCircleOutlined /> };
        } else if (status === '待执行') {
          config = { color: 'warning', icon: <ExclamationCircleOutlined /> };
        }
        return (
          <Tag 
            color={config.color} 
            icon={config.icon}
            style={{ borderRadius: 12, fontWeight: 500 }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text: string) => (
        <Text style={{ color: '#8c8c8c' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: (text: string) => (
        <Text style={{ color: '#262626', fontWeight: 500 }}>
          {text}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: () => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            style={{ color: '#1890ff' }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            style={{ color: '#52c41a' }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
  };

  // 计算统计数据
  const totalPlans = dataSource.length;
  const executingPlans = dataSource.filter(item => item.status === '执行中').length;
  const completedPlans = dataSource.filter(item => item.status === '已完成').length;
  const pendingPlans = dataSource.filter(item => item.status === '待执行').length;
  const totalQuantity = dataSource.reduce((sum, item) => sum + item.planQuantity, 0);
  const avgGrade = dataSource.reduce((sum, item) => sum + item.targetGrade, 0) / totalPlans;

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#262626' }}>
          <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          配矿计划管理
        </Title>
        <Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
          管理和监控矿山配矿计划的执行情况
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered={false} style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>总计划数</span>}
              value={totalPlans}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>个</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered={false} style={{ background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>执行中</span>}
              value={executingPlans}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>个</span>}
              prefix={<ClockCircleOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered={false} style={{ background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>待执行</span>}
              value={pendingPlans}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>个</span>}
              prefix={<ExclamationCircleOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered={false} style={{ background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已完成</span>}
              value={completedPlans}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>个</span>}
              prefix={<CheckCircleOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="总配矿量统计" 
            size="small"
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Row align="middle">
              <Col flex="auto">
                <Statistic
                  value={totalQuantity.toLocaleString()}
                  suffix="吨"
                  valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 'bold' }}
                />
              </Col>
              <Col>
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #1890ff20, #1890ff10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 20, color: '#1890ff' }}>⚖️</span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="平均目标品位" 
            size="small"
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Row align="middle">
              <Col flex="auto">
                <Statistic
                  value={avgGrade.toFixed(2)}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress 
                  percent={(avgGrade / 40) * 100} 
                  size="small" 
                  strokeColor="#52c41a"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col>
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #52c41a20, #52c41a10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 20, color: '#52c41a' }}>🎯</span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 查询表单 */}
      <Card 
        title="查询条件" 
        style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        size="small"
      >
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="planName" label="计划名称">
                <Input placeholder="请输入计划名称" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="oreType" label="矿石类型">
                <Select placeholder="请选择矿石类型" style={{ width: 150 }} allowClear>
                  <Option value="iron">铁矿石</Option>
                  <Option value="copper">铜矿石</Option>
                  <Option value="manganese">锰矿石</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="计划状态">
                <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
                  <Option value="pending">待执行</Option>
                  <Option value="executing">执行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" label="计划日期">
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 260 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card 
        title="配矿计划列表" 
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        extra={<Text type="secondary">共 {totalPlans} 条记录</Text>}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} size="middle">
              新增计划
            </Button>
            <Button icon={<EditOutlined />} size="middle">
              批量编辑
            </Button>
            <Button icon={<DeleteOutlined />} size="middle" danger>
              批量删除
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1600 }}
          size="middle"
          className="custom-table"
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log('选中的行:', selectedRowKeys, selectedRows);
            },
          }}
          pagination={{
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>
    </div>
  );
};

export default BlendingPlanContent;
