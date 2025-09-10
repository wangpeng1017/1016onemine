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
        <iframe
          src="https://iot.iimake.com/home"
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
          }}
          title="物联网平台"
        />
      </Card>
    </div>
  );
};

export default IotPlatform;
