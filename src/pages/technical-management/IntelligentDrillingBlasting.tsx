import React from 'react';
import { Card, Col, Row, Typography, List, Tag, Alert } from 'antd';
import { EnvironmentOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const IntelligentDrillingBlasting: React.FC = () => {
  const devices = [
    { id: 'DZ001', name: '智能钻机A', status: '作业中', location: 'A区', warning: false },
    { id: 'JC002', name: '测孔机器人B', status: '待机', location: 'B区', warning: false },
    { id: 'ZY003', name: '智能装药车C', status: '故障', location: 'C区', warning: true },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>智能穿爆监控驾驶舱</Title>

      {/* 风险预警信息栏 */}
      <Alert
        message={
          <Text strong>
            <WarningOutlined style={{ marginRight: 8 }} />
            风险预警: C区智能装药车出现油压异常，请立即处理！
          </Text>
        }
        type="warning"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />
      <Alert
        message={
          <Text strong>
            <WarningOutlined style={{ marginRight: 8 }} />
            风险预警: B区测孔机器人信号丢失，请检查！
          </Text>
        }
        type="warning"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      <Row gutter={[16, 16]}>
        {/* 设备列表 */}
        <Col span={6}>
          <Card title="设备列表">
            <List
              itemLayout="horizontal"
              dataSource={devices}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined />}
                    title={item.name}
                    description={
                      <>
                        <Text>ID: {item.id}</Text>
                        <br />
                        <Text>位置: {item.location}</Text>
                        <br />
                        <Tag color={item.status === '作业中' ? 'green' : (item.status === '待机' ? 'blue' : 'red')}>
                          {item.status}
                        </Tag>
                        {item.warning && <Tag color="red" icon={<WarningOutlined />}>告警</Tag>}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 矿区二维/三维地图占位 */}
        <Col span={12}>
          <Card style={{ height: '600px' }} title="矿区二维/三维地图 (占位)">
            <div style={{ textAlign: 'center', lineHeight: '300px', fontSize: '16px', color: '#ccc' }}>
              <p>在地图上实时展示智能钻机、测孔机器人、智能装药车等设备的位置和状态。</p>
              <p>设备图标颜色表示工作状态 (作业中、待机、故障)</p>
            </div>
          </Card>
        </Col>

        {/* 设备详情面板 */}
        <Col span={6}>
          <Card title="设备详情面板">
            <div style={{ minHeight: '600px' }}>
              <Title level={4}>智能钻机 A (DZ001)</Title>
              <Text>型号: XYZ-2000</Text><br />
              <Text>位置: A区</Text><br />
              <Text>状态: 作业中</Text><br /><br />

              <Title level={5}>实时运行数据</Title>
              <Text>钻进深度: 15.8 米</Text><br />
              <Text>钻进速度: 0.5 米/分钟</Text><br />
              <Text>发动机转速: 1800 RPM</Text><br />
              <Text>油压: 220 PSI</Text><br /><br />

              <Title level={5}>效率分析</Title>
              <Text>近期工作效率: 85%</Text><br />
              <Text>平均故障间隔时间: 120 小时</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IntelligentDrillingBlasting;