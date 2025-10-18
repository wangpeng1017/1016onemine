import React from 'react';
import { Card, Empty, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SmartProdOpsSales: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <Card 
        style={{ 
          width: 600, 
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <ClockCircleOutlined 
          style={{ 
            fontSize: 72, 
            color: '#722ed1',
            marginBottom: 24 
          }} 
        />
        <Title level={3} style={{ marginBottom: 16 }}>
          智慧产运销模块
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#595959', marginBottom: 24 }}>
          功能开发中，敬请期待...
        </Paragraph>
        <Paragraph style={{ color: '#8c8c8c', marginBottom: 0 }}>
          该模块将包含产量统计、运输管理、销售分析等全链条管理功能
        </Paragraph>
        <Paragraph style={{ color: '#8c8c8c', marginTop: 8 }}>
          预计下周开始开发
        </Paragraph>
      </Card>
    </div>
  );
};

export default SmartProdOpsSales;
