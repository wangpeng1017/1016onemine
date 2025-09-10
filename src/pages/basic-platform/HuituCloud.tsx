import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HuituCloud: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>慧图云平台</Title>
        <Paragraph>
          慧图云平台是基于云计算技术的地理信息服务平台，提供地图服务、空间分析、数据管理等功能。
        </Paragraph>
        <iframe
          src="https://imap.iimake.com/business/#/firmMyProduct?type=LUCIAD"
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
          }}
          title="慧图云平台"
        />
      </Card>
    </div>
  );
};

export default HuituCloud;
