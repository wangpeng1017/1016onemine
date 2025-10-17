import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Select, DatePicker, Row, Col, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 150,
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      width: 120,
    },
    {
      title: '矿石类型',
      dataIndex: 'oreType',
      key: 'oreType',
      width: 100,
    },
    {
      title: '计划量(吨)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '目标品位(%)',
      dataIndex: 'targetGrade',
      key: 'targetGrade',
      width: 120,
    },
    {
      title: '配矿方案',
      dataIndex: 'blendingScheme',
      key: 'blendingScheme',
      width: 300,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        if (status === '执行中') color = 'processing';
        else if (status === '已完成') color = 'success';
        else if (status === '待执行') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
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
      width: 180,
      fixed: 'right',
      render: () => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
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

  return (
    <div style={{ padding: 24 }}>
      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="planName" label="计划名称">
                <Input placeholder="请输入" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="oreType" label="矿石类型">
                <Select placeholder="请选择" style={{ width: 150 }} allowClear>
                  <Option value="iron">铁矿石</Option>
                  <Option value="copper">铜矿石</Option>
                  <Option value="manganese">锰矿石</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" style={{ width: 150 }} allowClear>
                  <Option value="pending">待执行</Option>
                  <Option value="executing">执行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" label="计划日期">
                <RangePicker style={{ width: 260 }} />
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
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>
            新增计划
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
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default BlendingPlanContent;
