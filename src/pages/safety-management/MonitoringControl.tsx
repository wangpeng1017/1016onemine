import React, { useState } from 'react';
import { Card, Row, Col, Badge, Switch, Tabs, Statistic, Tag, Space } from 'antd';
import { RadarChartOutlined, EnvironmentOutlined, VideoCameraOutlined, DashboardOutlined, WarningOutlined } from '@ant-design/icons';
import RiskGISMap from '../../components/RiskGISMap';

const MonitoringControl: React.FC = () => {
  const [layers, setLayers] = useState({ slope: true, vehicle: true, personnel: true, camera: true, sensor: true });

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { key: '1', label: <span><EnvironmentOutlined /> 监测一张图</span>, children: (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space size="large">
                <span>图层控制:</span>
                <span><Switch size="small" checked={layers.slope} onChange={(c) => setLayers({...layers, slope: c})} /> 边坡监测</span>
                <span><Switch size="small" checked={layers.vehicle} onChange={(c) => setLayers({...layers, vehicle: c})} /> 车辆</span>
                <span><Switch size="small" checked={layers.personnel} onChange={(c) => setLayers({...layers, personnel: c})} /> 人员</span>
                <span><Switch size="small" checked={layers.camera} onChange={(c) => setLayers({...layers, camera: c})} /> 摄像头</span>
                <span><Switch size="small" checked={layers.sensor} onChange={(c) => setLayers({...layers, sensor: c})} /> 传感器</span>
              </Space>
            </Card>
            <Card style={{ height: 600 }}><div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>矿区三维地图展示区域</div></Card>
          </div>
        )},
        { key: '2', label: <span><RadarChartOutlined /> 边坡监测</span>, children: <Card title="边坡监测预警"><div style={{ padding: 20, textAlign: 'center' }}>边坡监测功能</div></Card> },
        { key: '3', label: <span><VideoCameraOutlined /> AI视频监控</span>, children: <Card title="智能视频监控"><div style={{ padding: 20, textAlign: 'center' }}>AI视频监控功能</div></Card> },
        { key: '4', label: <span><DashboardOutlined /> 传感器监测</span>, children: <Card title="传感器实时数据"><div style={{ padding: 20, textAlign: 'center' }}>传感器监测功能</div></Card> },
        { key: '5', label: <span><WarningOutlined /> 多灾融合</span>, children: (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="当前预警" value={3} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="监测点" value={156} /></Card></Col>
              <Col span={6}><Card><Statistic title="在线设备" value={142} valueStyle={{ color: '#52c41a' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="离线设备" value={14} valueStyle={{ color: '#faad14' }} /></Card></Col>
            </Row>
            <Card title="预警看板"><div style={{ padding: 20, textAlign: 'center' }}>多灾融合预警功能</div></Card>
          </div>
        )}
      ]} />
    </div>
  );
};

export default MonitoringControl;
