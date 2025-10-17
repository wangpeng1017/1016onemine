import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Slider, Select, DatePicker, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface TrajectoryPoint {
  timestamp: string;
  position: [number, number];
  status: 'online' | 'offline' | 'sos';
}

export interface PersonnelTrajectory {
  personnelId: string;
  personnelName: string;
  trajectoryData: TrajectoryPoint[];
}

interface TrajectoryPlayerProps {
  trajectory: PersonnelTrajectory;
  dangerZones?: any[];
}

const TrajectoryPlayer: React.FC<TrajectoryPlayerProps> = ({ trajectory, dangerZones = [] }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const trajectoryData = trajectory.trajectoryData;
  const totalPoints = trajectoryData.length;

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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    updateChart();
  }, [currentIndex, trajectoryData]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= totalPoints - 1) {
            setIsPlaying(false);
            return totalPoints - 1;
          }
          return prev + 1;
        });
      }, 1000 / playSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed, totalPoints]);

  const updateChart = () => {
    if (!chartInstance.current || trajectoryData.length === 0) return;

    const currentData = trajectoryData.slice(0, currentIndex + 1);
    const currentPoint = trajectoryData[currentIndex];

    const series: any[] = [];

    // 危险区域
    if (dangerZones.length > 0) {
      dangerZones.forEach(zone => {
        series.push({
          name: zone.name,
          type: 'line',
          data: [...zone.coordinates, zone.coordinates[0]],
          lineStyle: {
            color: '#ff4d4f',
            width: 2,
            type: 'dashed'
          },
          areaStyle: {
            color: '#ff4d4f',
            opacity: 0.1
          },
          symbol: 'none',
          z: 1
        });
      });
    }

    // 轨迹线
    series.push({
      name: '移动轨迹',
      type: 'line',
      data: currentData.map(p => p.position),
      lineStyle: {
        color: '#1890ff',
        width: 2
      },
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#1890ff'
      },
      z: 2
    });

    // 当前位置点
    series.push({
      name: '当前位置',
      type: 'scatter',
      data: [{
        value: currentPoint.position,
        itemStyle: {
          color: currentPoint.status === 'sos' ? '#ff4d4f' : '#52c41a',
          borderColor: '#fff',
          borderWidth: 2
        }
      }],
      symbolSize: 20,
      symbol: 'pin',
      z: 3
    });

    const option = {
      title: {
        text: `${trajectory.personnelName} - 历史轨迹回放`,
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesName === '当前位置') {
            return `
              <div style="padding: 8px;">
                <strong>${trajectory.personnelName}</strong><br/>
                时间: ${currentPoint.timestamp}<br/>
                位置: ${currentPoint.position[0].toFixed(4)}, ${currentPoint.position[1].toFixed(4)}<br/>
                状态: ${currentPoint.status === 'online' ? '在线' : currentPoint.status === 'sos' ? 'SOS' : '离线'}
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
  };

  const handlePlay = () => {
    if (currentIndex >= totalPoints - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(totalPoints - 1, prev + 1));
  };

  const handleSliderChange = (value: number) => {
    setIsPlaying(false);
    setCurrentIndex(value);
  };

  const currentTime = trajectoryData[currentIndex]?.timestamp || '';
  const progress = totalPoints > 0 ? ((currentIndex / (totalPoints - 1)) * 100).toFixed(1) : '0';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 控制面板 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space wrap>
            <span>时间范围:</span>
            <RangePicker
              showTime
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
              size="small"
            />
            <span style={{ marginLeft: 16 }}>播放速度:</span>
            <Select value={playSpeed} onChange={setPlaySpeed} style={{ width: 100 }} size="small">
              <Option value={0.5}>0.5x</Option>
              <Option value={1}>1x</Option>
              <Option value={2}>2x</Option>
              <Option value={5}>5x</Option>
              <Option value={10}>10x</Option>
            </Select>
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Space>
              <Button
                icon={<StepBackwardOutlined />}
                onClick={handleStepBackward}
                disabled={currentIndex === 0}
                size="small"
              />
              {isPlaying ? (
                <Button
                  type="primary"
                  icon={<PauseCircleOutlined />}
                  onClick={handlePause}
                  size="small"
                >
                  暂停
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={handlePlay}
                  disabled={currentIndex >= totalPoints - 1}
                  size="small"
                >
                  播放
                </Button>
              )}
              <Button
                icon={<StepForwardOutlined />}
                onClick={handleStepForward}
                disabled={currentIndex >= totalPoints - 1}
                size="small"
              />
            </Space>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Slider
                min={0}
                max={totalPoints - 1}
                value={currentIndex}
                onChange={handleSliderChange}
                style={{ flex: 1 }}
                tooltip={{ formatter: (value) => trajectoryData[value || 0]?.timestamp }}
              />
              <Tag color="blue">{progress}%</Tag>
            </div>
          </div>

          <div>
            <Space>
              <span>当前时间:</span>
              <Tag>{currentTime}</Tag>
              <span style={{ marginLeft: 16 }}>进度:</span>
              <Tag>{currentIndex + 1} / {totalPoints}</Tag>
            </Space>
          </div>
        </Space>
      </Card>

      {/* 地图容器 */}
      <Card style={{ flex: 1, padding: 0 }} bodyStyle={{ height: '100%', padding: 0 }}>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '500px'
          }}
        />
      </Card>
    </div>
  );
};

export default TrajectoryPlayer;
