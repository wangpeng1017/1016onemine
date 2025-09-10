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
        <iframe
          src="http://123.235.0.227:8089/ria/editor/edit?id=1912037892906917890&luciad_token=yqoPVWVqEq6mbV1XEGYOOb3UipgVKUXg"
          style={{
            width: '100%',
            height: '600px',
            border: '2px solid #1890ff',
            borderRadius: '8px'
          }}
          title="Luciad地图编辑器"
        />
      </Card>
    </div>
  );
};

export default Home;
