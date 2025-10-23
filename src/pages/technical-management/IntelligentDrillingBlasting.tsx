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
            <div style={{ textAlign: 'center', lineHeight: '550px', fontSize: '24px', color: '#ccc' }}>
              地图实时监控区域
            </div>
          </Card>
        </Col>

        {/* 设备详情面板占位 */}
        <Col span={6}>
          <Card title="设备详情面板 (占位)">
            <div style={{ minHeight: '600px', color: '#ccc' }}>
              <p>基本信息</p>
              <p>实时运行数据 (仪表盘/数字列表)</p>
              <p>效率分析 (折线图/柱状图)</p>
              <p>选中设备后显示详细信息</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IntelligentDrillingBlasting;