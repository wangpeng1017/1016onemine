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
            src="https://placeholder.com/mining-engineering-quality-software" // 占位符URL，实际部署时替换为采矿工程质量管理软件的URL
            title="采矿工程质量管理软件集成界面"
            style={{ width: '80%', height: '60%', border: '1px solid #ccc' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MiningEngineeringQuality;