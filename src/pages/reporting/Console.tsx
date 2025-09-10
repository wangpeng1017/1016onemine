import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  message,
  Select,
  DatePicker,
  Modal,
  Form,
  Input,
  InputNumber,
} from 'antd';
import {
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ConsoleData {
  id: string;
  taskName: string;
  serverPath: string;
  pushFrequency: string;
  nextPushTime: string;
  remainingDays: string;
  latestPushTime: string;
  latestPushStatus: 'success' | 'failed' | 'uploading';
  taskDescription: string;
}

const Console: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConsoleData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟控制台数据
  const mockData: ConsoleData[] = [
    {
      id: '1',
      taskName: '矿山基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '矿山基础信息包括露天矿山名称、露天矿山编号、露天矿山类型、露天矿山地址、矿区范围、监管主体编号等。',
    },
    {
      id: '2',
      taskName: '边坡基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '边坡基础信息包括露天矿山编号、边坡名称、边坡编号、边坡范围、边坡地质信息、边坡设计参数和现状参数等组成。',
    },
    {
      id: '3',
      taskName: '台阶基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '采场台阶基础信息包括露天矿山编号、边坡名称、采场边坡编号、台阶名称、台阶编号、台阶范围、各台阶设计参数等组成。',
    },
    {
      id: '4',
      taskName: '边坡卫星形变风险信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '边坡卫星形变信息包括边坡编号、地质信息、风险级别、风险范围、风险参数等。',
    },
    {
      id: '5',
      taskName: '越界开采风险',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '超层越界风险包括越界开采风险和超层开采风险。',
    },
    {
      id: '6',
      taskName: '超层开采风险信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '超层越界风险包括越界开采风险和超层开采风险。',
    },
  ];

  const columns: ColumnsType<ConsoleData> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 150,
    },
    {
      title: '前置服务器',
      dataIndex: 'serverPath',
      key: 'serverPath',
      width: 200,
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-line', fontSize: '12px' }}>
          {text}
        </div>
      ),
    },
    {
      title: '推送频率',
      dataIndex: 'pushFrequency',
      key: 'pushFrequency',
      width: 100,
    },
    {
      title: '下次推送时间',
      dataIndex: 'nextPushTime',
      key: 'nextPushTime',
      width: 120,
    },
    {
      title: '距离下次剩余天数',
      dataIndex: 'remainingDays',
      key: 'remainingDays',
      width: 130,
      render: (text: string) => (
        <span style={{ color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: '最新推送时间',
      dataIndex: 'latestPushTime',
      key: 'latestPushTime',
      width: 120,
    },
    {
      title: '最新推送状态',
      dataIndex: 'latestPushStatus',
      key: 'latestPushStatus',
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功' },
          failed: { color: 'red', text: '失败' },
          uploading: { color: 'blue', text: '推送中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '任务简介',
      dataIndex: 'taskDescription',
      key: 'taskDescription',
      width: 300,
      render: (text: string) => (
        <div style={{ 
          maxWidth: '280px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '12px'
        }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            历史查询
          </Button>
        </Space>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
    // 模拟实时更新
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartUpload = () => {
    message.success('开始数据推送');
  };

  const handleStopUpload = () => {
    message.warning('暂停数据推送');
  };

  const handleSettings = () => {
    message.info('推送设置功能开发中...');
  };

  const handleCreateTask = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('新建任务数据:', values);
      message.success('任务创建成功！');
      setCreateModalVisible(false);
      form.resetFields();
      loadData(); // 刷新数据
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    form.resetFields();
  };

  const filteredData = data.filter(item => {
    if (selectedType !== 'all' && item.pushFrequency !== selectedType) {
      return false;
    }
    return true;
  });

  const statistics = {
    total: filteredData.length,
    success: filteredData.filter(item => item.latestPushStatus === 'success').length,
    failed: filteredData.filter(item => item.latestPushStatus === 'failed').length,
    uploading: filteredData.filter(item => item.latestPushStatus === 'uploading').length,
    monthly: filteredData.filter(item => item.pushFrequency === '频率/月').length,
  };

  return (
    <div>
      <div className="page-title">数据上报 - 控制台</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="任务总数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="月度任务"
              value={statistics.monthly}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="推送成功"
              value={statistics.success}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="推送失败"
              value={statistics.failed}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        {/* 控制按钮和筛选 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择推送频率"
              value={selectedType}
              onChange={setSelectedType}
            >
              <Option value="all">全部频率</Option>
              <Option value="频率/月">频率/月</Option>
              <Option value="频率/半年">频率/半年</Option>
              <Option value="频率/年">频率/年</Option>
            </Select>
          </Col>
          <Col span={18}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateTask}
              >
                新建任务
              </Button>
              <Button
                icon={<PlayCircleOutlined />}
                onClick={handleStartUpload}
              >
                开始推送
              </Button>
              <Button
                icon={<PauseCircleOutlined />}
                onClick={handleStopUpload}
              >
                暂停推送
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={handleSettings}
              >
                推送设置
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新数据
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建推送任务"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={handleCreateCancel}
        width={800}
        okText="创建任务"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            frequency: '频率/月',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="taskName"
                  label="任务名称"
                  rules={[{ required: true, message: '请输入任务名称' }]}
                >
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="serverPath"
                  label="前置服务器"
                  rules={[{ required: true, message: '请输入前置服务器地址' }]}
                >
                  <Input placeholder="ftp://172.41.90.16" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="startTime"
                  label="开始时间"
                  rules={[{ required: true, message: '请选择开始时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择开始时间"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="endTime"
                  label="结束时间"
                  rules={[{ required: true, message: '请选择结束时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择结束时间"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="frequency"
                  label="频率"
                  rules={[{ required: true, message: '请选择推送频率' }]}
                >
                  <Select placeholder="选择推送频率">
                    <Option value="频率/月">频率/月</Option>
                    <Option value="频率/半年">频率/半年</Option>
                    <Option value="频率/年">频率/年</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 监测字段配置 */}
          <Card title="监测字段配置" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="deviceCode"
                  label="设备编号"
                  rules={[{ required: true, message: '请输入设备编号' }]}
                >
                  <Input placeholder="请输入设备编号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="alertLevel"
                  label="警报级别"
                  rules={[{ required: true, message: '请选择警报级别' }]}
                >
                  <Select placeholder="选择警报级别">
                    <Option value="正常">正常</Option>
                    <Option value="注意">注意</Option>
                    <Option value="预警">预警</Option>
                    <Option value="危险">危险</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="horizontalDisplacement"
                  label="水平位移 (mm)"
                  rules={[{ required: true, message: '请输入水平位移值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="settlementDisplacement"
                  label="沉降位移 (mm)"
                  rules={[{ required: true, message: '请输入沉降位移值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="horizontalVelocity"
                  label="水平速度 (mm/h)"
                  rules={[{ required: true, message: '请输入水平速度值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm/h"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="settlementVelocity"
                  label="沉降速度 (mm/h)"
                  rules={[{ required: true, message: '请输入沉降速度值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm/h"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="horizontalAcceleration"
                  label="水平加速度 (mm/h²)"
                  rules={[{ required: true, message: '请输入水平加速度值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm/h²"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="settlementAcceleration"
                  label="沉降加速度 (mm/h²)"
                  rules={[{ required: true, message: '请输入沉降加速度值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    precision={2}
                    min={0}
                    addonAfter="mm/h²"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="duration"
                  label="持续时间 (小时)"
                  rules={[{ required: true, message: '请输入持续时间' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    min={0}
                    addonAfter="小时"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="createTime"
                  label="创建时间"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择创建时间"
                    disabled
                    value={dayjs()}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="modifyTime"
                  label="修改时间"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择修改时间"
                    disabled
                    value={dayjs()}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </div>
  );
};

export default Console;
