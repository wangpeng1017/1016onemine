import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Switch, Button, Space, Tag } from 'antd';
import { ReloadOutlined, FullscreenOutlined, EnvironmentOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { Option } = Select;

export type ParameterType = 'temperature' | 'humidity' | 'dust' | 'ch4' | 'co' | 'h2s' | 'o2';

export interface SensorData {
  id: string;
  name: string;
  type: ParameterType;
  location: [number, number];
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'alarm';
  timestamp: string;
}

interface EnvironmentMapProps {
  sensors: SensorData[];
  onSensorClick?: (sensor: SensorData) => void;
}

const EnvironmentMap: React.FC<EnvironmentMapProps> = ({ sensors, onSensorClick }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showAlarmOnly, setShowAlarmOnly] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    updateChart();

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    updateChart();
  }, [sensors, filterType, showAlarmOnly]);

  const updateChart = () => {
    if (!chartInstance.current) return;

    let filteredSensors = sensors;
    
    if (filterType !== 'all') {
      filteredSensors = filteredSensors.filter(s => s.type === filterType);
    }
    
    if (showAlarmOnly) {
      filteredSensors = filteredSensors.filter(s => s.status !== 'normal');
    }

    const option = {
      title: {
        text: '环境监测点分布',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.data && params.data.sensorData) {
            const sensor = params.data.sensorData;
            return `
              <div style="padding: 8px;">
                <strong>${sensor.name}</strong><br/>
                类型: ${getParameterName(sensor.type)}<br/>
                数值: ${sensor.value} ${sensor.unit}<br/>
                状态: ${getStatusText(sensor.status)}<br/>
                位置: ${sensor.location[0].toFixed(4)}, ${sensor.location[1].toFixed(4)}<br/>
                更新: ${sensor.timestamp}
              </div>
            `;
          }
          return params.name;
        }
      },
      grid: {
        left: '8%',
        right: '8%',
        top: '15%',
        bottom: '10%'
      },
      xAxis: {
        type: 'value',
        name: '经度',
        min: 87.60,
        max: 87.63,
        axisLabel: {
          formatter: '{value}°'
        }
      },
      yAxis: {
        type: 'value',
        name: '纬度',
        min: 43.78,
        max: 43.81,
        axisLabel: {
          formatter: '{value}°'
        }
      },
      series: [
        {
          name: '监测点',
          type: 'scatter',
          data: filteredSensors.map(sensor => ({
            name: sensor.name,
            value: [...sensor.location, sensor.value],
            sensorData: sensor,
            symbolSize: sensor.status === 'alarm' ? 20 : sensor.status === 'warning' ? 16 : 12,
            itemStyle: {
              color: getStatusColor(sensor.status),
              borderColor: '#fff',
              borderWidth: 2
            }
          })),
          symbol: 'circle',
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            fontSize: 10,
            color: '#333'
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    // 点击事件
    chartInstance.current.off('click');
    chartInstance.current.on('click', (params: any) => {
      if (params.data && params.data.sensorData && onSensorClick) {
        onSensorClick(params.data.sensorData);
      }
    });
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

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      normal: '正常',
      warning: '预警',
      alarm: '报警'
    };
    return textMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      normal: '#52c41a',
      warning: '#faad14',
      alarm: '#ff4d4f'
    };
    return colorMap[status] || '#1890ff';
  };

  const handleRefresh = () => {
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  };

  const handleFullscreen = () => {
    if (chartRef.current?.parentElement) {
      if (chartRef.current.parentElement.requestFullscreen) {
        chartRef.current.parentElement.requestFullscreen();
      }
    }
  };

  const normalCount = sensors.filter(s => s.status === 'normal').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;
  const alarmCount = sensors.filter(s => s.status === 'alarm').length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card 
        size="small" 
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <EnvironmentOutlined />
            地图控制
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} size="small">
              刷新
            </Button>
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} size="small">
              全屏
            </Button>
          </Space>
        }
      >
        <Space wrap>
          <div>
            <span style={{ marginRight: 8 }}>参数类型:</span>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 150 }}
              size="small"
            >
              <Option value="all">全部类型</Option>
              <Option value="temperature">温度</Option>
              <Option value="humidity">湿度</Option>
              <Option value="dust">粉尘</Option>
              <Option value="ch4">甲烷(CH4)</Option>
              <Option value="co">一氧化碳(CO)</Option>
              <Option value="h2s">硫化氢(H2S)</Option>
              <Option value="o2">氧气(O2)</Option>
            </Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              checked={showAlarmOnly}
              onChange={setShowAlarmOnly}
              size="small"
            />
            <span>仅显示异常</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Tag color="success">正常: {normalCount}</Tag>
            <Tag color="warning">预警: {warningCount}</Tag>
            <Tag color="error">报警: {alarmCount}</Tag>
          </div>
        </Space>
      </Card>

      <Card style={{ flex: 1, padding: 0 }} bodyStyle={{ height: '100%', padding: 0 }}>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '500px'
          }}
        />
      </Card>

      <Card size="small" style={{ marginTop: 16 }}>
        <Space size="large" wrap>
          <span style={{ fontWeight: 'bold' }}>状态:</span>
          <Tag color="success">正常</Tag>
          <Tag color="warning">预警</Tag>
          <Tag color="error">报警</Tag>
        </Space>
      </Card>
    </div>
  );
};

export default EnvironmentMap;
