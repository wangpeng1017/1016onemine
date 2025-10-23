import React from 'react';
import { Row, Space, Button } from 'antd';
import KpiCard from './charts/KpiCard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import GaugeChart from './charts/GaugeChart';

const DataDashboard: React.FC = () => {
  // KPI 指标卡数据
  const kpiData = {
    totalOutput: '12,345 吨',
    dailyAverage: '1,234 吨',
    safetyIncidents: '0',
  };

  // 折线图数据
  const lineChartOption = {
    title: {
      text: '月度产量趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    },
    yAxis: {
      type: 'value',
      name: '产量 (吨)',
    },
    series: [
      {
        name: '产量',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230],
      },
    ],
  };

  // 柱状图数据
  const barChartOption = {
    title: {
      text: '各矿区产量对比',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: ['矿区A', '矿区B', '矿区C', '矿区D'],
    },
    yAxis: {
      type: 'value',
      name: '产量 (吨)',
    },
    series: [
      {
        name: '产量',
        type: 'bar',
        data: [150, 230, 224, 218],
      },
    ],
  };

  // 饼图数据
  const pieChartOption = {
    title: {
      text: '设备故障类型占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '故障类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '机械故障' },
          { value: 735, name: '电气故障' },
          { value: 580, name: '系统故障' },
          { value: 484, name: '操作失误' },
          { value: 300, name: '其他' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 仪表盘数据
  const gaugeChartOption = {
    title: {
      text: '设备运行健康度',
      left: 'center',
    },
    series: [
      {
        type: 'gauge',
        axisLine: {
          lineStyle: {
            width: 10,
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -10,
          length: 5,
          lineStyle: {
            color: '#fff',
          },
        },
        splitLine: {
          distance: -15,
          length: 10,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        axisLabel: {
          color: 'auto',
          distance: 20,
          fontSize: 10,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} %',
          color: 'auto',
        },
        data: [
          {
            value: 75,
            name: '健康度',
          },
        ],
      },
    ],
  };

  // 模拟的统计数据，用于导出 Excel
  const mockExportData = [
    { 日期: '2023-01-01', 指标A: 100, 指标B: 200, 指标C: 150 },
    { 日期: '2023-01-02', 指标A: 120, 指标B: 220, 指标C: 160 },
    { 日期: '2023-01-03', 指标A: 110, 指标B: 210, 指标C: 155 },
    { 日期: '2023-01-04', 指标A: 130, 指标B: 230, 指标C: 165 },
    { 日期: '2023-01-05', 指标A: 140, 指标B: 240, 指标C: 170 },
  ];

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(mockExportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '统计报表');

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const filename = `智慧矿山数据报表_${year}${month}${day}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleExportExcel}>
            导出 Excel
          </Button>
        </Row>

        {/* KPI 指标卡 */}
        <Row gutter={16}>
          <KpiCard title="总产量" value={kpiData.totalOutput} />
          <KpiCard title="日均产量" value={kpiData.dailyAverage} />
          <KpiCard title="安全事故" value={kpiData.safetyIncidents} color="green" />
        </Row>

        {/* 折线图 */}
        <LineChart option={lineChartOption} style={{ height: 400 }} />

        {/* 柱状图 */}
        <BarChart option={barChartOption} style={{ height: 400 }} />

        <Row gutter={16}>
          {/* 饼图 */}
          <PieChart option={pieChartOption} style={{ height: 400 }} />
          {/* 仪表盘 */}
          <GaugeChart option={gaugeChartOption} style={{ height: 400 }} />
        </Row>
      </Space>
    </div>
  );
};

export default DataDashboard;