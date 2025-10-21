import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select, Tag, Space, Progress, message, Tabs, Row, Col, Statistic } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, PlayCircleOutlined, SearchOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { salesPlanService, weighbridgeService } from '../../services/productionSalesMockService';
import type { SalesPlan, WeighbridgeRecord } from '../../types/productionSales';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SalesPlanPageEnhanced: React.FC = () => {
  const [plans, setPlans] = useState<SalesPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SalesPlan[]>([]);
  const [weighbridge, setWeighbridge] = useState<WeighbridgeRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [executionModalVisible, setExecutionModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SalesPlan | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [queryFilters, setQueryFilters] = useState<{ responsible: string; channel: string; dateRange: any }>({ 
    responsible: '', 
    channel: '', 
    dateRange: null 
  });
  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [executionForm] = Form.useForm();
  const [summaryForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [plans, queryFilters]);

  const loadData = () => {
    setPlans(salesPlanService.getAll());
    setWeighbridge(weighbridgeService.getAll());
  };

  const applyFilters = () => {
    let filtered = [...plans];
    
    if (queryFilters.responsible) {
      filtered = filtered.filter(p => p.responsiblePerson.includes(queryFilters.responsible));
    }
    
    if (queryFilters.channel) {
      filtered = filtered.filter(p => p.channel === queryFilters.channel);
    }
    
    if (queryFilters.dateRange && queryFilters.dateRange.length === 2) {
      const [start, end] = queryFilters.dateRange;
      filtered = filtered.filter(p => 
        dayjs(p.startDate).isAfter(start) && dayjs(p.endDate).isBefore(end)
      );
    }
    
    setFilteredPlans(filtered);
  };

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
        if (record.summary) {
          return <Tag color="success">已完成 {record.summary.completionRate}%</Tag>;
        }
        return '-';
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
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
          {record.status === 'executing' && !record.summary && (
            <>
              <Button type="link" size="small" onClick={() => handleExecution(record)}>
                进度反馈
              </Button>
              <Button type="link" size="small" onClick={() => handleSummary(record)}>
                总结
              </Button>
            </>
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
      salesPlanService.add({
        ...values,
        startDate: values.dates[0].format('YYYY-MM-DD'),
        endDate: values.dates[1].format('YYYY-MM-DD'),
        coalQuality: values.calorificValue ? { calorificValue: values.calorificValue, sulfurContent: values.sulfurContent } : undefined,
        status: 'draft',
        createdBy: '当前用户'
      });
      loadData();
      message.success('销售计划已创建');
      setModalVisible(false);
    });
  };

  const handleSubmitApproval = (id: string) => {
    salesPlanService.update(id, { status: 'pending' });
    loadData();
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
        loadData();
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
        loadData();
        message.success('进度已反馈');
        setExecutionModalVisible(false);
      }
    });
  };

  const handleSummary = (plan: SalesPlan) => {
    setSelectedPlan(plan);
    summaryForm.resetFields();
    setSummaryModalVisible(true);
  };

  const handleSummarySubmit = () => {
    summaryForm.validateFields().then(values => {
      if (selectedPlan) {
        const completionRate = (values.finalVolume / selectedPlan.salesVolume) * 100;
        salesPlanService.update(selectedPlan.id, {
          status: 'completed',
          summary: {
            ...values,
            completionRate: parseFloat(completionRate.toFixed(1)),
            completedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        });
        loadData();
        message.success('计划总结已提交');
        setSummaryModalVisible(false);
      }
    });
  };

  const handleViewDetail = (plan: SalesPlan) => {
    Modal.info({
      title: plan.name,
      width: 800,
      content: (
        <div>
          <p><strong>时间范围：</strong>{plan.startDate} 至 {plan.endDate}</p>
          <p><strong>销售煤量：</strong>{plan.salesVolume.toLocaleString()} 吨</p>
          <p><strong>预估金额：</strong>¥{plan.estimatedAmount?.toLocaleString()}</p>
          <p><strong>销售渠道：</strong>{plan.channel}</p>
          <p><strong>责任人：</strong>{plan.responsiblePerson}</p>
          {plan.coalQuality && (
            <p><strong>煤质要求：</strong>热值{plan.coalQuality.calorificValue}kcal/kg, 硫分{plan.coalQuality.sulfurContent}%</p>
          )}
          {plan.approvalHistory && plan.approvalHistory.length > 0 && (
            <>
              <p><strong>审批记录：</strong></p>
              <ul>
                {plan.approvalHistory.map(a => (
                  <li key={a.id}>{a.timestamp} - {a.approver}：{a.action === 'approve' ? '通过' : '驳回'} - {a.opinion}</li>
                ))}
              </ul>
            </>
          )}
          {plan.executionRecords && plan.executionRecords.length > 0 && (
            <>
              <p><strong>执行记录：</strong></p>
              <ul>
                {plan.executionRecords.map(e => (
                  <li key={e.id}>{e.date} - 完成{e.completedVolume}吨 (进度{e.progress}%)</li>
                ))}
              </ul>
            </>
          )}
          {plan.summary && (
            <>
              <p><strong>计划总结：</strong></p>
              <p>最终完成：{plan.summary.finalVolume}吨, 完成率：{plan.summary.completionRate}%</p>
              <p>问题分析：{plan.summary.problemAnalysis}</p>
              <p>改进措施：{plan.summary.improvements}</p>
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

  const handleResetFilters = () => {
    setQueryFilters({ responsible: '', channel: '', dateRange: null });
  };

  // 统计数据
  const statistics = salesPlanService.getStatistics(
    dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  );

  const completionRateChart = {
    title: { text: '计划完成率统计', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: statistics.map(s => s.period) },
    yAxis: { type: 'value', name: '完成率(%)' },
    series: [{
      type: 'bar',
      data: statistics.map(s => s.completionRate.toFixed(1)),
      itemStyle: { color: '#1890ff' },
      label: { show: true, position: 'top', formatter: '{c}%' }
    }],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  const salesTrendChart = {
    title: { text: '销售额趋势分析', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis', formatter: (params: any) => `${params[0].name}<br/>销售额: ¥${parseFloat(params[0].value).toLocaleString()}` },
    xAxis: { type: 'category', data: statistics.map(s => s.period) },
    yAxis: { type: 'value', name: '销售额(万元)' },
    series: [{
      type: 'line',
      data: statistics.map(s => (s.revenue / 10000).toFixed(1)),
      smooth: true,
      itemStyle: { color: '#52c41a' },
      areaStyle: { opacity: 0.3 }
    }],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        defaultActiveKey="list"
        items={[
          {
            key: 'list',
            label: '计划列表',
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Space wrap>
                    <Input 
                      placeholder="责任人" 
                      value={queryFilters.responsible}
                      onChange={(e) => setQueryFilters({ ...queryFilters, responsible: e.target.value })}
                      style={{ width: 150 }}
                    />
                    <Select 
                      placeholder="销售渠道" 
                      value={queryFilters.channel || undefined}
                      onChange={(v) => setQueryFilters({ ...queryFilters, channel: v || '' })}
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Option value="直销">直销</Option>
                      <Option value="分销">分销</Option>
                      <Option value="线上">线上</Option>
                    </Select>
                    <RangePicker 
                      value={queryFilters.dateRange}
                      onChange={(dates) => setQueryFilters({ ...queryFilters, dateRange: dates })}
                    />
                    <Button icon={<SearchOutlined />} onClick={() => applyFilters()}>查询</Button>
                    <Button onClick={handleResetFilters}>重置</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                      新增计划
                    </Button>
                  </Space>
                </Card>
                <Card>
                  <Table 
                    columns={columns} 
                    dataSource={filteredPlans} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1400 }}
                  />
                </Card>
              </>
            )
          },
          {
            key: 'statistics',
            label: (
              <span>
                <BarChartOutlined />
                统计分析
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Card>
                      <Statistic title="总计划数" value={plans.length} />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic 
                        title="执行中" 
                        value={plans.filter(p => p.status === 'executing').length} 
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic 
                        title="已完成" 
                        value={plans.filter(p => p.status === 'completed').length} 
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic 
                        title="平均完成率" 
                        value={statistics.length > 0 ? (statistics.reduce((sum, s) => sum + s.completionRate, 0) / statistics.length).toFixed(1) : 0}
                        suffix="%"
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                </Row>
                <Card>
                  <ReactECharts option={completionRateChart} style={{ height: 350 }} />
                </Card>
                <Card>
                  <ReactECharts option={salesTrendChart} style={{ height: 350 }} />
                </Card>
              </Space>
            )
          },
          {
            key: 'weighbridge',
            label: '地磅数据',
            children: (
              <Card>
                <Table 
                  columns={weighbridgeColumns} 
                  dataSource={weighbridge} 
                  rowKey="id" 
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 新增计划 */}
      <Modal title="新增销售计划" open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={700} okText="保存" cancelText="取消">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="计划名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dates" label="时间范围" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="salesVolume" label="销售煤量(吨)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="estimatedAmount" label="预估金额(元)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="channel" label="销售渠道" rules={[{ required: true }]}>
                <Select>
                  <Option value="直销">直销</Option>
                  <Option value="分销">分销</Option>
                  <Option value="线上">线上</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="responsiblePerson" label="责任人" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="calorificValue" label="热值(kcal/kg)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sulfurContent" label="硫分(%)">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批 */}
      <Modal title="审批销售计划" open={approvalModalVisible} onOk={handleApprovalSubmit} onCancel={() => setApprovalModalVisible(false)} okText="提交" cancelText="取消">
        <Form form={approvalForm} layout="vertical">
          <Form.Item name="action" label="审批结果" rules={[{ required: true }]}>
            <Select>
              <Option value="approve">通过</Option>
              <Option value="reject">驳回</Option>
            </Select>
          </Form.Item>
          <Form.Item name="opinion" label="审批意见" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 进度反馈 */}
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

      {/* 计划总结 */}
      <Modal title="计划总结" open={summaryModalVisible} onOk={handleSummarySubmit} onCancel={() => setSummaryModalVisible(false)} width={700} okText="提交" cancelText="取消">
        <Form form={summaryForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="finalVolume" label="最终完成煤量(吨)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="finalAmount" label="最终金额(元)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="problemAnalysis" label="问题分析" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请描述计划执行过程中遇到的主要问题" />
          </Form.Item>
          <Form.Item name="improvements" label="改进措施" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请提出针对性的改进措施和建议" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 视频回看 */}
      <Modal title="监控视频回看" open={videoModalVisible} onCancel={() => setVideoModalVisible(false)} footer={null} width={800}>
        <div style={{ background: '#000', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <div>
            <p>视频地址: {selectedVideo}</p>
            <p>(模拟视频播放器 - 实际需对接视频流服务)</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalesPlanPageEnhanced;
