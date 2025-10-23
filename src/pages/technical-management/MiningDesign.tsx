import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const MiningDesign: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>采矿设计</Title>
      <Card>
        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Text type="secondary" style={{ fontSize: '20px', marginBottom: '16px' }}>
            此处将集成专业的采矿设计软件
          </Text>
          <iframe
            src="https://example.com/mining-design-software" // 替换为实际的采矿设计软件URL
            title="采矿设计软件"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MiningDesign;