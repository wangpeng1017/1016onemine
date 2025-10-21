import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, Badge, Row, Col, Statistic, Progress, Tabs } from 'antd';
import { SafetyOutlined, WarningOutlined, CheckCircleOutlined, PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';

interface RiskRecord {
  key: string;
  riskPoint: string;
  hazardSource: string;
  accidentType: string;
  riskLevel: string;
  controlMeasures: string;
  responsible: string;
  status: string;
}

interface HazardRecord {
  key: string;
  code: string;
  description: string;
  level: string;
  location: string;
  reporter: string;
  reportTime: string;
  status: string;
  overdue: boolean;
}

const DualPreventionMechanism: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = { 重大: 'red', 较大: 'orange', 一般: 'yellow', 低: 'blue' };
    return colors[level] || 'default';
  };

  const riskColumns: ColumnsType<RiskRecord> = [
    { title: '风险点', dataIndex: 'riskPoint', key: 'riskPoint', width: 150 },
    { title: '危险源', dataIndex: 'hazardSource', key: 'hazardSource' },
    { title: '事故类型', dataIndex: 'accidentType', key: 'accidentType' },
    { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', render: (level: string) => <Tag color={getRiskColor(level)}>{level}</Tag> },
    { title: '管控措施', dataIndex: 'controlMeasures', key: 'controlMeasures', width: 200 },
    { title: '责任人', dataIndex: 'responsible', key: 'responsible' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Badge status={status === '正常' ? 'success' : 'warning'} text={status} /> },
    { title: '操作', key: 'action', fixed: 'right', width: 150, render: () => <Space size="small"><Button type="link" size="small" icon={<EyeOutlined />}>查看</Button><Button type="link" size="small" icon={<EditOutlined />}>编辑</Button></Space> },
  ];

  const riskData: RiskRecord[] = [
    { key: '1', riskPoint: '3号采煤工作面', hazardSource: '煤尘爆炸', accidentType: '爆炸', riskLevel: '重大', controlMeasures: '定时洒水降尘、监测粉尘浓度', responsible: '张三', status: '正常' },
    { key: '2', riskPoint: '主运输巷', hazardSource: '皮带运输', accidentType: '机械伤害', riskLevel: '较大', controlMeasures: '设置防护栏、定期检查', responsible: '李四', status: '正常' },
    { key: '3', riskPoint: '主井提升系统', hazardSource: '钢丝绳断裂', accidentType: '坠落', riskLevel: '重大', controlMeasures: '每日检查、定期更换', responsible: '王五', status: '异常' },
  ];

  const hazardColumns: ColumnsType<HazardRecord> = [
    { title: '隐患编号', dataIndex: 'code', key: 'code', width: 120 },
    { title: '隐患描述', dataIndex: 'description', key: 'description', width: 250 },
    { title: '隐患等级', dataIndex: 'level', key: 'level', render: (level: string) => <Tag color={level === '重大' ? 'red' : 'orange'}>{level}</Tag> },
    { title: '地点', dataIndex: 'location', key: 'location' },
    { title: '上报人', dataIndex: 'reporter', key: 'reporter' },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string, record: HazardRecord) => <Badge status={status === '已闭环' ? 'success' : 'processing'} text={<>{status}{record.overdue && <Tag color="red" style={{ marginLeft: 8 }}>逾期</Tag>}</>} /> },
    { title: '操作', key: 'action', fixed: 'right', width: 150, render: (_: any, record: HazardRecord) => <Space size="small"><Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>{record.status !== '已闭环' && <Button type="primary" size="small">处理</Button>}</Space> },
  ];

  const hazardData: HazardRecord[] = [
    { key: '1', code: 'YH-2024-001', description: '3号采区电缆破损，存在漏电风险', level: '重大', location: '3号采煤工作面', reporter: '张三', reportTime: '2024-10-18 09:30', status: '治理中', overdue: true },
    { key: '2', code: 'YH-2024-002', description: '主运输巷防尘网破损', level: '一般', location: '主运输巷', reporter: '李四', reportTime: '2024-10-19 14:20', status: '待验收', overdue: false },
    { key: '3', code: 'YH-2024-003', description: '井下排水系统管道渗漏', level: '较大', location: '排水泵房', reporter: '王五', reportTime: '2024-10-20 08:15', status: '待治理', overdue: false },
  ];

  const riskMapOption = {
    title: { text: '风险四色分布图', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 10 },
    series: [{ name: '风险等级', type: 'pie', radius: ['40%', '70%'], data: [
      { value: 12, name: '重大(红)', itemStyle: { color: '#ff4d4f' } },
      { value: 28, name: '较大(橙)', itemStyle: { color: '#ff7a45' } },
      { value: 45, name: '一般(黄)', itemStyle: { color: '#ffc53d' } },
      { value: 68, name: '低(蓝)', itemStyle: { color: '#1890ff' } },
    ]}],
  };

  const hazardTrendOption = {
    title: { text: '隐患治理趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 10 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '新增', type: 'bar', data: [45, 38, 52, 41, 35, 43], itemStyle: { color: '#ff7a45' } },
      { name: '已治理', type: 'bar', data: [42, 36, 49, 39, 34, 42], itemStyle: { color: '#52c41a' } },
      { name: '闭环率', type: 'line', data: [93, 95, 94, 95, 97, 98], itemStyle: { color: '#1890ff' } },
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}><SafetyOutlined /> 双重预防机制</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="风险管控点" value={153} suffix="个" valueStyle={{ color: '#1890ff' }} prefix={<SafetyOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="未闭环隐患" value={8} suffix="项" valueStyle={{ color: '#ff4d4f' }} prefix={<WarningOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="本月隐患数" value={43} suffix="项" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="隐患闭环率" value={98} suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card></Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          { key: '1', label: '风险分级管控', children: (
            <>
              <Space style={{ marginBottom: 16 }} wrap>
                <Input placeholder="搜索风险点" prefix={<SearchOutlined />} style={{ width: 200 }} />
                <Select placeholder="风险等级" style={{ width: 120 }} allowClear options={[{value:'major',label:'重大'},{value:'large',label:'较大'},{value:'normal',label:'一般'},{value:'low',label:'低'}]} />
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setRiskModalVisible(true)}>新增风险点</Button>
              </Space>
              <Table columns={riskColumns} dataSource={riskData} pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} style={{ marginBottom: 24 }} />
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card><ReactECharts option={riskMapOption} style={{ height: 350 }} /></Card></Col>
                <Col xs={24} lg={12}><Card title="管控措施执行情况"><Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div><div style={{ marginBottom: 8 }}><span>工程措施</span><span style={{ float: 'right' }}>92%</span></div><Progress percent={92} status="active" /></div>
                  <div><div style={{ marginBottom: 8 }}><span>管理措施</span><span style={{ float: 'right' }}>88%</span></div><Progress percent={88} /></div>
                  <div><div style={{ marginBottom: 8 }}><span>培训教育</span><span style={{ float: 'right' }}>95%</span></div><Progress percent={95} status="active" /></div>
                  <div><div style={{ marginBottom: 8 }}><span>个体防护</span><span style={{ float: 'right' }}>98%</span></div><Progress percent={98} status="success" /></div>
                </Space></Card></Col>
              </Row>
            </>
          )},
          { key: '2', label: '隐患排查治理', children: (
            <>
              <Space style={{ marginBottom: 16 }} wrap>
                <Input placeholder="搜索隐患编号/描述" prefix={<SearchOutlined />} style={{ width: 250 }} />
                <Select placeholder="隐患等级" style={{ width: 120 }} allowClear options={[{value:'major',label:'重大'},{value:'normal',label:'一般'}]} />
                <Select placeholder="状态" style={{ width: 150 }} allowClear options={[{value:'pending',label:'待治理'},{value:'processing',label:'治理中'},{value:'checking',label:'待验收'},{value:'closed',label:'已闭环'}]} />
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                <Button type="primary" icon={<FileAddOutlined />}>上报隐患</Button>
              </Space>
              <Table columns={hazardColumns} dataSource={hazardData} pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} style={{ marginBottom: 24 }} />
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}><Card><ReactECharts option={hazardTrendOption} style={{ height: 350 }} /></Card></Col>
              </Row>
            </>
          )},
        ]} />
      </Card>

      <Modal title="新增风险点" open={riskModalVisible} onOk={() => { setRiskModalVisible(false); form.resetFields(); }} onCancel={() => { setRiskModalVisible(false); form.resetFields(); }} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="riskPoint" label="风险点" rules={[{ required: true }]}><Input placeholder="请输入风险点名称" /></Form.Item>
          <Form.Item name="hazardSource" label="危险源" rules={[{ required: true }]}><Input placeholder="请输入危险源" /></Form.Item>
          <Form.Item name="accidentType" label="事故类型" rules={[{ required: true }]}><Select placeholder="请选择事故类型" options={[{value:'explosion',label:'爆炸'},{value:'fire',label:'火灾'},{value:'fall',label:'坠落'},{value:'mechanical',label:'机械伤害'}]} /></Form.Item>
          <Form.Item name="riskLevel" label="风险等级" rules={[{ required: true }]}><Select placeholder="请选择风险等级" options={[{value:'major',label:'重大'},{value:'large',label:'较大'},{value:'normal',label:'一般'},{value:'low',label:'低'}]} /></Form.Item>
          <Form.Item name="controlMeasures" label="管控措施" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="请输入管控措施" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DualPreventionMechanism;
