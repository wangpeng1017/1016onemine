import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PieChartProps {
  option: any; // ECharts option type
  style?: React.CSSProperties;
}

const PieChart: React.FC<PieChartProps> = ({ option, style }) => {
  return <ReactECharts option={option} style={style} />;
};

export default PieChart;