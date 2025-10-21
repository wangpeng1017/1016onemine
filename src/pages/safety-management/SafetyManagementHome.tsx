import React from 'react';
import { Card, Row, Col, Statistic, Timeline, Table, Badge } from 'antd';
import { SafetyOutlined, FileProtectOutlined, AlertOutlined, TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const SafetyManagementHome: React.FC = () => {
  const riskOption = { title: { text: '风险分级统计', left: 'center' }, tooltip: { trigger: 'item' }, series: [{ name: '风险等级', type: 'pie', radius: ['40%', '70%'], data: [{ value: 12, name: '重大风险', itemStyle: { color: '#ff4d4f' } }, { value: 28, name: '较大风险', itemStyle: { color: '#ff7a45' } }, { value: 45, name: '一般风险', itemStyle: { color: '#ffc53d' } }, { value: 68, name: '低风险', itemStyle: { color: '#1890ff' } }] }] };
  const hazardOption = { title: { text: '隐患治理趋势', left: 'center' }, tooltip: { trigger: 'axis' }, xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] }, yAxis: { type: 'value' }, series: [{ name: '新增', type: 'line', data: [45, 38, 52, 41, 35, 43], itemStyle: { color: '#ff7a45' } }, { name: '已治理', type: 'line', data: [42, 36, 49, 39, 34, 42], itemStyle: { color: '#52c41a' } }] };
  
  return (
    <div style={{ padding: 24 }}>
      <h2><SafetyOutlined /> 智慧矿山 · 安全管理中心</h2>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}><Card><Statistic title='风险管控' value={153} prefix={<FileProtectOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title='未闭环隐患' value={8} valueStyle={{ color: '#ff4d4f' }} prefix={<AlertOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title='培训人次' value={280} prefix={<TeamOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title='安全费用' value={125.6} precision={1} prefix={<DollarOutlined />} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}><Card><ReactECharts option={riskOption} style={{ height: 300 }} /></Card></Col>
        <Col span={12}><Card><ReactECharts option={hazardOption} style={{ height: 300 }} /></Card></Col>
      </Row>
    </div>
  );
};

export default SafetyManagementHome;
