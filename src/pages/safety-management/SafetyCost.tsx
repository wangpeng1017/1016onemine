import React from 'react';
import { Card, Result, Button } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const SafetyCost: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Result
          icon={<SafetyOutlined />}
          title="SafetyCost"
          subTitle="此模块正在开发中,敬请期待..."
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              返回
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default SafetyCost;
