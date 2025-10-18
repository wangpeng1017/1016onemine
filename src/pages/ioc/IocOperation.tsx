import React from 'react';
import { Card, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const IocOperation: React.FC = () => {
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
            color: '#f5222d',
            marginBottom: 24 
          }} 
        />
        <Title level={3} style={{ marginBottom: 16 }}>
          IOC中心 - 运转综合主题
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#595959', marginBottom: 24 }}>
          功能开发中，敬请期待...
        </Paragraph>
        <Paragraph style={{ color: '#8c8c8c', marginBottom: 0 }}>
          该主题将包含设备状态、运转指标、维保管理等功能
        </Paragraph>
        <Paragraph style={{ color: '#8c8c8c', marginTop: 8 }}>
          预计下周开始开发
        </Paragraph>
      </Card>
    </div>
  );
};

export default IocOperation;
