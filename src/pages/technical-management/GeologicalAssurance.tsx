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
            <div style={{ textAlign: 'center', lineHeight: '550px', fontSize: '24px', color: '#ccc', background: '#f0f2f5' }}>
              <p>高性能Web 3D引擎渲染矿山开采境界、地形地貌、地质模型</p>
              <p>支持旋转、平移、缩放等交互</p>
            </div>
            {/* 时间轴滑块 */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text>动态时空演化: 2020年 - 2024年</Text>
              <input type="range" min="2020" max="2024" defaultValue="2022" style={{ width: '80%', display: 'block', margin: '8px auto' }} />
              <Text>当前年份: 2022</Text>
            </div>
          </Card>
        </Col>

        {/* 图层与数据控制区 & 信息展示与分析区 */}
        <Col span={8}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {/* 图层控制 */}
            <Card title="图层控制">
              <div style={{ minHeight: '200px' }}>
                <label><input type="checkbox" defaultChecked /> 台阶参数 (高度: 10m, 坡面角: 70°)</label><br />
                <label><input type="checkbox" /> 钻孔信息 (孔号: ZK001, 坐标: 123,456)</label><br />
                <label><input type="checkbox" defaultChecked /> 开拓运输系统 (运距: 5km, 坡度: 8%)</label><br />
                <label><input type="checkbox" /> 煤层信息 (厚度: 3m, 倾角: 15°)</label><br />
                <label><input type="checkbox" /> 无人机三维模型</label>
              </div>
            </Card>

            {/* 储量管理概览 */}
            <Card title="储量管理 - 概览">
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

            {/* 无人机数据 */}
            <Card title="无人机数据">
              <div style={{ minHeight: '150px' }}>
                <p><strong>视频播放器:</strong> <a href="https://www.example.com/drone_video.mp4" target="_blank" rel="noopener noreferrer">查看最新航拍视频</a></p>
                <p><strong>数据列表:</strong></p>
                <ul>
                  <li><a href="https://www.example.com/survey_data_2024.zip">2024年测绘数据.zip</a></li>
                  <li><a href="https://www.example.com/point_cloud_2024.las">2024年点云数据.las</a></li>
                </ul>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default GeologicalAssurance;