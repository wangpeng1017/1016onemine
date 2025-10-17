import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  FireOutlined, 
  CloudOutlined, 
  ExperimentOutlined,
  ThunderboltOutlined,
  WarningOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { SensorData, ParameterType } from './EnvironmentMap';

interface ParameterDashboardProps {
  sensors: SensorData[];
  recentData?: { [key: string]: number[] };
}

const ParameterDashboard: React.FC<ParameterDashboardProps> = ({ sensors, recentData }) => {
  
  const getAverageByType = (type: ParameterType) => {
    const typeSensors = sensors.filter(s => s.type === type);
    if (typeSensors.length === 0) return 0;
    const sum = typeSensors.reduce((acc, s) => acc + s.value, 0);
    return (sum / typeSensors.length).toFixed(2);
  };

  const getStatusCountByType = (type: ParameterType) => {
    const typeSensors = sensors.filter(s => s.type === type);
    const alarm = typeSensors.filter(s => s.status === 'alarm').length;
    const warning = typeSensors.filter(s => s.status === 'warning').length;
    const normal = typeSensors.filter(s => s.status === 'normal').length;
    return { alarm, warning, normal, total: typeSensors.length };
  };

  const getThresholdPercentage = (type: ParameterType) => {
    const thresholds: Record<ParameterType, { max: number }> = {
      temperature: { max: 40 },
      humidity: { max: 100 },
      dust: { max: 100 },
      ch4: { max: 1 },
      co: { max: 30 },
      h2s: { max: 10 },
      o2: { max: 23 }
    };
    
    const avg = parseFloat(getAverageByType(type));
    const max = thresholds[type].max;
    return Math.min((avg / max) * 100, 100);
  };

  const getProgressStatus = (percentage: number): "success" | "exception" | "normal" => {
    if (percentage >= 80) return 'exception';
    if (percentage >= 60) return 'normal';
    return 'success';
  };

  // 实时曲线图配置
  const getRealtimeChartOption = (type: ParameterType, unit: string) => {
    const data = recentData?.[type] || Array(20).fill(0).map(() => Math.random() * 100);
    const timeLabels = Array(20).fill(0).map((_, i) => `${i}s`);

    return {
      title: {
        text: getParameterName(type),
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: `{b}: {c} ${unit}`
      },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: `{value}${unit}` }
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
              ]
            }
          }
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '20%',
        bottom: '15%'
      }
    };
  };

  const getParameterName = (type: ParameterType) => {
    const nameMap: Record<ParameterType, string> = {
      temperature: '温度',
      humidity: '湿度',
      dust: '粉尘',
      ch4: '甲烷(CH4)',
      co: '一氧化碳(CO)',
      h2s: '硫化氢(H2S)',
      o2: '氧气(O2)'
    };
    return nameMap[type];
  };

  const getParameterIcon = (type: ParameterType) => {
    const iconMap: Record<ParameterType, React.ReactNode> = {
      temperature: <FireOutlined />,
      humidity: <CloudOutlined />,
      dust: <ExperimentOutlined />,
      ch4: <ThunderboltOutlined />,
      co: <WarningOutlined />,
      h2s: <ExperimentOutlined />,
      o2: <CloudOutlined />
    };
    return iconMap[type];
  };

  const getUnit = (type: ParameterType) => {
    const unitMap: Record<ParameterType, string> = {
      temperature: '°C',
      humidity: '%',
      dust: 'mg/m³',
      ch4: '%',
      co: 'ppm',
      h2s: 'ppm',
      o2: '%'
    };
    return unitMap[type];
  };

  const mainParameters: ParameterType[] = ['temperature', 'humidity', 'dust', 'ch4'];
  const gasParameters: ParameterType[] = ['co', 'h2s', 'o2'];

  return (
    <div>
      {/* 主要参数统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {mainParameters.map(type => {
          const status = getStatusCountByType(type);
          const percentage = getThresholdPercentage(type);
          
          return (
            <Col span={6} key={type}>
              <Card>
                <Statistic
                  title={getParameterName(type)}
                  value={getAverageByType(type)}
                  suffix={getUnit(type)}
                  prefix={getParameterIcon(type)}
                  valueStyle={{ 
                    color: status.alarm > 0 ? '#ff4d4f' : status.warning > 0 ? '#faad14' : '#52c41a' 
                  }}
                />
                <Progress
                  percent={percentage}
                  status={getProgressStatus(percentage)}
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  {status.total} 个监测点 | 异常: {status.alarm + status.warning}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 气体参数统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {gasParameters.map(type => {
          const status = getStatusCountByType(type);
          const percentage = getThresholdPercentage(type);
          
          return (
            <Col span={8} key={type}>
              <Card size="small">
                <Statistic
                  title={getParameterName(type)}
                  value={getAverageByType(type)}
                  suffix={getUnit(type)}
                  prefix={getParameterIcon(type)}
                  valueStyle={{ 
                    fontSize: 20,
                    color: status.alarm > 0 ? '#ff4d4f' : status.warning > 0 ? '#faad14' : '#52c41a' 
                  }}
                />
                <Progress
                  percent={percentage}
                  status={getProgressStatus(percentage)}
                  showInfo={false}
                  size="small"
                  style={{ marginTop: 8 }}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  监测点: {status.total} | 异常: {status.alarm + status.warning}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 实时曲线图 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <ReactECharts 
              option={getRealtimeChartOption('temperature', '°C')} 
              style={{ height: 250 }} 
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts 
              option={getRealtimeChartOption('ch4', '%')} 
              style={{ height: 250 }} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ParameterDashboard;
