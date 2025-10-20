import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select, Tag, Space, Progress, message, Tabs } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { salesPlanService, weighbridgeService } from '../../services/productionSalesMockService';
import type { SalesPlan, WeighbridgeRecord } from '../../types/productionSales';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SalesPlanPage: React.FC = () => {
  const [plans, setPlans] = useState<SalesPlan[]>([]);
  const [weighbridge, setWeighbridge] = useState<WeighbridgeRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [executionModalVisible, setExecutionModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SalesPlan | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [executionForm] = Form.useForm();

  useEffect(() => {
    setPlans(salesPlanService.getAll());
    setWeighbridge(weighbridgeService.getAll());
  }, []);

  const statusConfig = {
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'processing', text: '审批中' },
    approved: { color: 'success', text: '已通过' },
    rejected: { color: 'error', text: '已驳回' },
    executing: { color: 'cyan', text: '执行中' },
    completed: { color: 'purple', text: '已完成' }
  };

  const columns = [
    { title: '计划名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '开始日期', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: '截止日期', dataIndex: 'endDate', key: 'endDate', width: 120 },
    { title: '销售煤量(吨)', dataIndex: 'salesVolume', key: 'salesVolume', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '销售渠道', dataIndex: 'channel', key: 'channel', width: 100 },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: SalesPlan['status']) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '进度',
      key: 'progress',
      width: 150,
      render: (_: any, record: SalesPlan) => {
        if (record.status === 'executing' && record.executionRecords && record.executionRecords.length > 0) {
          const latest = record.executionRecords[record.executionRecords.length - 1];
          return <Progress percent={latest.progress} size="small" />;
        }
        return '-';
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: SalesPlan) => (
        <Space size="small">
          {record.status === 'draft' && (
            <Button type="link" size="small" onClick={() => handleSubmitApproval(record.id)}>
              提交审批
            </Button>
          )}
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleApprove(record)}>
              审批
            </Button>
          )}
          {record.status === 'executing' && (
            <Button type="link" size="small" onClick={() => handleExecution(record)}>
              进度反馈
            </Button>
          )}
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
        </Space>
      )
    }
  ];

  const weighbridgeColumns = [
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
    { title: '车牌号', dataIndex: 'plateNumber', key: 'plateNumber', width: 120 },
    { title: '车型', dataIndex: 'vehicleType', key: 'vehicleType', width: 100 },
    { title: '毛重(吨)', dataIndex: 'grossWeight', key: 'grossWeight', width: 100 },
    { title: '皮重(吨)', dataIndex: 'tareWeight', key: 'tareWeight', width: 100 },
    { title: '净重(吨)', dataIndex: 'netWeight', key: 'netWeight', width: 100 },
    {
      title: '异常',
      dataIndex: 'abnormal',
      key: 'abnormal',
      width: 150,
      render: (abnormal: any) => abnormal ? <Tag color="error">{abnormal.message}</Tag> : <Tag color="success">正常</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: WeighbridgeRecord) => (
        <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleViewVideo(record.videoUrl || '')}>
          回看
        </Button>
      )
    }
  ];

  const handleAdd = () => {
    form.resetFields();
    setSelectedPlan(null);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newPlan = salesPlanService.add({
        ...values,
        startDate: values.dates[0].format('YYYY-MM-DD'),
        endDate: values.dates[1].format('YYYY-MM-DD'),
        coalQuality: values.calorificValue ? { calorificValue: values.calorificValue, sulfurContent: values.sulfurContent } : undefined,
        status: 'draft',
        createdBy: '当前用户'
      });
      setPlans(salesPlanService.getAll());
      message.success('销售计划已创建');
      setModalVisible(false);
    });
  };

  const handleSubmitApproval = (id: string) => {
    salesPlanService.update(id, { status: 'pending' });
    setPlans(salesPlanService.getAll());
    message.success('已提交审批');
  };

  const handleApprove = (plan: SalesPlan) => {
    setSelectedPlan(plan);
    approvalForm.resetFields();
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      if (selectedPlan) {
        salesPlanService.approve(selectedPlan.id, {
          approver: '审批人',
          action: values.action,
          opinion: values.opinion
        });
        setPlans(salesPlanService.getAll());
        message.success(values.action === 'approve' ? '审批通过' : '已驳回');
        setApprovalModalVisible(false);
      }
    });
  };

  const handleExecution = (plan: SalesPlan) => {
    setSelectedPlan(plan);
    executionForm.resetFields();
    setExecutionModalVisible(true);
  };

  const handleExecutionSubmit = () => {
    executionForm.validateFields().then(values => {
      if (selectedPlan) {
        const progress = (values.completedVolume / selectedPlan.salesVolume) * 100;
        salesPlanService.addExecutionRecord(selectedPlan.id, {
          ...values,
          date: dayjs().format('YYYY-MM-DD'),
          progress: parseFloat(progress.toFixed(1)),
          reporter: selectedPlan.responsiblePerson
        });
        setPlans(salesPlanService.getAll());
        message.success('进度已反馈');
        setExecutionModalVisible(false);
      }
    });
  };

  const handleViewDetail = (plan: SalesPlan) => {
    Modal.info({
      title: plan.name,
      width: 700,
      content: (
        <div>
          <p><strong>时间范围：</strong>{plan.startDate} 至 {plan.endDate}</p>
          <p><strong>销售煤量：</strong>{plan.salesVolume.toLocaleString()} 吨</p>
          <p><strong>预估金额：</strong>¥{plan.estimatedAmount?.toLocaleString()}</p>
          <p><strong>销售渠道：</strong>{plan.channel}</p>
          <p><strong>责任人：</strong>{plan.responsiblePerson}</p>
          {plan.approvalHistory && plan.approvalHistory.length > 0 && (
            <>
              <p><strong>审批记录：</strong></p>
              <ul>
                {plan.approvalHistory.map(a => (
                  <li key={a.id}>{a.timestamp} - {a.approver}: {a.opinion}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    });
  };

  const handleViewVideo = (url: string) => {
    setSelectedVideo(url);
    setVideoModalVisible(true);
  };

  const statistics = salesPlanService.getStatistics('2024-01-01', '2024-03-31');
  const chartOption = {
    title: { text: '销售计划完成情况', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['计划销量', '实际销量'], bottom: 10 },
    xAxis: { type: 'category', data: statistics.map(s => s.period) },
    yAxis: { type: 'value', name: '销量(吨)' },
    series: [
      { name: '计划销量', type: 'bar', data: statistics.map(s => s.planVolume.toFixed(0)), itemStyle: { color: '#1890ff' } },
      { name: '实际销量', type: 'bar', data: statistics.map(s => s.actualVolume.toFixed(0)), itemStyle: { color: '#52c41a' } }
    ],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        items={[
          {
            key: 'plans',
            label: '销售计划管理',
            children: (
              <Card
                title="销售计划列表"
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建计划</Button>}
              >
                <Table columns={columns} dataSource={plans} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
                <div style={{ marginTop: 24 }}>
                  <ReactECharts option={chartOption} style={{ height: 350 }} />
                </div>
              </Card>
            )
          },
          {
            key: 'weighbridge',
            label: '地磅数据对接',
            children: (
              <Card title="地磅房数据">
                <Table columns={weighbridgeColumns} dataSource={weighbridge} rowKey="id" pagination={{ pageSize: 10 }} />
              </Card>
            )
          }
        ]}
      />

      <Modal title="新建销售计划" open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={700} okText="创建" cancelText="取消">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="计划名称" rules={[{ required: true }]}>
            <Input placeholder="例如：2024年第一季度销售计划" />
          </Form.Item>
          <Form.Item name="dates" label="时间范围" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="salesVolume" label="销售煤量(吨)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="channel" label="销售渠道" rules={[{ required: true }]}>
            <Select>
              <Option value="直销">直销</Option>
              <Option value="分销">分销</Option>
              <Option value="线上">线上</Option>
            </Select>
          </Form.Item>
          <Form.Item name="responsiblePerson" label="责任人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="estimatedAmount" label="预估销售金额(元)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="calorificValue" label="热值要求">
            <InputNumber min={0} addonAfter="大卡/千克" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="审批销售计划" open={approvalModalVisible} onOk={handleApprovalSubmit} onCancel={() => setApprovalModalVisible(false)} okText="提交" cancelText="取消">
        <Form form={approvalForm} layout="vertical">
          <Form.Item name="action" label="审批操作" rules={[{ required: true }]}>
            <Select>
              <Option value="approve"><CheckOutlined /> 通过</Option>
              <Option value="reject"><CloseOutlined /> 驳回</Option>
            </Select>
          </Form.Item>
          <Form.Item name="opinion" label="审批意见" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请填写审批意见" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="进度反馈" open={executionModalVisible} onOk={handleExecutionSubmit} onCancel={() => setExecutionModalVisible(false)} okText="提交" cancelText="取消">
        <Form form={executionForm} layout="vertical">
          <Form.Item name="completedVolume" label="当前完成煤量(吨)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="completedAmount" label="完成金额(元)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="coordination" label="需协调事项">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="监控视频回看" open={videoModalVisible} onCancel={() => setVideoModalVisible(false)} footer={null} width={800}>
        <div style={{ textAlign: 'center', padding: 40, background: '#000' }}>
          <p style={{ color: '#fff' }}>视频播放器 (模拟)</p>
          <p style={{ color: '#999' }}>视频URL: {selectedVideo}</p>
        </div>
      </Modal>
    </div>
  );
};

export default SalesPlanPage;
