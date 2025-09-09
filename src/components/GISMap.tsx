import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Switch, Slider, Button, Space } from 'antd';
import { BarsOutlined, FullscreenOutlined, ReloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { Option } = Select;

interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  visible: boolean;
  opacity: number;
  url?: string;
}

interface MonitoringPoint {
  id: string;
  name: string;
  type: 'gnss' | 'crack' | 'pressure' | 'water' | 'vibration' | 'rain' | 'radar';
  coordinates: [number, number];
  status: 'normal' | 'warning' | 'alarm';
  value: number;
  unit: string;
}

const GISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('satellite');
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'satellite', name: '卫星影像', type: 'base', visible: true, opacity: 1 },
    { id: 'terrain', name: '地形图', type: 'base', visible: false, opacity: 1 },
    { id: 'monitoring', name: '监测点位', type: 'overlay', visible: true, opacity: 0.8 },
    { id: 'risk_zones', name: '风险区域', type: 'overlay', visible: true, opacity: 0.6 },
    { id: 'slope_boundary', name: '边坡边界', type: 'overlay', visible: false, opacity: 0.7 },
  ]);

  // 模拟监测点数据
  const monitoringPoints: MonitoringPoint[] = [
    { id: 'GNSS-001', name: 'GNSS监测点1', type: 'gnss', coordinates: [87.6177, 43.7928], status: 'normal', value: 2.3, unit: 'mm' },
    { id: 'GNSS-002', name: 'GNSS监测点2', type: 'gnss', coordinates: [87.6200, 43.7950], status: 'warning', value: 8.5, unit: 'mm' },
    { id: 'GNSS-003', name: 'GNSS监测点3', type: 'gnss', coordinates: [87.6150, 43.7900], status: 'alarm', value: 15.2, unit: 'mm' },
    { id: 'CG-001', name: '裂缝计1', type: 'crack', coordinates: [87.6180, 43.7920], status: 'normal', value: 1.2, unit: 'mm' },
    { id: 'EP-001', name: '土压力计1', type: 'pressure', coordinates: [87.6160, 43.7940], status: 'warning', value: 125.6, unit: 'kPa' },
    { id: 'RD-001', name: '雷达监测1', type: 'radar', coordinates: [87.6190, 43.7910], status: 'normal', value: 3.2, unit: 'mm' },
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    // 初始化ECharts地图
    const chart = echarts.init(mapRef.current);
    chartRef.current = chart;

    // 配置地图选项
    const option = {
      title: {
        text: '矿山监测GIS地图',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.data && params.data.pointData) {
            const point = params.data.pointData;
            return `
              <div style="padding: 8px;">
                <strong>${point.name}</strong><br/>
                类型: ${getPointTypeName(point.type)}<br/>
                状态: ${getStatusName(point.status)}<br/>
                数值: ${point.value} ${point.unit}<br/>
                坐标: ${point.coordinates[0].toFixed(4)}, ${point.coordinates[1].toFixed(4)}
              </div>
            `;
          }
          return params.name;
        }
      },
      geo: {
        map: 'china',
        center: [87.6177, 43.7928], // 乌鲁木齐附近坐标
        zoom: 12,
        roam: true,
        itemStyle: {
          areaColor: '#f0f0f0',
          borderColor: '#999',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: '#e0e0e0'
          }
        }
      },
      series: [
        {
          name: '监测点位',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: monitoringPoints.map(point => ({
            name: point.name,
            value: [...point.coordinates, point.value],
            pointData: point,
            symbolSize: getSymbolSize(point.status),
            itemStyle: {
              color: getStatusColor(point.status),
              borderColor: '#fff',
              borderWidth: 2
            }
          })),
          symbol: 'circle',
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 10,
            color: '#333'
          }
        }
      ]
    };

    chart.setOption(option);

    // 监听点击事件
    chart.on('click', (params: any) => {
      if (params.data && params.data.pointData) {
        handlePointClick(params.data.pointData);
      }
    });

    // 响应式处理
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  const getPointTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      gnss: 'GNSS位移',
      crack: '裂缝计',
      pressure: '土压力',
      water: '地下水',
      vibration: '爆破振动',
      rain: '雨量计',
      radar: '雷达监测'
    };
    return typeMap[type] || type;
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      normal: '正常',
      warning: '预警',
      alarm: '告警'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      normal: '#52c41a',
      warning: '#faad14',
      alarm: '#ff4d4f'
    };
    return colorMap[status] || '#1890ff';
  };

  const getSymbolSize = (status: string) => {
    const sizeMap: Record<string, number> = {
      normal: 8,
      warning: 12,
      alarm: 16
    };
    return sizeMap[status] || 8;
  };

  const handlePointClick = (point: MonitoringPoint) => {
    console.log('点击监测点:', point);
    // 这里可以添加跳转到详细页面的逻辑
  };

  const handleLayerToggle = (layerId: string, visible: boolean) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible } : layer
    ));
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity: opacity / 100 } : layer
    ));
  };

  const handleRefresh = () => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  };

  const handleFullscreen = () => {
    if (mapRef.current) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 地图控制面板 */}
      <Card 
        size="small" 
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <BarsOutlined />
            地图控制
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen}>
              全屏
            </Button>
          </Space>
        }
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ marginRight: 8 }}>底图:</span>
            <Select
              value={selectedLayer}
              onChange={setSelectedLayer}
              style={{ width: 120 }}
            >
              {layers.filter(layer => layer.type === 'base').map(layer => (
                <Option key={layer.id} value={layer.id}>
                  {layer.name}
                </Option>
              ))}
            </Select>
          </div>
          
          {layers.filter(layer => layer.type === 'overlay').map(layer => (
            <div key={layer.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch
                checked={layer.visible}
                onChange={(checked) => handleLayerToggle(layer.id, checked)}
                size="small"
              />
              <span style={{ minWidth: 60 }}>{layer.name}</span>
              {layer.visible && (
                <Slider
                  min={0}
                  max={100}
                  value={layer.opacity * 100}
                  onChange={(value) => handleOpacityChange(layer.id, value)}
                  style={{ width: 80 }}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 地图容器 */}
      <Card style={{ flex: 1, padding: 0 }}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
          }}
        />
      </Card>

      {/* 图例 */}
      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>图例:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: '#52c41a',
              border: '2px solid #fff'
            }} />
            <span>正常</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#faad14',
              border: '2px solid #fff'
            }} />
            <span>预警</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              backgroundColor: '#ff4d4f',
              border: '2px solid #fff'
            }} />
            <span>告警</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GISMap;
