import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, DatePicker, Form, Modal, message, Row, Col, Statistic } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BlendingPlanRecord {
  key: string;
  planCode: string;
  planName: string;
  oreType: string;
  targetGrade: number;
  planQuantity: number;
  actualQuantity: number;
  startDate: string;
  endDate: string;
  status: string;
  creator: string;
}

const BlendingPlan: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟统计数据
  const statistics = {
    totalPlans: 156,
    activePlans: 23,
    completedPlans: 128,
    totalQuantity: 125000,
  };

  // 模拟数据
  const mockData: BlendingPlanRecord[] = [
    {
      key: '1',
      planCode: 'BP20250117001',
      planName: '1月上旬铁矿配矿计划',
      oreType: '铁矿石',
      targetGrade: 35.5,
      planQuantity: 8000,
      actualQuantity: 7850,
      startDate: '2025-01-10',
      endDate: '2025-01-20',
      status: '进行中',
      creator: '张三',
    },
    {
      key: '2',
      planCode: 'BP20250117002',
      planName: '1月铜矿配矿优化计划',
      oreType: '铜矿石',
      targetGrade: 2.8,
      planQuantity: 5000,
      actualQuantity: 5000,
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      status: '已完成',
      creator: '李四',
    },
    {
      key: '3',
      planCode: 'BP20250117003',
      planName: '1月锰矿配矿计划A',
      oreType: '锰矿石',
      targetGrade: 45.0,
      planQuantity: 3000,
      actualQuantity: 0,
      startDate: '2025-01-20',
      endDate: '2025-01-31',
      status: '待执行',
      creator: '王五',
    },
  ];

  const [dataSource, setDataSource] = useState<BlendingPlanRecord[]>(mockData);

  const columns: ColumnsType<BlendingPlanRecord> = [
    {
      title: '计划编号',
      dataIndex: 'planCode',
      key: 'planCode',
      width: 140,
      fixed: 'left',
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
    },
    {
      title: '矿石类型',
      dataIndex: 'oreType',
      key: 'oreType',
      width: 120,
    },
    {
      title: '目标品位(%)',
      dataIndex: 'targetGrade',
      key: 'targetGrade',
      width: 120,
    },
    {
      title: '计划量(吨)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '实际量(吨)',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '完成率',
      key: 'completion',
      width: 100,
      render: (_, record) => {
        const rate = record.planQuantity > 0 ? (record.actualQuantity / record.planQuantity * 100).toFixed(1) : '0.0';
        return `${rate}%`;
      },
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{
          color: status === '已完成' ? '#52c41a' : status === '进行中' ? '#1890ff' : '#faad14',
          fontWeight: 500
        }}>
          {status}
        </span>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<CheckCircleOutlined />}>执行</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('查询成功');
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置查询条件');
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('保存成功');
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#262626' }}>
          配矿计划管理
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8c8c8c' }}>
          配矿生产计划的制定、执行与跟踪管理
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="计划总数"
              value={statistics.totalPlans}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中"
              value={statistics.activePlans}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completedPlans}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计配矿量"
              value={statistics.totalQuantity}
              suffix="吨"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询区域 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 0 }}>
        <Form form={form} layout="inline">
          <Form.Item name="planName" label="计划名称">
            <Input placeholder="请输入计划名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="oreType" label="矿石类型">
            <Select placeholder="请选择矿石类型" style={{ width: 150 }} allowClear>
              <Option value="iron">铁矿石</Option>
              <Option value="copper">铜矿石</Option>
              <Option value="manganese">锰矿石</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
              <Option value="pending">待执行</Option>
              <Option value="running">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="计划日期">
            <RangePicker style={{ width: 260 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增配矿计划
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title="新增配矿计划"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="planName" label="计划名称" rules={[{ required: true, message: '请输入计划名称' }]}>
                <Input placeholder="请输入计划名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oreType" label="矿石类型" rules={[{ required: true, message: '请选择矿石类型' }]}>
                <Select placeholder="请选择矿石类型">
                  <Option value="iron">铁矿石</Option>
                  <Option value="copper">铜矿石</Option>
                  <Option value="manganese">锰矿石</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="targetGrade" label="目标品位(%)" rules={[{ required: true, message: '请输入目标品位' }]}>
                <Input type="number" placeholder="请输入目标品位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="planQuantity" label="计划量(吨)" rules={[{ required: true, message: '请输入计划量' }]}>
                <Input type="number" placeholder="请输入计划量" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="开始日期" rules={[{ required: true, message: '请选择开始日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="结束日期" rules={[{ required: true, message: '请选择结束日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlendingPlan;
