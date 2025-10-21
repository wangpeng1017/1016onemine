import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Modal, Form, Input, Select, Tag, Space, message, Progress, Tabs, DatePicker } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, RiseOutlined, FallOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { dashboardService, customerService, feedbackService } from '../../services/productionSalesMockService';
import type { SalesDashboard, Customer, CustomerFeedback } from '../../types/productionSales';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const FeedbackPageEnhanced: React.FC = () => {
  const [dashboard, setDashboard] = useState<SalesDashboard | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter'>('month');
  const [reportDateRange, setReportDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'month'),
    dayjs()
  ]);
  const [feedbackForm] = Form.useForm();
  const [processForm] = Form.useForm();

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setDashboard(dashboardService.getDashboard());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setDashboard(dashboardService.getDashboard());
    setCustomers(customerService.getAll());
    setFeedbacks(feedbackService.getAll());
  };

  const feedbackTypeLabels: Record<string, string> = {
    quality: '产品质量',
    service: '服务水平',
    delivery: '交货期',
    other: '其他'
  };

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决'
  };

  const statusColors: Record<string, any> = {
    pending: 'error',
    processing: 'warning',
    resolved: 'success'
  };

  const customerColumns = [
    { title: '客户名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 120 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 150 },
    { title: '累计购买(吨)', dataIndex: 'totalPurchase', key: 'totalPurchase', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '累计金额(元)', dataIndex: 'totalAmount', key: 'totalAmount', width: 150, render: (v: number) => '¥' + v.toLocaleString() },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Customer) => (
        <Button type="link" size="small" onClick={() => handleViewCustomer(record)}>
          详情
        </Button>
      )
    }
  ];

  const feedbackColumns = [
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '反馈日期', dataIndex: 'feedbackDate', key: 'feedbackDate', width: 120 },
    { 
      title: '反馈类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 120,
      render: (type: CustomerFeedback['type']) => feedbackTypeLabels[type]
    },
    { title: '反馈内容', dataIndex: 'content', key: 'content', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CustomerFeedback['status']) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      )
    },
    { title: '负责人', dataIndex: 'responsible', key: 'responsible', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: CustomerFeedback) => (
        <Space size="small">
          {record.status !== 'resolved' && (
            <Button type="link" size="small" onClick={() => handleProcess(record)}>
              处理
            </Button>
          )}
          <Button type="link" size="small" onClick={() => handleViewFeedback(record)}>
            详情
          </Button>
        </Space>
      )
    }
  ];

  const handleAddFeedback = () => {
    feedbackForm.resetFields();
    setFeedbackModalVisible(true);
  };

  const handleFeedbackSubmit = () => {
    feedbackForm.validateFields().then(values => {
      feedbackService.add({
        ...values,
        feedbackDate: dayjs().format('YYYY-MM-DD'),
        status: 'pending'
      });
      loadData();
      message.success('客户反馈已记录');
      setFeedbackModalVisible(false);
    });
  };

  const handleProcess = (feedback: CustomerFeedback) => {
    setSelectedFeedback(feedback);
    processForm.resetFields();
    setProcessModalVisible(true);
  };

  const handleProcessSubmit = () => {
    processForm.validateFields().then(values => {
      if (selectedFeedback) {
        feedbackService.updateStatus(
          selectedFeedback.id,
          values.status,
          {
            processor: '当前用户',
            action: values.action,
            result: values.result
          }
        );
        loadData();
        message.success('处理记录已更新');
        setProcessModalVisible(false);
      }
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    Modal.info({
      title: customer.name,
      width: 700,
      content: (
        <div>
          <p><strong>联系人：</strong>{customer.contact}</p>
          <p><strong>电话：</strong>{customer.phone}</p>
          <p><strong>地址：</strong>{customer.address || '-'}</p>
          <p><strong>累计购买：</strong>{customer.totalPurchase.toLocaleString()} 吨</p>
          <p><strong>累计金额：</strong>¥{customer.totalAmount.toLocaleString()}</p>
          {customer.purchaseHistory && customer.purchaseHistory.length > 0 && (
            <>
              <p><strong>最近购买记录：</strong></p>
              <ul>
                {customer.purchaseHistory.slice(0, 5).map((p, i) => (
                  <li key={i}>{p.date}: {p.volume}吨, ¥{p.amount.toLocaleString()}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    });
  };

  const handleViewFeedback = (feedback: CustomerFeedback) => {
    Modal.info({
      title: '反馈详情',
      width: 700,
      content: (
        <div>
          <p><strong>客户：</strong>{feedback.customerName}</p>
          <p><strong>日期：</strong>{feedback.feedbackDate}</p>
          <p><strong>类型：</strong>{feedbackTypeLabels[feedback.type]}</p>
          <p><strong>内容：</strong>{feedback.content}</p>
          <p><strong>状态：</strong><Tag color={statusColors[feedback.status]}>{statusLabels[feedback.status]}</Tag></p>
          {feedback.processingHistory && feedback.processingHistory.length > 0 && (
            <>
              <p><strong>处理记录：</strong></p>
              <ul>
                {feedback.processingHistory.map((p, i) => (
                  <li key={i}>{p.timestamp} - {p.processor}: {p.action} {p.result && `(${p.result})`}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    });
  };

  const handleGenerateReport = () => {
    setReportModalVisible(true);
  };

  const handleExportReport = () => {
    const report = generatePeriodReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `客户反馈统计报告_${reportDateRange[0].format('YYYYMMDD')}_${reportDateRange[1].format('YYYYMMDD')}.json`;
    a.click();
    message.success('报告已导出');
  };

  const generatePeriodReport = () => {
    const startDate = reportDateRange[0];
    const endDate = reportDateRange[1];
    const periodFeedbacks = feedbacks.filter(f => 
      dayjs(f.feedbackDate).isAfter(startDate) && dayjs(f.feedbackDate).isBefore(endDate)
    );

    const typeStats: Record<string, number> = {};
    const statusStats: Record<string, number> = {};
    periodFeedbacks.forEach(f => {
      typeStats[f.type] = (typeStats[f.type] || 0) + 1;
      statusStats[f.status] = (statusStats[f.status] || 0) + 1;
    });

    return {
      period: `${startDate.format('YYYY-MM-DD')} 至 ${endDate.format('YYYY-MM-DD')}`,
      totalFeedbacks: periodFeedbacks.length,
      typeDistribution: typeStats,
      statusDistribution: statusStats,
      resolutionRate: periodFeedbacks.length > 0 ? ((statusStats['resolved'] || 0) / periodFeedbacks.length * 100).toFixed(1) : 0,
      topIssues: Object.entries(typeStats).sort((a, b) => b[1] - a[1]).slice(0, 3)
    };
  };

  const channelChartOption = {
    title: { text: '销售渠道分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c}% ' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: dashboard ? Object.entries(dashboard.channelDistribution).map(([k, v]) => ({ name: k, value: v.toFixed(1) })) : [],
      label: { formatter: '{b}\n{d}%' }
    }]
  };

  const feedbackStats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    processing: feedbacks.filter(f => f.status === 'processing').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length
  };

  const resolutionRate = feedbackStats.total > 0 ? (feedbackStats.resolved / feedbackStats.total) * 100 : 0;

  // 问题分类统计图表
  const typeCounts: Record<string, number> = {};
  feedbacks.forEach(f => {
    typeCounts[feedbackTypeLabels[f.type]] = (typeCounts[feedbackTypeLabels[f.type]] || 0) + 1;
  });

  const typeDistributionChart = {
    title: { text: '反馈问题分类统计', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Object.keys(typeCounts) },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar',
      data: Object.values(typeCounts),
      itemStyle: { color: '#1890ff' },
      label: { show: true, position: 'top' }
    }],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  // 趋势分析（模拟最近6个月数据）
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const month = dayjs().subtract(5 - i, 'month').format('YYYY-MM');
    return {
      month,
      total: 8 + Math.floor(Math.random() * 5),
      resolved: 6 + Math.floor(Math.random() * 4)
    };
  });

  const trendChart = {
    title: { text: '反馈处理趋势（近6个月）', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['总反馈数', '已解决数'], bottom: 10 },
    xAxis: { type: 'category', data: trendData.map(d => d.month) },
    yAxis: { type: 'value', name: '数量' },
    series: [
      { name: '总反馈数', type: 'line', data: trendData.map(d => d.total), smooth: true, itemStyle: { color: '#1890ff' } },
      { name: '已解决数', type: 'line', data: trendData.map(d => d.resolved), smooth: true, itemStyle: { color: '#52c41a' } }
    ],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        defaultActiveKey="dashboard"
        items={[
          {
            key: 'dashboard',
            label: '销售看板',
            children: (
              <>
                <Card title="销售数据看板" style={{ marginBottom: 24 }}>
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                      <Card>
                        <Statistic 
                          title="今日销售" 
                          value={dashboard?.todaySales.toFixed(0)} 
                          suffix="吨" 
                          prefix={<ShoppingCartOutlined />}
                          valueStyle={{ color: '#1890ff' }} 
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                          ¥{dashboard?.todayRevenue.toLocaleString()}
                        </div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic 
                          title="本周销售" 
                          value={dashboard?.weekSales.toFixed(0)} 
                          suffix="吨" 
                          valueStyle={{ color: '#52c41a' }} 
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                          ¥{dashboard?.weekRevenue.toLocaleString()}
                        </div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic 
                          title="本月销售" 
                          value={dashboard?.monthSales.toFixed(0)} 
                          suffix="吨" 
                          valueStyle={{ color: '#faad14' }} 
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                          ¥{dashboard?.monthRevenue.toLocaleString()}
                        </div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic 
                          title="价格波动" 
                          value={dashboard ? Math.abs(dashboard.priceFluctuation).toFixed(2) : 0} 
                          suffix="%" 
                          prefix={dashboard && dashboard.priceFluctuation > 0 ? <RiseOutlined /> : <FallOutlined />}
                          valueStyle={{ color: dashboard && dashboard.priceFluctuation > 0 ? '#ff4d4f' : '#52c41a' }} 
                        />
                      </Card>
                    </Col>
                  </Row>
                  <ReactECharts option={channelChartOption} style={{ height: 300 }} />
                </Card>
                <Card title="客户信息">
                  <Table columns={customerColumns} dataSource={customers} rowKey="id" pagination={{ pageSize: 5 }} />
                </Card>
              </>
            )
          },
          {
            key: 'feedback',
            label: '反馈管理',
            children: (
              <Card
                title="客户反馈管理"
                extra={
                  <Space>
                    <div>
                      <span>解决率: </span>
                      <Progress 
                        type="circle" 
                        percent={parseFloat(resolutionRate.toFixed(1))} 
                        width={50} 
                        strokeColor={resolutionRate > 80 ? '#52c41a' : '#faad14'}
                      />
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFeedback}>
                      新增反馈
                    </Button>
                  </Space>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <span>总数: <strong>{feedbackStats.total}</strong></span>
                    <Tag color="error">待处理: {feedbackStats.pending}</Tag>
                    <Tag color="warning">处理中: {feedbackStats.processing}</Tag>
                    <Tag color="success">已解决: {feedbackStats.resolved}</Tag>
                  </Space>
                </div>
                <Table columns={feedbackColumns} dataSource={feedbacks} rowKey="id" pagination={{ pageSize: 10 }} />
              </Card>
            )
          },
          {
            key: 'analysis',
            label: (
              <span>
                <BarChartOutlined />
                统计分析
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card
                  title="定期统计报告"
                  extra={
                    <Space>
                      <Select value={reportPeriod} onChange={setReportPeriod} style={{ width: 120 }}>
                        <Option value="month">月度报告</Option>
                        <Option value="quarter">季度报告</Option>
                      </Select>
                      <RangePicker 
                        value={reportDateRange}
                        onChange={(dates) => dates && setReportDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                      />
                      <Button icon={<FileTextOutlined />} onClick={handleGenerateReport}>
                        生成报告
                      </Button>
                      <Button type="primary" onClick={handleExportReport}>
                        导出报告
                      </Button>
                    </Space>
                  }
                >
                  {(() => {
                    const report = generatePeriodReport();
                    return (
                      <Row gutter={16}>
                        <Col span={6}>
                          <Statistic title="总反馈数" value={report.totalFeedbacks} />
                        </Col>
                        <Col span={6}>
                          <Statistic 
                            title="解决率" 
                            value={report.resolutionRate} 
                            suffix="%" 
                            valueStyle={{ color: parseFloat(report.resolutionRate as string) > 80 ? '#52c41a' : '#faad14' }}
                          />
                        </Col>
                        <Col span={12}>
                          <div>
                            <p><strong>主要问题类型：</strong></p>
                            <Space>
                              {report.topIssues.map(([type, count]) => (
                                <Tag key={type} color="blue">{feedbackTypeLabels[type as keyof typeof feedbackTypeLabels] || type}: {count}次</Tag>
                              ))}
                            </Space>
                          </div>
                        </Col>
                      </Row>
                    );
                  })()}
                </Card>
                <Card>
                  <ReactECharts option={typeDistributionChart} style={{ height: 350 }} />
                </Card>
                <Card>
                  <ReactECharts option={trendChart} style={{ height: 350 }} />
                </Card>
              </Space>
            )
          }
        ]}
      />

      {/* 新增客户反馈 */}
      <Modal title="新增客户反馈" open={feedbackModalVisible} onOk={handleFeedbackSubmit} onCancel={() => setFeedbackModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={feedbackForm} layout="vertical">
          <Form.Item name="customerName" label="客户名称" rules={[{ required: true }]}>
            <Select placeholder="选择客户">
              {customers.map(c => <Option key={c.id} value={c.name}>{c.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="反馈类型" rules={[{ required: true }]}>
            <Select>
              <Option value="quality">产品质量</Option>
              <Option value="service">服务水平</Option>
              <Option value="delivery">交货期</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="反馈内容" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述客户反馈的内容" />
          </Form.Item>
          <Form.Item name="responsible" label="负责人">
            <Input placeholder="指定处理负责人" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 处理反馈 */}
      <Modal title="处理反馈" open={processModalVisible} onOk={handleProcessSubmit} onCancel={() => setProcessModalVisible(false)} okText="提交" cancelText="取消">
        <Form form={processForm} layout="vertical">
          <Form.Item name="status" label="更新状态" rules={[{ required: true }]}>
            <Select>
              <Option value="processing">处理中</Option>
              <Option value="resolved">已解决</Option>
            </Select>
          </Form.Item>
          <Form.Item name="action" label="处理动作" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="描述采取的处理措施" />
          </Form.Item>
          <Form.Item name="result" label="处理结果">
            <TextArea rows={2} placeholder="描述处理结果(可选)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 报告预览 */}
      <Modal 
        title={`${reportPeriod === 'month' ? '月度' : '季度'}客户反馈统计报告`}
        open={reportModalVisible} 
        onCancel={() => setReportModalVisible(false)} 
        footer={[
          <Button key="export" type="primary" onClick={handleExportReport}>
            导出报告
          </Button>,
          <Button key="close" onClick={() => setReportModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {(() => {
          const report = generatePeriodReport();
          return (
            <div>
              <h4>报告周期：{report.period}</h4>
              <p><strong>总反馈数：</strong>{report.totalFeedbacks}</p>
              <p><strong>解决率：</strong>{report.resolutionRate}%</p>
              <h4>问题类型分布：</h4>
              <ul>
                {Object.entries(report.typeDistribution).map(([type, count]) => (
                  <li key={type}>{feedbackTypeLabels[type as keyof typeof feedbackTypeLabels] || type}: {count}次</li>
                ))}
              </ul>
              <h4>处理状态分布：</h4>
              <ul>
                {Object.entries(report.statusDistribution).map(([status, count]) => (
                  <li key={status}>{statusLabels[status as keyof typeof statusLabels] || status}: {count}次</li>
                ))}
              </ul>
              <h4>主要问题点：</h4>
              <ol>
                {report.topIssues.map(([type, count]) => (
                  <li key={type}>{feedbackTypeLabels[type as keyof typeof feedbackTypeLabels] || type} ({count}次)</li>
                ))}
              </ol>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default FeedbackPageEnhanced;
