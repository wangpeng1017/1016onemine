import React from 'react';
import { Card, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';

interface GaugeCardProps {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
}

const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  value,
  max = 100,
  unit = '',
  icon,
  color = '#1890ff'
}) => {
  const percentage = (value / max) * 100;
  
  const getStatusColor = () => {
    if (percentage >= 80) return '#ff4d4f';
    if (percentage >= 60) return '#faad14';
    return '#52c41a';
  };

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max,
        splitNumber: 5,
        center: ['50%', '75%'],
        radius: '90%',
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.6, '#52c41a'],
              [0.8, '#faad14'],
              [1, '#ff4d4f']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '55%',
          width: 6,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: color
          }
        },
        axisTick: {
          length: 8,
          lineStyle: {
            color: 'auto',
            width: 1
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 10,
          distance: -35,
          formatter: (value: number) => {
            if (value === max) return max.toString();
            if (value === 0) return '0';
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-15%'],
          fontSize: 14
        },
        detail: {
          fontSize: 24,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: `{value} ${unit}`,
          color: 'auto'
        },
        data: [{ value, name: title }]
      }
    ]
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        {icon && <span style={{ fontSize: 24, marginRight: 8 }}>{icon}</span>}
        <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
      </div>
      <ReactECharts option={option} style={{ height: 180 }} />
      <div style={{ textAlign: 'center', marginTop: -8 }}>
        <Statistic
          value={value}
          suffix={unit}
          valueStyle={{ fontSize: 20, color: getStatusColor() }}
        />
      </div>
    </Card>
  );
};

export default GaugeCard;
