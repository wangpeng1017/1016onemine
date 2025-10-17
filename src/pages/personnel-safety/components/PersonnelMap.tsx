import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Switch, Button, Space, Tag, Badge } from 'antd';
import { ReloadOutlined, FullscreenOutlined, EnvironmentOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { Option } = Select;

export interface PersonnelLocation {
  id: string;
  name: string;
  department: string;
  position: [number, number];
  status: 'online' | 'offline' | 'sos';
  lastUpdate: string;
  tagId: string;
}

export interface DangerZone {
  id: string;
  name: string;
  type: 'forbidden' | 'restricted' | 'safety';
  level: 1 | 2 | 3;
  coordinates: [number, number][];
  alertRule: {
    enterAlert: boolean;
    stayDuration?: number;
  };
}

interface PersonnelMapProps {
  personnelData: PersonnelLocation[];
  dangerZones: DangerZone[];
  onPersonnelClick?: (personnel: PersonnelLocation) => void;
  showDangerZones?: boolean;
}

const PersonnelMap: React.FC<PersonnelMapProps> = ({
  personnelData,
  dangerZones,
  onPersonnelClick,
  showDangerZones = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [showZones, setShowZones] = useState(showDangerZones);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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
  }, [personnelData, dangerZones, showZones, selectedStatus]);

  const updateChart = () => {
    if (!chartInstance.current) return;

    const filteredPersonnel = selectedStatus === 'all' 
      ? personnelData 
      : personnelData.filter(p => p.status === selectedStatus);

    const series: any[] = [];

    // 危险区域图层
    if (showZones) {
      dangerZones.forEach(zone => {
        series.push({
          name: zone.name,
          type: 'line',
          data: [...zone.coordinates, zone.coordinates[0]],
          lineStyle: {
            color: getZoneColor(zone.level),
            width: 2,
            type: zone.type === 'forbidden' ? 'solid' : 'dashed'
          },
          areaStyle: {
            color: getZoneColor(zone.level),
            opacity: 0.2
          },
          symbol: 'none',
          z: 1
        });
      });
    }

    // 人员位置图层
    series.push({
      name: '人员位置',
      type: 'scatter',
      data: filteredPersonnel.map(person => ({
        name: person.name,
        value: [...person.position, person.id],
        personnelData: person,
        symbolSize: person.status === 'sos' ? 20 : 15,
        itemStyle: {
          color: getStatusColor(person.status),
          borderColor: '#fff',
          borderWidth: 2
        }
      })),
      symbol: 'pin',
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
      },
      z: 2
    });

    const option = {
      title: {
        text: '人员实时定位',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.data && params.data.personnelData) {
            const person = params.data.personnelData;
            return `
              <div style="padding: 8px;">
                <strong>${person.name}</strong><br/>
                部门: ${person.department}<br/>
                标签ID: ${person.tagId}<br/>
                状态: ${getStatusText(person.status)}<br/>
                位置: ${person.position[0].toFixed(4)}, ${person.position[1].toFixed(4)}<br/>
                更新时间: ${person.lastUpdate}
              </div>
            `;
          }
          return params.seriesName;
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
      series
    };

    chartInstance.current.setOption(option);

    // 点击事件
    chartInstance.current.off('click');
    chartInstance.current.on('click', (params: any) => {
      if (params.data && params.data.personnelData && onPersonnelClick) {
        onPersonnelClick(params.data.personnelData);
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      online: '#52c41a',
      offline: '#d9d9d9',
      sos: '#ff4d4f'
    };
    return colorMap[status] || '#1890ff';
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      online: '在线',
      offline: '离线',
      sos: 'SOS求救'
    };
    return textMap[status] || status;
  };

  const getZoneColor = (level: number) => {
    const colorMap: Record<number, string> = {
      1: '#faad14',
      2: '#ff7a45',
      3: '#ff4d4f'
    };
    return colorMap[level] || '#1890ff';
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

  const onlineCount = personnelData.filter(p => p.status === 'online').length;
  const offlineCount = personnelData.filter(p => p.status === 'offline').length;
  const sosCount = personnelData.filter(p => p.status === 'sos').length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 控制面板 */}
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
            <span style={{ marginRight: 8 }}>人员筛选:</span>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="all">全部 ({personnelData.length})</Option>
              <Option value="online">在线 ({onlineCount})</Option>
              <Option value="offline">离线 ({offlineCount})</Option>
              <Option value="sos">SOS ({sosCount})</Option>
            </Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              checked={showZones}
              onChange={setShowZones}
              size="small"
            />
            <span>显示危险区域</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Badge status="success" text={`在线: ${onlineCount}`} />
            <Badge status="default" text={`离线: ${offlineCount}`} />
            <Badge status="error" text={`SOS: ${sosCount}`} />
          </div>
        </Space>
      </Card>

      {/* 地图容器 */}
      <Card style={{ flex: 1, padding: 0 }} bodyStyle={{ height: '100%', padding: 0 }}>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '600px'
          }}
        />
      </Card>

      {/* 图例 */}
      <Card size="small" style={{ marginTop: 16 }}>
        <Space size="large" wrap>
          <span style={{ fontWeight: 'bold' }}>人员状态:</span>
          <Tag color="success">在线</Tag>
          <Tag color="default">离线</Tag>
          <Tag color="error">SOS求救</Tag>
          
          {showZones && (
            <>
              <span style={{ fontWeight: 'bold', marginLeft: 24 }}>危险区域:</span>
              <Tag color="warning">一级预警</Tag>
              <Tag color="orange">二级预警</Tag>
              <Tag color="error">三级告警</Tag>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default PersonnelMap;
