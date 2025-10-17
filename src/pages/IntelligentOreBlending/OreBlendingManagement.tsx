import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, DatePicker, Form, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OreBlendingRecord {
  key: string;
  id: string;
  planName: string;
  blendingRatio: string;
  targetGrade: number;
  actualGrade: number;
  quantity: number;
  status: string;
  createTime: string;
  creator: string;
}

const OreBlendingManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: OreBlendingRecord[] = [
    {
      key: '1',
      id: 'OB20250117001',
      planName: '一号矿区配矿方案A',
      blendingRatio: '铁矿石:铜矿石=3:1',
      targetGrade: 35.5,
      actualGrade: 35.2,
      quantity: 5000,
      status: '已完成',
      createTime: '2025-01-17 10:00:00',
      creator: '张三',
    },
    {
      key: '2',
      id: 'OB20250117002',
      planName: '二号矿区配矿方案B',
      blendingRatio: '铁矿石:锰矿石=2:1',
      targetGrade: 42.0,
      actualGrade: 41.8,
      quantity: 3000,
      status: '进行中',
      createTime: '2025-01-17 11:30:00',
      creator: '李四',
    },
  ];

  const [dataSource, setDataSource] = useState<OreBlendingRecord[]>(mockData);

  const columns: ColumnsType<OreBlendingRecord> = [
    {
      title: '方案编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '方案名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
    },
    {
      title: '配比方案',
      dataIndex: 'blendingRatio',
      key: 'blendingRatio',
      width: 200,
    },
    {
      title: '目标品位(%)',
      dataIndex: 'targetGrade',
      key: 'targetGrade',
      width: 120,
    },
    {
      title: '实际品位(%)',
      dataIndex: 'actualGrade',
      key: 'actualGrade',
      width: 120,
    },
    {
      title: '配矿量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
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
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
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
          智能配矿管理
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8c8c8c' }}>
          矿石配比方案管理、品位优化与配矿效果分析
        </p>
      </div>

      {/* 查询区域 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 0 }}>
        <Form form={form} layout="inline">
          <Form.Item name="planName" label="方案名称">
            <Input placeholder="请输入方案名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
              <Option value="draft">待执行</Option>
              <Option value="running">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="创建时间">
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

      {/* 操作按钮和数据表格 */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增配矿方案
            </Button>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1400 }}
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
        title="新增配矿方案"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="planName" label="方案名称" rules={[{ required: true, message: '请输入方案名称' }]}>
            <Input placeholder="请输入方案名称" />
          </Form.Item>
          <Form.Item name="blendingRatio" label="配比方案" rules={[{ required: true, message: '请输入配比方案' }]}>
            <Input placeholder="例如: 铁矿石:铜矿石=3:1" />
          </Form.Item>
          <Form.Item name="targetGrade" label="目标品位(%)" rules={[{ required: true, message: '请输入目标品位' }]}>
            <Input type="number" placeholder="请输入目标品位" />
          </Form.Item>
          <Form.Item name="quantity" label="配矿量(吨)" rules={[{ required: true, message: '请输入配矿量' }]}>
            <Input type="number" placeholder="请输入配矿量" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OreBlendingManagement;
