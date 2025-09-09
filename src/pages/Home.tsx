import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Badge, List, Tag, Progress, Alert } from 'antd';
import { 
  EnvironmentOutlined, 
  WarningOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  RadarChartOutlined
} from '@ant-design/icons';
import GISMap from '../components/GISMap';

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
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    online: 0,
    offline: 0,
    alarm: 0,
    normal: 0
  });

  const [recentAlarms, setRecentAlarms] = useState<AlarmRecord[]>([]);

  useEffect(() => {
    // 模拟实时数据更新
    const updateData = () => {
      setSystemStatus({
        online: 156,
        offline: 8,
        alarm: 12,
        normal: 144
      });

      setRecentAlarms([
        {
          id: '1',
          type: '表面位移',
          level: 'high',
          message: 'GNSS-003监测点位移超过阈值',
          time: '2024-01-15 14:32:15',
          location: '东南边坡'
        },
        {
          id: '2',
          type: '雷达监测',
          level: 'medium',
          message: '雷达设备RD-005信号异常',
          time: '2024-01-15 14:28:42',
          location: '北侧采场'
        },
        {
          id: '3',
          type: '裂缝计',
          level: 'medium',
          message: 'CG-012裂缝宽度增长异常',
          time: '2024-01-15 14:15:33',
          location: '西侧边坡'
        },
        {
          id: '4',
          type: '土压力',
          level: 'low',
          message: 'EP-008压力值轻微波动',
          time: '2024-01-15 14:08:21',
          location: '南侧挡墙'
        },
        {
          id: '5',
          type: '地下水',
          level: 'low',
          message: 'GW-015水位下降趋势',
          time: '2024-01-15 13:55:17',
          location: '中央区域'
        }
      ]);
    };

    updateData();
    const interval = setInterval(updateData, 30000); // 30秒更新一次

    return () => clearInterval(interval);
  }, []);

  const getAlarmColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getAlarmText = (level: string) => {
    switch (level) {
      case 'high': return '高危';
      case 'medium': return '中危';
      case 'low': return '低危';
      default: return '正常';
    }
  };

  return (
    <div>
      <div className="page-title">矿山监测综合态势一张图</div>
      
      {/* 实时统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={systemStatus.online}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              suffix="台"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={systemStatus.offline}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              suffix="台"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="告警设备"
              value={systemStatus.alarm}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              suffix="台"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="正常设备"
              value={systemStatus.normal}
              prefix={<RadarChartOutlined style={{ color: '#1890ff' }} />}
              suffix="台"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* GIS地图区域 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                监测点分布态势图
              </span>
            }
            extra={
              <Badge count={systemStatus.alarm} showZero>
                <Tag color="processing">实时监控</Tag>
              </Badge>
            }
          >
            <div style={{ height: '600px' }}>
              <GISMap />
            </div>
          </Card>
        </Col>

        {/* 右侧信息面板 */}
        <Col xs={24} lg={8}>
          {/* 系统健康度 */}
          <Card 
            title="系统健康度" 
            style={{ marginBottom: 16 }}
            size="small"
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span>设备在线率</span>
                <span style={{ float: 'right', fontWeight: 'bold' }}>
                  {((systemStatus.online / (systemStatus.online + systemStatus.offline)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                percent={((systemStatus.online / (systemStatus.online + systemStatus.offline)) * 100)} 
                strokeColor="#52c41a"
                size="small"
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span>系统稳定性</span>
                <span style={{ float: 'right', fontWeight: 'bold' }}>98.5%</span>
              </div>
              <Progress 
                percent={98.5} 
                strokeColor="#1890ff"
                size="small"
              />
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>
                <span>数据完整性</span>
                <span style={{ float: 'right', fontWeight: 'bold' }}>99.2%</span>
              </div>
              <Progress 
                percent={99.2} 
                strokeColor="#722ed1"
                size="small"
              />
            </div>
          </Card>

          {/* 实时告警列表 */}
          <Card 
            title={
              <span>
                <WarningOutlined style={{ marginRight: 8 }} />
                实时告警
              </span>
            }
            extra={
              <Badge count={recentAlarms.length} showZero>
                <EyeOutlined />
              </Badge>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={recentAlarms}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        color={getAlarmColor(item.level)} 
                        text={getAlarmText(item.level)}
                      />
                    }
                    title={
                      <div style={{ fontSize: '12px' }}>
                        <Tag color="blue">{item.type}</Tag>
                        <span style={{ marginLeft: 4 }}>{item.message}</span>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        <div>{item.location}</div>
                        <div>{item.time}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作提示 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Alert
            message="系统运行正常"
            description="当前监测系统运行稳定，所有核心功能正常。如发现异常情况，请及时查看详细监测数据或联系技术支持。"
            type="success"
            showIcon
            closable
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
