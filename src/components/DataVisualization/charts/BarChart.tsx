import React from 'react';
import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  option: any; // ECharts option type
  style?: React.CSSProperties;
}

const BarChart: React.FC<BarChartProps> = ({ option, style }) => {
  return <ReactECharts option={option} style={style} />;
};

export default BarChart;