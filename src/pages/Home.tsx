import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Badge, Button, Space, Alert, Tabs, Modal, Tag, Progress } from 'antd';
import { 
  WarningOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  RadarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';
import GISMap from '../components/GISMap';
import RiskGISMap from '../components/RiskGISMap';

interface AlarmRecord {
  id: string;
  type: string;
  level: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  location: string;
}

interface SystemStatus {
  online: number;
  offline: number;
  alarm: number;
  normal: number;
}

const Home: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState('monitoring');
  const [riskModalVisible, setRiskModalVisible] = useState(false);

  // 模拟空天风险数据
  const mockRiskLayers = [
    {
      id: 'DEF-001',
      name: '卫星形变风险-DEF-001',
      type: 'deformation' as const,
      risk_level: 1 as const,
      boundary: 'POLYGON ((87.6100 43.7800, 87.6200 43.7800, 87.6200 43.7900, 87.6100 43.7900, 87.6100 43.7800))',
      points: [
        { coordinates: [87.6150, 43.7850] as [number, number], value: 15.2 },
        { coordinates: [87.6170, 43.7860] as [number, number], value: 12.8 }
      ],
      visible: true,
      opacity: 0.7
    },
    {
      id: 'MOR-001',
      name: '形态超限风险-MOR-001',
      type: 'morphology' as const,
      risk_level: 3 as const,
      boundary: 'POLYGON ((87.6550 43.7650, 87.6650 43.7650, 87.6650 43.7750, 87.6550 43.7750, 87.6550 43.7650))',
      points: [
        { coordinates: [87.6600, 43.7700] as [number, number], value: 45.2, design_value: 40.0 }
      ],
      visible: true,
      opacity: 0.7
    }
  ];

  // 模拟实时数据更新
  useEffect(() => {
    const mockAlarms: AlarmRecord[] = [
      {
        id: '1',
        type: 'GNSS位移',
        level: 'high',
        message: 'GNSS-078监测点位移速率超过阈值',
        time: '2025-09-09 23:45:12',
        location: '东北边坡'
      },
      {
        id: '2',
        type: '雷达监测',
        level: 'medium',
        message: '雷达RD-003检测到异常位移',
        time: '2025-09-09 23:42:08',
        location: '南侧台阶'
      },
      {
        id: '3',
        type: '空天风险',
        level: 'high',
        message: '卫星形变风险DEF-001达到红色预警',
        time: '2025-09-09 23:40:30',
        location: '东北边坡'
      },
      {
        id: '4',
        type: '土压力',
        level: 'medium',
        message: '土压力EP-008压力值持续上升',
        time: '2025-09-09 23:35:22',
        location: '北侧台阶'
      },
      {
        id: '5',
        type: '形态超限',
        level: 'medium',
        message: '边坡形态监测点MOR-001实际值超过设计值',
        time: '2025-09-09 23:32:15',
        location: '西南台阶'
      }
    ];

    setAlarms(mockAlarms);

    // 模拟实时数据更新
    const interval = setInterval(() => {
      setAlarms(prev => {
        const newAlarm: AlarmRecord = {
          id: Date.now().toString(),
          type: ['GNSS位移', '雷达监测', '空天风险', '土压力', '形态超限'][Math.floor(Math.random() * 5)],
          level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          message: '检测到新的异常数据',
          time: new Date().toLocaleString('zh-CN'),
          location: ['东北边坡', '南侧台阶', '西侧边坡', '北侧台阶', '中央区域'][Math.floor(Math.random() * 5)]
        };
        return [newAlarm, ...prev.slice(0, 9)]; // 保持最新10条
      });
    }, 30000); // 30秒更新一次

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  // 统计风险数据
  const riskStats = {
    red: mockRiskLayers.filter(l => l.risk_level === 1).length,
    orange: 0, // 当前模拟数据中没有2级风险
    yellow: mockRiskLayers.filter(l => l.risk_level === 3).length,
    blue: 0 // 当前模拟数据中没有4级风险
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 核心数据看板 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="红色风险区域"
              value={riskStats.red}
              suffix="个"
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff0000' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="橙色风险区域"
              value={riskStats.orange}
              suffix="个"
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ffa500' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="最大形变速率"
              value="15.2"
              suffix="mm/h"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              GNSS-078
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="设备在线率"
              value={95.1}
              suffix="%"
              precision={1}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统健康度监控 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card title="超限风险点总数" size="small">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tag color="red">实际值 &gt; 设计值</Tag>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>3</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="系统稳定性" size="small">
            <Progress
              percent={98.5}
              strokeColor="#52c41a"
              showInfo={true}
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="数据完整性" size="small">
            <Progress
              percent={99.2}
              strokeColor="#1890ff"
              showInfo={true}
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 核心三维GIS视窗 */}
        <Col xs={24} lg={16}>
          <Card 
            title="综合态势一张图" 
            extra={
              <Space>
                <Button 
                  size="small" 
                  icon={<EyeOutlined />}
                  onClick={() => setRiskModalVisible(true)}
                >
                  风险详情
                </Button>
                <Button size="small" icon={<ReloadOutlined />}>刷新</Button>
                <Button size="small" icon={<FullscreenOutlined />}>全屏</Button>
              </Space>
            }
          >
            <Tabs activeKey={activeMapTab} onChange={setActiveMapTab}>
              <Tabs.TabPane tab="监测点分布" key="monitoring">
                <GISMap />
              </Tabs.TabPane>
              <Tabs.TabPane tab="空天风险分析" key="risk">
                <div style={{ height: '500px' }}>
                  <Alert
                    message="空天风险监测"
                    description={`当前检测到 ${riskStats.red + riskStats.orange} 个高危风险区域，建议立即关注红色和橙色风险区域。`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <RiskGISMap
                    layers={mockRiskLayers}
                    onLayerVisibilityChange={() => {}}
                    onLayerOpacityChange={() => {}}
                    onPointClick={(point, layer) => {
                      Modal.info({
                        title: `${layer.name} - 风险点详情`,
                        content: (
                          <div>
                            <p><strong>坐标:</strong> {point.coordinates.join(', ')}</p>
                            <p><strong>数值:</strong> {point.value}</p>
                            {point.design_value && (
                              <>
                                <p><strong>设计值:</strong> {point.design_value}</p>
                                {point.value > point.design_value && (
                                  <Tag color="red">⚠️ 超限</Tag>
                                )}
                              </>
                            )}
                          </div>
                        )
                      });
                    }}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* 实时告警滚动列表 */}
        <Col xs={24} lg={8}>
          <Card title="实时告警" extra={<Badge count={alarms.length} />}>
            <List
              size="small"
              dataSource={alarms.slice(0, 8)}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => {
                        // 跳转到告警详情
                        console.log('查看告警详情:', item.id);
                      }}
                    >
                      查看
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        color={getLevelColor(item.level)} 
                        text={getLevelText(item.level)}
                      />
                    }
                    title={
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold' }}>{item.type}</span>
                        <span style={{ float: 'right', color: '#999' }}>
                          {item.time.split(' ')[1]}
                        </span>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '11px' }}>
                        <div>{item.message}</div>
                        <div style={{ color: '#999', marginTop: '2px' }}>
                          <ClockCircleOutlined /> {item.location}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 风险详情模态框 */}
      <Modal
        title="空天风险详情"
        visible={riskModalVisible}
        onCancel={() => setRiskModalVisible(false)}
        footer={null}
        width={800}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="风险统计" size="small">
              <div style={{ marginBottom: 8 }}>
                <Tag color="red">红色风险: {riskStats.red}个</Tag>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Tag color="orange">橙色风险: {riskStats.orange}个</Tag>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Tag color="yellow">黄色风险: {riskStats.yellow}个</Tag>
              </div>
              <div>
                <Tag color="blue">蓝色风险: {riskStats.blue}个</Tag>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="快速导航" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block icon={<RadarChartOutlined />}>
                  空天风险监测
                </Button>
                <Button block icon={<EnvironmentOutlined />}>
                  图层管理
                </Button>
                <Button block icon={<ExclamationCircleOutlined />}>
                  应急预案
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Home;
