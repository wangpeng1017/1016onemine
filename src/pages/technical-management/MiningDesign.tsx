import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const MiningDesign: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>采矿设计</Title>
      <Card>
        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Text type="secondary" style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>
            该页面用于集成专业的采矿设计软件，例如 Surpac, Datamine, Vulcan 等。
          </Text>
          <Text type="secondary" style={{ fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
            请在实际部署时，将以下 iframe 的 `src` 属性替换为您的采矿设计软件的 URL。
          </Text>
          <iframe
            src="https://placeholder.com/mining-design-software" // 占位符URL，实际部署时替换为采矿设计软件的URL
            title="采矿设计软件集成界面"
            style={{ width: '80%', height: '60%', border: '1px solid #ccc' }}
          />
          <Text type="secondary" style={{ fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>
            当前为占位符，实际部署时请替换为可用的URL。
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MiningDesign;