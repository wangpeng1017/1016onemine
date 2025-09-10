import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>矿山安全监测平台</Title>
        <Paragraph>
          欢迎使用矿山安全监测平台，这里将展示矿山监测的综合地图视图。
        </Paragraph>
        <div style={{ 
          height: '600px', 
          border: '2px solid #1890ff', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f8ff',
          fontSize: '18px',
          color: '#1890ff',
          fontWeight: 'bold',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>🗺️ 模拟地图区域</div>
          <div style={{ fontSize: '14px', fontWeight: 'normal', textAlign: 'center' }}>
            此处将嵌入外部地图网页
            <br />
            用于显示矿山监测点分布和实时状态
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
