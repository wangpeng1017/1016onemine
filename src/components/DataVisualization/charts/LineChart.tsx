import React from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  option: any; // ECharts option type
  style?: React.CSSProperties;
}

const LineChart: React.FC<LineChartProps> = ({ option, style }) => {
  return <ReactECharts option={option} style={style} />;
};

export default LineChart;