import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, DatePicker, Select, Space, Table, Tag } from 'antd';
import { DashboardOutlined, HistoryOutlined, EnvironmentOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { stationService, airQualityService, noiseService, alertService } from '../../services/environmentalMockService';
import AlertTicker from '../../components/environmental/AlertTicker';
import type { MonitorStation, AirQualityData, NoiseData, Alert } from '../../types/environmental';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AirNoisePage: React.FC = () => {
  const [stations, setStations] = useState<MonitorStation[]>([]);
  const [airData, setAirData] = useState<AirQualityData[]>([]);
  const [noiseData, setNoiseData] = useState<NoiseData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<AirQualityData[]>([]);

  useEffect(() => {
    const stationList = stationService.getAll();
    setStations(stationList);
    setAirData(airQualityService.getLatest());
    setNoiseData(noiseService.getLatest());
    setAlerts(alertService.getAll().filter(a => a.type === 'air' || a.type === 'noise'));
    
    if (stationList.length > 0) {
      setSelectedStation(stationList[0].id);
    }

    const interval = setInterval(() => {
      const updatedAir = airQualityService.updateRealtime();
      const updatedNoise = noiseService.updateRealtime();
      setAirData(updatedAir);
      setNoiseData(updatedNoise);

      // Add alerts
      [...updatedAir, ...updatedNoise].forEach(d => {
        if ('PM25' in d && d.status !== 'normal') {
          alertService.add({
            timestamp: d.timestamp,
            location: stationList.find(s => s.id === d.stationId)?.name || '',
            type: 'air',
            level: d.status === 'alarm' ? 'alarm' : 'warning',
            message: `PM2.5: ${d.PM25} μg/m³, PM10: ${d.PM10} μg/m³`,
            acknowledged: false
          });
        }
        if ('level' in d && d.status !== 'normal') {
          alertService.add({
            timestamp: d.timestamp,
            location: stationList.find(s => s.id === d.stationId)?.name || '',
            type: 'noise',
            level: d.status === 'alarm' ? 'alarm' : 'warning',
            message: `噪声: ${d.level} dB`,
            acknowledged: false
          });
        }
      });
      setAlerts(alertService.getAll().filter(a => a.type === 'air' || a.type === 'noise'));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const airStations = stations.filter(s => s.type === 'air');
  const noiseStations = stations.filter(s => s.type === 'noise');

  const airColumns = [
    { title: '监测站', dataIndex: 'stationId', key: 'stationId', render: (id: string) => stations.find(s => s.id === id)?.name },
    { title: 'PM2.5', dataIndex: 'PM25', key: 'PM25', render: (v: number) => `${v.toFixed(1)} μg/m³` },
    { title: 'PM10', dataIndex: 'PM10', key: 'PM10', render: (v: number) => `${v.toFixed(1)} μg/m³` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => {
        const config = { normal: { color: 'success', text: '正常' }, warning: { color: 'warning', text: '预警' }, alarm: { color: 'error', text: '报警' } };
        const c = config[s as keyof typeof config];
        return <Tag color={c.color}>{c.text}</Tag>;
      }
    },
    { title: '更新时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 }
  ];

  const noiseColumns = [
    { title: '监测点', dataIndex: 'stationId', key: 'stationId', render: (id: string) => stations.find(s => s.id === id)?.name },
    { title: '噪声值', dataIndex: 'level', key: 'level', render: (v: number) => `${v.toFixed(1)} dB` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => {
        const config = { normal: { color: 'success', text: '正常' }, warning: { color: 'warning', text: '预警' }, alarm: { color: 'error', text: '报警' } };
        const c = config[s as keyof typeof config];
        return <Tag color={c.color}>{c.text}</Tag>;
      }
    },
    { title: '更新时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 }
  ];

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1] && selectedStation) {
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');
      const historical = airQualityService.getHistorical(selectedStation, start, end);
      setHistoricalData(historical);
    }
  };

  const historicalChartOption = {
    title: { text: '历史数据趋势', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['PM2.5', 'PM10'], bottom: 10 },
    xAxis: { type: 'category', data: historicalData.map(d => dayjs(d.timestamp).format('MM-DD')), axisLabel: { rotate: 45 } },
    yAxis: { type: 'value', name: 'μg/m³' },
    series: [
      { name: 'PM2.5', type: 'line', data: historicalData.map(d => d.PM25.toFixed(1)), smooth: true, itemStyle: { color: '#1890ff' } },
      { name: 'PM10', type: 'line', data: historicalData.map(d => d.PM10.toFixed(1)), smooth: true, itemStyle: { color: '#52c41a' } }
    ],
    grid: { left: '10%', right: '5%', bottom: '20%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        defaultActiveKey="realtime"
        items={[
          {
            key: 'realtime',
            label: <span><DashboardOutlined /> 实时监控</span>,
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="空气质量监测">
                  <Table columns={airColumns} dataSource={airData} rowKey="stationId" pagination={false} size="small" />
                </Card>
                <Card title="噪声监测">
                  <Table columns={noiseColumns} dataSource={noiseData} rowKey="stationId" pagination={false} size="small" />
                </Card>
                <AlertTicker alerts={alerts} onAcknowledge={(id) => { alertService.acknowledge(id); setAlerts(alertService.getAll().filter(a => a.type === 'air' || a.type === 'noise')); }} />
              </Space>
            )
          },
          {
            key: 'historical',
            label: <span><HistoryOutlined /> 历史数据</span>,
            children: (
              <Card title="历史数据查询">
                <Space style={{ marginBottom: 16 }}>
                  <Select value={selectedStation} onChange={setSelectedStation} style={{ width: 200 }} placeholder="选择监测站">
                    {airStations.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                  </Select>
                  <RangePicker onChange={handleDateRangeChange} />
                </Space>
                {historicalData.length > 0 && <ReactECharts option={historicalChartOption} style={{ height: 400 }} />}
                {historicalData.length > 0 && (
                  <Table
                    columns={[
                      { title: '日期', dataIndex: 'timestamp', key: 'timestamp', render: (t: string) => dayjs(t).format('YYYY-MM-DD') },
                      { title: 'PM2.5', dataIndex: 'PM25', key: 'PM25', render: (v: number) => `${v.toFixed(1)} μg/m³` },
                      { title: 'PM10', dataIndex: 'PM10', key: 'PM10', render: (v: number) => `${v.toFixed(1)} μg/m³` }
                    ]}
                    dataSource={historicalData}
                    rowKey={(r, i) => `${r.stationId}-${i}`}
                    pagination={{ pageSize: 10 }}
                    size="small"
                    style={{ marginTop: 16 }}
                  />
                )}
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default AirNoisePage;
