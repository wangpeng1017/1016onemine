import React from 'react';
import { Card, Col, Row, Space, Statistic, Typography, Button } from 'antd';
import { AreaChartOutlined, BarChartOutlined, PieChartOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const GeologicalAssurance: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>地质保障驾驶舱</Title>
      <Row gutter={[16, 16]}>
        {/* 三维视窗占位 */}
        <Col span={16}>
          <Card
            style={{ height: '600px' }}
            title="三维场景视窗 (占位)"
            extra={
              <Link to="/technical-management/geological-reports">
                <Button type="primary" icon={<FileTextOutlined />}>统计报表</Button>
              </Link>
            }
          >
            <div style={{ textAlign: 'center', lineHeight: '550px', fontSize: '24px', color: '#ccc' }}>
              三维模型渲染区域
            </div>
            {/* 时间轴滑块占位 */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text>时间轴滑块 (占位)</Text>
            </div>
          </Card>
        </Col>

        {/* 图层与数据控制区 & 信息展示与分析区 */}
        <Col span={8}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {/* 图层控制占位 */}
            <Card title="图层控制 (占位)">
              <div style={{ minHeight: '200px', color: '#ccc' }}>
                <p>复选框树状列表</p>
                <p>台阶参数</p>
                <p>钻孔信息</p>
                <p>开拓运输系统</p>
                <p>煤层信息</p>
                <p>无人机三维模型</p>
              </div>
            </Card>

            {/* 储量管理概览占位 */}
            <Card title="储量管理 - 概览 (占位)">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="地质储量" value={1200} suffix="万吨" prefix={<AreaChartOutlined />} />
                </Col>
                <Col span={12}>
                  <Statistic title="工业储量" value={850} suffix="万吨" prefix={<BarChartOutlined />} />
                </Col>
                <Col span={12}>
                  <Statistic title="设计可采储量" value={700} suffix="万吨" prefix={<PieChartOutlined />} />
                </Col>
                <Col span={12}>
                  <Statistic title="累计采出量" value={300} suffix="万吨" prefix={<AreaChartOutlined />} />
                </Col>
              </Row>
            </Card>

            {/* 无人机数据占位 */}
            <Card title="无人机数据 (占位)">
              <div style={{ minHeight: '150px', color: '#ccc' }}>
                <p>视频播放器</p>
                <p>数据列表</p>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default GeologicalAssurance;