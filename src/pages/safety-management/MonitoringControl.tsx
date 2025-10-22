import React, { useState } from 'react';
import { Card, Row, Col, Badge, Switch, Tabs, Statistic, Tag, Space, Table, Button } from 'antd';
import { RadarChartOutlined, EnvironmentOutlined, VideoCameraOutlined, DashboardOutlined, WarningOutlined, EyeOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

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
        { key: '2', label: <span><RadarChartOutlined /> 边坡监测</span>, children: (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}><Statistic title="监测点" value={24} /></Col>
                <Col span={6}><Statistic title="在线设备" value={22} valueStyle={{ color: '#52c41a' }} /></Col>
                <Col span={6}><Statistic title="预警点" value={2} valueStyle={{ color: '#ff4d4f' }} /></Col>
                <Col span={6}><Statistic title="今日报警" value={5} valueStyle={{ color: '#faad14' }} /></Col>
              </Row>
            </Card>
            <Card title="监测点列表">
              <Table 
                size="small"
                columns={[
                  { title: '监测点', dataIndex: 'name', key: 'name' },
                  { title: '位置', dataIndex: 'location', key: 'location' },
                  { title: '位移值(mm)', dataIndex: 'displacement', key: 'displacement', render: (d: number) => <Tag color={d > 10 ? 'red' : d > 5 ? 'orange' : 'green'}>{d}</Tag> },
                  { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'normal' ? 'success' : 'error'} text={s === 'normal' ? '正常' : '预警'} /> },
                  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
                  { title: '操作', key: 'action', render: () => <Button type="link" size="small" icon={<EyeOutlined />}>查看趋势</Button> }
                ]}
                dataSource={[
                  { key: '1', name: '北区边坡-01', location: '北区', displacement: 12.5, status: 'warning', updateTime: '2024-01-15 14:30' },
                  { key: '2', name: '北区边坡-02', location: '北区', displacement: 3.2, status: 'normal', updateTime: '2024-01-15 14:30' },
                  { key: '3', name: '东区边坡-01', location: '东区', displacement: 8.7, status: 'warning', updateTime: '2024-01-15 14:29' }
                ]}
              />
            </Card>
          </div>
        )},
        { key: '3', label: <span><VideoCameraOutlined /> AI视频监控</span>, children: (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}><Statistic title="摄像头" value={48} /></Col>
                <Col span={6}><Statistic title="在线" value={45} valueStyle={{ color: '#52c41a' }} /></Col>
                <Col span={6}><Statistic title="今日识别" value={156} /></Col>
                <Col span={6}><Statistic title="异常行为" value={8} valueStyle={{ color: '#ff4d4f' }} /></Col>
              </Row>
            </Card>
            <Card title="AI识别记录">
              <Table 
                size="small"
                columns={[
                  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
                  { title: '摄像头', dataIndex: 'camera', key: 'camera' },
                  { title: '识别类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="red">{t}</Tag> },
                  { title: '人员', dataIndex: 'person', key: 'person' },
                  { title: '处理状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'handled' ? 'success' : 'warning'}>{s === 'handled' ? '已处理' : '待处理'}</Tag> },
                  { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看视频</Button><Button type="link" size="small">处理</Button></Space> }
                ]}
                dataSource={[
                  { key: '1', time: '2024-01-15 14:25', camera: '采矿区A-01', type: '未佩戴安全帽', person: '未识别', status: 'pending' },
                  { key: '2', time: '2024-01-15 14:18', camera: '边坡监控-03', type: '人员闯入', person: '张三', status: 'handled' }
                ]}
              />
            </Card>
          </div>
        )},
        { key: '4', label: <span><DashboardOutlined /> 传感器监测</span>, children: (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}><Statistic title="传感器" value={84} /></Col>
                <Col span={6}><Statistic title="在线" value={75} valueStyle={{ color: '#52c41a' }} /></Col>
                <Col span={6}><Statistic title="超阈值" value={6} valueStyle={{ color: '#ff4d4f' }} /></Col>
                <Col span={6}><Statistic title="离线" value={9} valueStyle={{ color: '#999' }} /></Col>
              </Row>
            </Card>
            <Card title="传感器实时数据">
              <Table 
                size="small"
                columns={[
                  { title: '传感器', dataIndex: 'name', key: 'name' },
                  { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
                  { title: '位置', dataIndex: 'location', key: 'location' },
                  { title: '当前值', dataIndex: 'value', key: 'value', render: (v: string, record: any) => <Tag color={record.alarm ? 'red' : 'green'}>{v}</Tag> },
                  { title: '阈值', dataIndex: 'threshold', key: 'threshold' },
                  { title: '状态', dataIndex: 'alarm', key: 'alarm', render: (a: boolean) => <Badge status={a ? 'error' : 'success'} text={a ? '报警' : '正常'} /> },
                  { title: '操作', key: 'action', render: () => <Button type="link" size="small">查看趋势</Button> }
                ]}
                dataSource={[
                  { key: '1', name: '温度-01', type: '温度', location: '采矿区A', value: '85℃', threshold: '80℃', alarm: true },
                  { key: '2', name: '气体-02', type: '气体浓度', location: '采矿区B', value: '0.3%', threshold: '0.5%', alarm: false },
                  { key: '3', name: '粉尘-03', type: '粉尘浓度', location: '运输通道', value: '45mg/m³', threshold: '50mg/m³', alarm: false }
                ]}
              />
            </Card>
          </div>
        )},
        { key: '5', label: <span><WarningOutlined /> 多灾融合</span>, children: (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="当前预警" value={3} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="监测点" value={156} /></Card></Col>
              <Col span={6}><Card><Statistic title="在线设备" value={142} valueStyle={{ color: '#52c41a' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="离线设备" value={14} valueStyle={{ color: '#faad14' }} /></Card></Col>
            </Row>
            <Card title="预警看板" style={{ marginBottom: 16 }}>
              <Table 
                size="small"
                columns={[
                  { title: '预警时间', dataIndex: 'time', key: 'time', width: 160 },
                  { title: '预警类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="red">{t}</Tag> },
                  { title: '预警内容', dataIndex: 'content', key: 'content' },
                  { title: '等级', dataIndex: 'level', key: 'level', render: (l: string) => <Tag color={l === '紧急' ? 'red' : 'orange'}>{l}</Tag> },
                  { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'handled' ? 'success' : 'processing'}>{s === 'handled' ? '已处理' : '处理中'}</Tag> },
                  { title: '操作', key: 'action', render: () => <Button type="link" size="small">查看</Button> }
                ]}
                dataSource={[
                  { key: '1', time: '2024-01-15 14:30', type: '边坡位移', content: '北区边坡-01位移超阈', level: '紧急', status: 'processing' },
                  { key: '2', time: '2024-01-15 14:25', type: '温度异常', content: '采矿区A温度超阈', level: '重要', status: 'processing' },
                  { key: '3', time: '2024-01-15 14:18', type: 'AI识别', content: '人员闯入危险区', level: '紧急', status: 'handled' }
                ]}
              />
            </Card>
            <Card title="灾害风险评估">
              <ReactECharts 
                option={{
                  title: { text: '多灾种风险评估', left: 'center' },
                  radar: {
                    indicator: [
                      { name: '边坡滑坡', max: 100 },
                      { name: '火灾', max: 100 },
                      { name: '气体泄漏', max: 100 },
                      { name: '洪水', max: 100 },
                      { name: '粉尘爆炸', max: 100 }
                    ]
                  },
                  series: [{
                    type: 'radar',
                    data: [{ value: [75, 45, 30, 20, 35], name: '当前风险等级' }]
                  }]
                }}
                style={{ height: 300 }}
              />
            </Card>
          </div>
        )}
      ]} />
    </div>
  );
};

export default MonitoringControl;
