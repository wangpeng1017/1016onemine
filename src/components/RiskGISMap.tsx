import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Switch, Slider, Button, Space, Checkbox } from 'antd';
import { BarsOutlined, FullscreenOutlined, ReloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

interface RiskPoint {
  coordinates: [number, number];
  value: number;
  design_value?: number;
  elevation?: number;
}

interface RiskLayer {
  id: string;
  name: string;
  type: 'deformation' | 'overstep' | 'morphology';
  risk_level: 1 | 2 | 3 | 4;
  boundary?: string; // WKT字符串
  points: RiskPoint[];
  visible: boolean;
  opacity: number;
}

interface RiskGISMapProps {
  layers: RiskLayer[];
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onPointClick?: (point: RiskPoint, layer: RiskLayer) => void;
}

const RiskGISMap: React.FC<RiskGISMapProps> = ({
  layers,
  onLayerVisibilityChange,
  onLayerOpacityChange,
  onPointClick
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [controlPanelVisible, setControlPanelVisible] = useState(true);

  // 风险等级颜色映射
  const getRiskColor = (level: number, opacity: number = 1) => {
    const colors = {
      1: `rgba(255, 0, 0, ${opacity})`, // 红色
      2: `rgba(255, 165, 0, ${opacity})`, // 橙色
      3: `rgba(255, 255, 0, ${opacity})`, // 黄色
      4: `rgba(0, 0, 255, ${opacity})` // 蓝色
    };
    return colors[level as keyof typeof colors] || `rgba(128, 128, 128, ${opacity})`;
  };

  // 解析WKT字符串为坐标数组（简化版）
  const parseWKT = (wkt: string): number[][] => {
    try {
      // 简单的多边形WKT解析
      const match = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i);
      if (match) {
        const coordsStr = match[1];
        return coordsStr.split(',').map(coord => {
          const [lng, lat] = coord.trim().split(/\s+/).map(Number);
          return [lng, lat];
        });
      }
      return [];
    } catch (error) {
      console.warn('WKT解析失败:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);
    setChart(chartInstance);

    const updateChart = () => {
      const series: any[] = [];

      // 为每个图层创建系列
      layers.forEach(layer => {
        if (!layer.visible) return;

        // 添加风险区域多边形
        if (layer.boundary) {
          const coords = parseWKT(layer.boundary);
          if (coords.length > 0) {
            series.push({
              name: `${layer.name}-区域`,
              type: 'lines',
              coordinateSystem: 'cartesian2d',
              data: coords.map((coord, index) => ({
                coords: [coord, coords[(index + 1) % coords.length]]
              })),
              lineStyle: {
                color: getRiskColor(layer.risk_level, layer.opacity),
                width: 2
              },
              silent: true
            });

            // 添加填充区域
            series.push({
              name: `${layer.name}-填充`,
              type: 'custom',
              coordinateSystem: 'cartesian2d',
              renderItem: (params: any, api: any) => {
                const points = coords.map(coord => api.coord(coord));
                return {
                  type: 'polygon',
                  shape: {
                    points: points
                  },
                  style: {
                    fill: getRiskColor(layer.risk_level, layer.opacity * 0.3),
                    stroke: getRiskColor(layer.risk_level, layer.opacity),
                    lineWidth: 1
                  }
                };
              },
              data: [0],
              silent: true
            });
          }
        }

        // 添加风险点位
        if (layer.points.length > 0) {
          series.push({
            name: `${layer.name}-点位`,
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data: layer.points.map(point => ({
              name: `${layer.name}-${point.coordinates.join(',')}`,
              value: [...point.coordinates, point.value],
              pointData: point,
              layerData: layer,
              symbolSize: layer.type === 'morphology' && point.design_value && point.value > point.design_value ? 15 : 10
            })),
            itemStyle: {
              color: getRiskColor(layer.risk_level, layer.opacity),
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: getRiskColor(layer.risk_level, 0.8)
              }
            }
          });
        }
      });

      const option = {
        title: {
          text: '矿山空天风险监测GIS视图',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.data && params.data.pointData && params.data.layerData) {
              const point = params.data.pointData;
              const layer = params.data.layerData;
              let content = `
                <div style="padding: 8px;">
                  <strong>${layer.name}</strong><br/>
                  风险等级: ${['', '红色(1级)', '橙色(2级)', '黄色(3级)', '蓝色(4级)'][layer.risk_level]}<br/>
                  坐标: ${point.coordinates[0].toFixed(4)}, ${point.coordinates[1].toFixed(4)}<br/>
                  数值: ${point.value}
              `;
              if (point.design_value !== undefined) {
                content += `<br/>设计值: ${point.design_value}`;
                if (point.value > point.design_value) {
                  content += `<br/><span style="color: red;">⚠️ 超限</span>`;
                }
              }
              if (point.elevation !== undefined) {
                content += `<br/>高程: ${point.elevation}m`;
              }
              content += '</div>';
              return content;
            }
            return params.name;
          }
        },
        grid: {
          left: '10%',
          right: controlPanelVisible ? '25%' : '10%',
          top: '15%',
          bottom: '10%'
        },
        xAxis: {
          type: 'value',
          name: '经度',
          min: 87.5,
          max: 87.7,
          axisLabel: {
            formatter: '{value}°'
          }
        },
        yAxis: {
          type: 'value',
          name: '纬度',
          min: 43.75,
          max: 43.85,
          axisLabel: {
            formatter: '{value}°'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            yAxisIndex: [0]
          },
          {
            type: 'slider',
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            yAxisIndex: [0],
            orient: 'vertical'
          }
        ],
        series: series
      };

      chartInstance.setOption(option, true);
    };

    updateChart();

    // 监听点击事件
    const handleClick = (params: any) => {
      if (params.data && params.data.pointData && params.data.layerData && onPointClick) {
        onPointClick(params.data.pointData, params.data.layerData);
      }
    };

    chartInstance.on('click', handleClick);

    // 响应式处理
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chartInstance.off('click', handleClick);
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [layers, controlPanelVisible, onPointClick]);

  // 重新渲染图表
  const refreshChart = () => {
    if (chart) {
      chart.resize();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      
      {/* 控制面板 */}
      {controlPanelVisible && (
        <Card
          size="small"
          title="图层控制"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 280,
            maxHeight: '80%',
            overflow: 'auto',
            zIndex: 1000
          }}
          extra={
            <Button
              type="text"
              size="small"
              icon={<BarsOutlined />}
              onClick={() => setControlPanelVisible(false)}
            />
          }
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {layers.map(layer => (
              <div key={layer.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Checkbox
                    checked={layer.visible}
                    onChange={(e) => onLayerVisibilityChange(layer.id, e.target.checked)}
                  >
                    <span style={{ 
                      color: getRiskColor(layer.risk_level),
                      fontWeight: 'bold'
                    }}>
                      {layer.name}
                    </span>
                  </Checkbox>
                </div>
                {layer.visible && (
                  <div style={{ paddingLeft: 24 }}>
                    <div style={{ marginBottom: 4 }}>透明度: {Math.round(layer.opacity * 100)}%</div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={layer.opacity}
                      onChange={(value) => onLayerOpacityChange(layer.id, value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </Space>
        </Card>
      )}

      {/* 工具栏 */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000
        }}
      >
        <Space>
          {!controlPanelVisible && (
            <Button
              type="primary"
              size="small"
              icon={<BarsOutlined />}
              onClick={() => setControlPanelVisible(true)}
            >
              图层
            </Button>
          )}
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={refreshChart}
          >
            刷新
          </Button>
          <Button
            size="small"
            icon={<FullscreenOutlined />}
            onClick={() => {
              if (chartRef.current) {
                chartRef.current.requestFullscreen?.();
              }
            }}
          >
            全屏
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default RiskGISMap;
