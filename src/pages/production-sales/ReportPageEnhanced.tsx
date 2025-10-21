import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Select, DatePicker, Space, Tag, Statistic, message, Tabs } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, BarChartOutlined, LineChartOutlined, DatabaseOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { salesPlanService, siloService, tempPileService, dashboardService } from '../../services/productionSalesMockService';
import type { SalesPlan, Silo, TemporaryCoalPile, SalesDashboard } from '../../types/productionSales';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ReportData {
  period: string;
  salesVolume: number;
  salesRevenue: number;
  inventoryVolume: number;
  inventoryValue: number;
  productionVolume?: number;
}

const ReportPageEnhanced: React.FC = () => {
  const [salesPlans, setSalesPlans] = useState<SalesPlan[]>([]);
  const [silos, setSilos] = useState<Silo[]>([]);
  const [tempPiles, setTempPiles] = useState<TemporaryCoalPile[]>([]);
  const [dashboard, setDashboard] = useState<SalesDashboard | null>(null);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'month'),
    dayjs()
  ]);
  const [selectedCoalType, setSelectedCoalType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSalesPlans(salesPlanService.getAll());
    setSilos(siloService.getAll());
    setTempPiles(tempPileService.getAll());
    setDashboard(dashboardService.getDashboard());
  };

  // 生成报表数据
  const generateReportData = (): ReportData[] => {
    const data: ReportData[] = [];
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    
    // 根据报表类型生成不同周期的数据
    let currentDate = startDate.clone();
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      let period = '';
      if (reportType === 'daily') {
        period = currentDate.format('YYYY-MM-DD');
      } else if (reportType === 'weekly') {
        period = `${currentDate.format('YYYY')}年第${currentDate.week()}周`;
      } else {
        period = currentDate.format('YYYY-MM');
      }

      // 计算该周期内的销售和库存数据
      const filteredSales = salesPlans.filter(s => {
        const planDate = dayjs(s.planDate);
        if (reportType === 'daily') {
          return planDate.isSame(currentDate, 'day');
        } else if (reportType === 'weekly') {
          return planDate.week() === currentDate.week() && planDate.year() === currentDate.year();
        } else {
          return planDate.month() === currentDate.month() && planDate.year() === currentDate.year();
        }
      });

      const salesVolume = filteredSales.reduce((sum, s) => sum + s.plannedVolume, 0);
      const salesRevenue = filteredSales.reduce((sum, s) => sum + s.estimatedRevenue, 0);

      // 获取该周期末的库存数据（筒仓 + 临时堆煤）
      const siloVolume = silos.reduce((sum, s) => sum + s.currentVolume, 0);
      const tempPileVolume = tempPiles.reduce((sum, p) => sum + p.volume, 0);
      const inventoryVolume = siloVolume + tempPileVolume;
      // 假设平均单价500元/吨
      const inventoryValue = inventoryVolume * 500;

      data.push({
        period,
        salesVolume: parseFloat(salesVolume.toFixed(2)),
        salesRevenue: parseFloat(salesRevenue.toFixed(2)),
        inventoryVolume: parseFloat(inventoryVolume.toFixed(2)),
        inventoryValue: parseFloat(inventoryValue.toFixed(2)),
        productionVolume: salesVolume * (0.9 + Math.random() * 0.2) // 模拟生产量
      });

      // 移动到下一个周期
      if (reportType === 'daily') {
        currentDate = currentDate.add(1, 'day');
      } else if (reportType === 'weekly') {
        currentDate = currentDate.add(1, 'week');
      } else {
        currentDate = currentDate.add(1, 'month');
      }
    }

    return data;
  };

  const reportData = generateReportData();

  // 存量报表列定义（筒仓）
  const siloReportColumns = [
    { title: '筒仓名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '当前料位(m)', dataIndex: 'currentLevel', key: 'currentLevel', width: 120, render: (v: number) => v.toFixed(2) },
    { title: '当前存煤(吨)', dataIndex: 'currentVolume', key: 'currentVolume', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '总容量(吨)', dataIndex: 'capacity', key: 'capacity', width: 120, render: (v: number) => v.toLocaleString() },
    { 
      title: '容量使用率', 
      key: 'utilizationRate', 
      width: 120,
      render: (_: any, record: Silo) => {
        const rate = (record.currentVolume / record.capacity * 100).toFixed(1);
        return <Tag color={parseFloat(rate) > 90 ? 'red' : parseFloat(rate) > 70 ? 'orange' : 'green'}>{rate}%</Tag>;
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: Silo['status']) => {
        const colorMap = { normal: 'green', high_warning: 'red', low_warning: 'orange' };
        const textMap = { normal: '正常', high_warning: '高位预警', low_warning: '低位预警' };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      }
    },
    { title: '更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate', width: 150 }
  ];

  // 临时堆煤报表列定义
  const tempPileReportColumns = [
    { title: '煤堆编号', dataIndex: 'pileNumber', key: 'pileNumber', width: 120 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
    { title: '数量(吨)', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '盘点日期', dataIndex: 'inventoryDate', key: 'inventoryDate', width: 120 },
    { title: '盘点人', dataIndex: 'inspector', key: 'inspector', width: 100 },
    { 
      title: '预计出场', 
      dataIndex: 'expectedOutbound', 
      key: 'expectedOutbound', 
      width: 120,
      render: (date: string) => date || '-'
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: TemporaryCoalPile) => {
        if (!record.expectedOutbound) return <Tag>待定</Tag>;
        const isOverdue = dayjs().isAfter(dayjs(record.expectedOutbound));
        return <Tag color={isOverdue ? 'red' : 'green'}>{isOverdue ? '超期' : '正常'}</Tag>;
      }
    }
  ];

  // 销量报表列定义
  const salesReportColumns = [
    { title: '周期', dataIndex: 'period', key: 'period', width: 150 },
    { title: '销售量(吨)', dataIndex: 'salesVolume', key: 'salesVolume', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '销售额(元)', dataIndex: 'salesRevenue', key: 'salesRevenue', width: 150, render: (v: number) => '¥' + v.toLocaleString() },
    { 
      title: '平均单价(元/吨)', 
      key: 'avgPrice', 
      width: 120,
      render: (_: any, record: ReportData) => 
        record.salesVolume > 0 ? '¥' + (record.salesRevenue / record.salesVolume).toFixed(2) : '-'
    }
  ];

  // 综合报表列定义
  const comprehensiveReportColumns = [
    { title: '周期', dataIndex: 'period', key: 'period', width: 120 },
    { title: '生产量(吨)', dataIndex: 'productionVolume', key: 'productionVolume', width: 100, render: (v: number) => v?.toFixed(0) || '-' },
    { title: '销售量(吨)', dataIndex: 'salesVolume', key: 'salesVolume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '库存量(吨)', dataIndex: 'inventoryVolume', key: 'inventoryVolume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '销售额(元)', dataIndex: 'salesRevenue', key: 'salesRevenue', width: 120, render: (v: number) => '¥' + v.toLocaleString() },
    { title: '库存价值(元)', dataIndex: 'inventoryValue', key: 'inventoryValue', width: 120, render: (v: number) => '¥' + v.toLocaleString() }
  ];

  // 销售趋势图表
  const salesTrendChart = {
    title: { text: '销售趋势分析', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售量', '销售额'], bottom: 10 },
    xAxis: { type: 'category', data: reportData.map(d => d.period), axisLabel: { rotate: 45 } },
    yAxis: [
      { type: 'value', name: '销售量(吨)', position: 'left' },
      { type: 'value', name: '销售额(元)', position: 'right' }
    ],
    series: [
      { 
        name: '销售量', 
        type: 'bar', 
        data: reportData.map(d => d.salesVolume),
        itemStyle: { color: '#1890ff' },
        yAxisIndex: 0
      },
      { 
        name: '销售额', 
        type: 'line', 
        data: reportData.map(d => d.salesRevenue),
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1,
        smooth: true
      }
    ],
    grid: { left: '10%', right: '10%', bottom: '20%', top: '15%' }
  };

  // 库存趋势图表
  const inventoryTrendChart = {
    title: { text: '库存趋势分析', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['库存量', '库存价值'], bottom: 10 },
    xAxis: { type: 'category', data: reportData.map(d => d.period), axisLabel: { rotate: 45 } },
    yAxis: [
      { type: 'value', name: '库存量(吨)', position: 'left' },
      { type: 'value', name: '库存价值(元)', position: 'right' }
    ],
    series: [
      { 
        name: '库存量', 
        type: 'line', 
        data: reportData.map(d => d.inventoryVolume),
        itemStyle: { color: '#faad14' },
        yAxisIndex: 0,
        smooth: true,
        areaStyle: { opacity: 0.3 }
      },
      { 
        name: '库存价值', 
        type: 'line', 
        data: reportData.map(d => d.inventoryValue),
        itemStyle: { color: '#ff4d4f' },
        yAxisIndex: 1,
        smooth: true
      }
    ],
    grid: { left: '10%', right: '10%', bottom: '20%', top: '15%' }
  };

  // 产销存对比图表
  const productionSalesInventoryChart = {
    title: { text: '产销存对比分析', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['生产量', '销售量', '库存量'], bottom: 10 },
    xAxis: { type: 'category', data: reportData.map(d => d.period), axisLabel: { rotate: 45 } },
    yAxis: { type: 'value', name: '数量(吨)' },
    series: [
      { 
        name: '生产量', 
        type: 'bar', 
        data: reportData.map(d => d.productionVolume),
        itemStyle: { color: '#1890ff' }
      },
      { 
        name: '销售量', 
        type: 'bar', 
        data: reportData.map(d => d.salesVolume),
        itemStyle: { color: '#52c41a' }
      },
      { 
        name: '库存量', 
        type: 'line', 
        data: reportData.map(d => d.inventoryVolume),
        itemStyle: { color: '#faad14' },
        smooth: true
      }
    ],
    grid: { left: '10%', right: '5%', bottom: '20%', top: '15%' }
  };

  // 导出为Excel
  const handleExportExcel = (type: 'inventory' | 'sales' | 'comprehensive') => {
    let data: any[] = [];
    let filename = '';
    
    if (type === 'inventory') {
      // 合并筒仓和临时堆煤数据
      const siloData = silos.map(s => ({
        type: '筒仓',
        name: s.name,
        volume: s.currentVolume,
        capacity: s.capacity,
        status: s.status
      }));
      const tempPileData = tempPiles.map(p => ({
        type: '临时堆煤',
        name: p.pileNumber,
        location: p.location,
        volume: p.volume,
        inspector: p.inspector
      }));
      data = [...siloData, ...tempPileData];
      filename = `存量报表_${dayjs().format('YYYYMMDD')}.csv`;
    } else if (type === 'sales') {
      data = reportData;
      filename = `销量报表_${dateRange[0].format('YYYYMMDD')}_${dateRange[1].format('YYYYMMDD')}.csv`;
    } else {
      data = reportData;
      filename = `产存销报表_${dateRange[0].format('YYYYMMDD')}_${dateRange[1].format('YYYYMMDD')}.csv`;
    }

    // 简单CSV导出
    const csvContent = convertToCSV(data);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    message.success('Excel报表已导出');
  };

  // 导出为PDF
  const handleExportPDF = () => {
    message.info('PDF导出功能开发中，可通过浏览器打印功能转换为PDF');
    window.print();
  };

  // 简单的CSV转换
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  // 计算汇总统计
  const totalSiloVolume = silos.reduce((sum, s) => sum + s.currentVolume, 0);
  const totalTempPileVolume = tempPiles.reduce((sum, p) => sum + p.volume, 0);
  const totalInventory = totalSiloVolume + totalTempPileVolume;
  
  const summaryStats = {
    totalSales: reportData.reduce((sum, d) => sum + d.salesVolume, 0),
    totalRevenue: reportData.reduce((sum, d) => sum + d.salesRevenue, 0),
    totalInventory,
    totalInventoryValue: totalInventory * 500, // 假设平均单价500元/吨
    avgSalesVolume: reportData.length > 0 ? reportData.reduce((sum, d) => sum + d.salesVolume, 0) / reportData.length : 0,
    avgRevenue: reportData.length > 0 ? reportData.reduce((sum, d) => sum + d.salesRevenue, 0) / reportData.length : 0
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title="产存销报表分析"
        extra={
          <Space>
            <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
              <Option value="daily">日报</Option>
              <Option value="weekly">周报</Option>
              <Option value="monthly">月报</Option>
            </Select>
            <RangePicker 
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
            <Select value={selectedCoalType} onChange={setSelectedCoalType} style={{ width: 120 }}>
              <Option value="all">全部煤种</Option>
              <Option value="焦煤">焦煤</Option>
              <Option value="动力煤">动力煤</Option>
              <Option value="无烟煤">无烟煤</Option>
            </Select>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="累计销售量" 
                value={summaryStats.totalSales.toFixed(0)} 
                suffix="吨"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                日均: {summaryStats.avgSalesVolume.toFixed(1)}吨
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="累计销售额" 
                value={summaryStats.totalRevenue.toFixed(0)} 
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                日均: ¥{summaryStats.avgRevenue.toFixed(0)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="当前库存量" 
                value={summaryStats.totalInventory.toFixed(0)} 
                suffix="吨"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="库存总价值" 
                value={summaryStats.totalInventoryValue.toFixed(0)} 
                prefix="¥"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="inventory"
        items={[
          {
            key: 'inventory',
            label: (
              <span>
                <DatabaseOutlined />
                存量报表
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card
                  title="筒仓库存报表"
                  extra={
                    <Space>
                      <Button icon={<FileExcelOutlined />} onClick={() => handleExportExcel('inventory')}>
                        导出Excel
                      </Button>
                      <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                        导出PDF
                      </Button>
                    </Space>
                  }
                >
                  <Table 
                    columns={siloReportColumns} 
                    dataSource={silos} 
                    rowKey="id" 
                    pagination={false}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
                          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            {silos.reduce((sum, s) => sum + s.currentVolume, 0).toFixed(1)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            {silos.reduce((sum, s) => sum + s.capacity, 0).toLocaleString()}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </Card>
                <Card
                  title="临时堆煤报表"
                  extra={
                    <Space>
                      <Button icon={<FileExcelOutlined />} onClick={() => handleExportExcel('inventory')}>
                        导出Excel
                      </Button>
                    </Space>
                  }
                >
                  <Table 
                    columns={tempPileReportColumns} 
                    dataSource={tempPiles} 
                    rowKey="id" 
                    pagination={false}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
                          <Table.Summary.Cell index={0} colSpan={2}>合计</Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            {tempPiles.reduce((sum, p) => sum + p.volume, 0).toFixed(1)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </Card>
                <Card>
                  <ReactECharts option={inventoryTrendChart} style={{ height: 350 }} />
                </Card>
              </Space>
            )
          },
          {
            key: 'sales',
            label: (
              <span>
                <LineChartOutlined />
                销量报表
              </span>
            ),
            children: (
              <Card
                title="销售统计报表"
                extra={
                  <Space>
                    <Button icon={<FileExcelOutlined />} onClick={() => handleExportExcel('sales')}>
                      导出Excel
                    </Button>
                    <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                      导出PDF
                    </Button>
                  </Space>
                }
              >
                <Table 
                  columns={salesReportColumns} 
                  dataSource={reportData} 
                  rowKey="period" 
                  pagination={{ pageSize: 10 }}
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
                        <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          {reportData.reduce((sum, d) => sum + d.salesVolume, 0).toLocaleString()}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          ¥{reportData.reduce((sum, d) => sum + d.salesRevenue, 0).toLocaleString()}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          ¥{(reportData.reduce((sum, d) => sum + d.salesRevenue, 0) / 
                            reportData.reduce((sum, d) => sum + d.salesVolume, 0)).toFixed(2)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
                <div style={{ marginTop: 24 }}>
                  <ReactECharts option={salesTrendChart} style={{ height: 350 }} />
                </div>
              </Card>
            )
          },
          {
            key: 'comprehensive',
            label: (
              <span>
                <BarChartOutlined />
                产存销综合
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card
                  title="产存销综合报表"
                  extra={
                    <Space>
                      <Button icon={<FileExcelOutlined />} onClick={() => handleExportExcel('comprehensive')}>
                        导出Excel
                      </Button>
                      <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                        导出PDF
                      </Button>
                    </Space>
                  }
                >
                  <Table 
                    columns={comprehensiveReportColumns} 
                    dataSource={reportData} 
                    rowKey="period" 
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
                <Card>
                  <ReactECharts option={productionSalesInventoryChart} style={{ height: 400 }} />
                </Card>
              </Space>
            )
          }
        ]}
      />
    </div>
  );
};

export default ReportPageEnhanced;
