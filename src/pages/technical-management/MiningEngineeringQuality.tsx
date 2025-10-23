import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const MiningEngineeringQuality: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>采矿工程质量</Title>
      <Card>
        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Text type="secondary" style={{ fontSize: '20px', marginBottom: '16px' }}>
            此处将集成专业的采矿工程质量管理软件
          </Text>
          <iframe
            src="https://example.com/mining-engineering-quality-software" // 替换为实际的采矿工程质量管理软件URL
            title="采矿工程质量管理软件"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MiningEngineeringQuality;