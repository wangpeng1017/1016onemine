import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const IotPlatform: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>物联网平台</Title>
        <Paragraph>
          物联网平台提供设备接入、数据采集、设备管理、规则引擎等物联网核心服务。
        </Paragraph>
        <div style={{ 
          height: '600px', 
          border: '1px solid #d9d9d9', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          fontSize: '16px',
          color: '#666'
        }}>
          物联网平台嵌入区域
          <br />
          （此处将嵌入外部网页）
        </div>
      </Card>
    </div>
  );
};

export default IotPlatform;
