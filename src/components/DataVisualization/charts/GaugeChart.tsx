import React from 'react';
import ReactECharts from 'echarts-for-react';

interface GaugeChartProps {
  option: any; // ECharts option type
  style?: React.CSSProperties;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ option, style }) => {
  return <ReactECharts option={option} style={style} />;
};

export default GaugeChart;