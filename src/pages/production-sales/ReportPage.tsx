import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, Table, Tabs, Space } from 'antd';
import { DownloadOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { reportService, siloService, tempPileService } from '../../services/productionSalesMockService';
import type { BalanceSheet, ProductionReport } from '../../types/productionSales';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ReportPage: React.FC = () => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [productionData, setProductionData] = useState<ProductionReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);

  const loadData = useCallback(() => {
    const balance = reportService.getBalanceSheet(selectedPeriod);
    setBalanceSheet(balance);

    const production = reportService.getProductionReport(
      dateRange[0].format('YYYY-MM-DD'),
      dateRange[1].format('YYYY-MM-DD')
    );
    setProductionData(production);
  }, [selectedPeriod, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = () => {
    // 模拟导出Excel
    const data = JSON.stringify(balanceSheet, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `产存销报表_${selectedPeriod}.json`;
    a.click();
  };

  const balanceColumns = [
    { title: '项目', dataIndex: 'item', key: 'item', width: 150 },
    { title: '数值(吨)', dataIndex: 'value', key: 'value', render: (v: number) => v.toLocaleString() }
  ];

  const balanceTableData = balanceSheet ? [
    { key: '1', item: '期初库存', value: balanceSheet.openingInventory },
    { key: '2', item: '本期产量', value: balanceSheet.production },
    { key: '3', item: '本期销量', value: balanceSheet.sales },
    { key: '4', item: '本期损耗', value: balanceSheet.loss },
    { key: '5', item: '期末库存(实际)', value: balanceSheet.closingInventory },
    { key: '6', item: '期末库存(计算)', value: balanceSheet.calculatedInventory },
    { key: '7', item: '差异', value: balanceSheet.variance, valueStyle: { color: Math.abs(balanceSheet.variance) > 100 ? '#ff4d4f' : '#52c41a' } }
  ] : [];

  const productionColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '日产量(吨)', dataIndex: 'dailyOutput', key: 'dailyOutput', render: (v: number) => v.toFixed(1) },
    { title: '完成率(%)', dataIndex: 'completionRate', key: 'completionRate', render: (v?: number) => v ? v.toFixed(1) + '%' : '-' }
  ];

  // 产存销趋势图
  const trendChartOption = {
    title: { text: '产存销趋势分析', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['产量', '销量', '库存'], bottom: 10 },
    xAxis: { type: 'category', data: productionData.map(d => d.date.slice(5)) },
    yAxis: { type: 'value', name: '数量(吨)' },
    series: [
      { 
        name: '产量', 
        type: 'line', 
        data: productionData.map(d => d.dailyOutput.toFixed(0)), 
        smooth: true, 
        itemStyle: { color: '#1890ff' } 
      },
      { 
        name: '销量', 
        type: 'line', 
        data: productionData.map(() => (750 + Math.random() * 150).toFixed(0)), 
        smooth: true, 
        itemStyle: { color: '#52c41a' } 
      },
      { 
        name: '库存', 
        type: 'line', 
        data: productionData.map((_, i) => (5000 + i * 50 + Math.random() * 200).toFixed(0)), 
        smooth: true, 
        itemStyle: { color: '#faad14' } 
      }
    ],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  // 产销对比图
  const comparisonChartOption = {
    title: { text: '计划产量与实际产量对比', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['计划产量', '实际产量'], bottom: 10 },
    xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周'] },
    yAxis: { type: 'value', name: '产量(吨)' },
    series: [
      { name: '计划产量', type: 'bar', data: [6000, 6000, 6000, 6000], itemStyle: { color: '#1890ff' } },
      { name: '实际产量', type: 'bar', data: [5800, 6100, 5950, 6200], itemStyle: { color: '#52c41a' } }
    ],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  // 煤质分布饼图
  const qualityDistributionOption = {
    title: { text: '产品煤质分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c}吨 ({d}%)' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { name: '高热值煤', value: 12000 },
        { name: '中热值煤', value: 18000 },
        { name: '低热值煤', value: 8000 }
      ],
      label: { formatter: '{b}\n{c}吨\n({d}%)' }
    }]
  };

  const silos = siloService.getAll();
  const tempPiles = tempPileService.getAll();
  const totalInventory = silos.reduce((sum, s) => sum + s.currentVolume, 0) + 
                        tempPiles.reduce((sum, p) => sum + p.volume, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="当前总库存" value={totalInventory.toFixed(0)} suffix="吨" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月产量" 
              value={balanceSheet?.production.toFixed(0)} 
              suffix="吨" 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月销量" 
              value={balanceSheet?.sales.toFixed(0)} 
              suffix="吨" 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="产销率" 
              value={balanceSheet ? ((balanceSheet.sales / balanceSheet.production) * 100).toFixed(1) : 0} 
              suffix="%" 
              valueStyle={{ color: '#722ed1' }} 
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="balance"
        items={[
          {
            key: 'balance',
            label: (
              <span>
                <BarChartOutlined />
                产存销平衡表
              </span>
            ),
            children: (
              <Card
                title={`产存销平衡表 - ${selectedPeriod}`}
                extra={
                  <Space>
                    <DatePicker
                      picker="month"
                      value={dayjs(selectedPeriod)}
                      onChange={(date) => date && setSelectedPeriod(date.format('YYYY-MM'))}
                    />
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                      导出报表
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={balanceColumns}
                  dataSource={balanceTableData}
                  pagination={false}
                  size="middle"
                  style={{ marginBottom: 24 }}
                />
                <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                  <h4>计算公式</h4>
                  <p>期末库存(计算) = 期初库存 + 本期产量 - 本期销量 - 本期损耗</p>
                  <p>差异 = 期末库存(实际) - 期末库存(计算)</p>
                  {balanceSheet && Math.abs(balanceSheet.variance) > 100 && (
                    <p style={{ color: '#ff4d4f' }}>
                      <strong>提示：</strong>差异超过100吨，建议核查库存数据！
                    </p>
                  )}
                </div>
              </Card>
            )
          },
          {
            key: 'production',
            label: (
              <span>
                <LineChartOutlined />
                产量报表
              </span>
            ),
            children: (
              <Card
                title="产量明细"
                extra={
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                  />
                }
              >
                <Table
                  columns={productionColumns}
                  dataSource={productionData}
                  rowKey="date"
                  pagination={{ pageSize: 10 }}
                  style={{ marginBottom: 24 }}
                />
                <ReactECharts option={comparisonChartOption} style={{ height: 350 }} />
              </Card>
            )
          },
          {
            key: 'analysis',
            label: (
              <span>
                <PieChartOutlined />
                综合分析
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                  <ReactECharts option={trendChartOption} style={{ height: 350 }} />
                </Card>
                <Card>
                  <ReactECharts option={qualityDistributionOption} style={{ height: 350 }} />
                </Card>
              </Space>
            )
          }
        ]}
      />
    </div>
  );
};

export default ReportPage;
