import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Space, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface AnalysisData {
  key: string;
  period: string;
  planOutput: number;
  actualOutput: number;
  completion: number;
  team: string;
  variance: number;
}

const ProductionAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const analysisData: AnalysisData[] = [
    {
      key: '1',
      period: '2024年6月',
      planOutput: 500000,
      actualOutput: 510000,
      completion: 102,
      team: '自营队',
      variance: 10000,
    },
    {
      key: '2',
      period: '2024年6月',
      planOutput: 200000,
      actualOutput: 195000,
      completion: 97.5,
      team: '外委队',
      variance: -5000,
    },
    {
      key: '3',
      period: '2024年5月',
      planOutput: 480000,
      actualOutput: 456000,
      completion: 95,
      team: '自营队',
      variance: -24000,
    },
    {
      key: '4',
      period: '2024年5月',
      planOutput: 185000,
      actualOutput: 188000,
      completion: 101.6,
      team: '外委队',
      variance: 3000,
    },
  ];

  const columns: ColumnsType<AnalysisData> = [
    { title: '时间', dataIndex: 'period', key: 'period', width: 120 },
    { title: '队伍', dataIndex: 'team', key: 'team', width: 100 },
    {
      title: '计划产量(吨)',
      dataIndex: 'planOutput',
      key: 'planOutput',
      width: 130,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '实际产量(吨)',
      dataIndex: 'actualOutput',
      key: 'actualOutput',
      width: 130,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '完成率',
      dataIndex: 'completion',
      key: 'completion',
      width: 100,
      render: (val: number) => (
        <span style={{ color: val >= 100 ? '#52c41a' : '#ff4d4f' }}>
          {val.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '超欠产(吨)',
      dataIndex: 'variance',
      key: 'variance',
      width: 120,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {val > 0 ? '+' : ''}{val.toLocaleString()}
        </span>
      ),
    },
  ];

  const stats = analysisData.filter(
    (item) => selectedTeam === 'all' || item.team === selectedTeam
  );
  const totalPlan = stats.reduce((sum, item) => sum + item.planOutput, 0);
  const totalActual = stats.reduce((sum, item) => sum + item.actualOutput, 0);
  const avgCompletion = totalPlan > 0 ? ((totalActual / totalPlan) * 100).toFixed(1) : 0;

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <span>时间维度:</span>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Select.Option value="day">按日</Select.Option>
            <Select.Option value="week">按周</Select.Option>
            <Select.Option value="month">按月</Select.Option>
          </Select>

          <span>队伍筛选:</span>
          <Select
            value={selectedTeam}
            onChange={setSelectedTeam}
            style={{ width: 150 }}
          >
            <Select.Option value="all">全部队伍</Select.Option>
            <Select.Option value="自营队">自营队</Select.Option>
            <Select.Option value="外委队">外委队</Select.Option>
          </Select>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="计划总产量"
              value={totalPlan}
              suffix="吨"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实际总产量"
              value={totalActual}
              suffix="吨"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均完成率"
              value={avgCompletion}
              suffix="%"
              valueStyle={{ color: avgCompletion >= 100 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="超欠总量"
              value={totalActual - totalPlan}
              suffix="吨"
              valueStyle={{ color: totalActual >= totalPlan ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="超欠产分析">
        <Table
          columns={columns}
          dataSource={stats}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default ProductionAnalysis;
