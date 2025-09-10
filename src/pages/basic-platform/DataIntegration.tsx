import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const DataIntegration: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>数据集成平台</Title>
        <Paragraph>
          数据集成平台提供数据采集、清洗、转换、同步等数据处理服务，支持多种数据源的集成。
        </Paragraph>
        <iframe
          src="http://123.235.0.227:8081/login.html"
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
          }}
          title="数据集成平台"
        />
      </Card>
    </div>
  );
};

export default DataIntegration;
