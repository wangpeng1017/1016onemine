import React from 'react';
import { Card, Result, Button } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const TeamBuilding: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Result
          icon={<SafetyOutlined />}
          title="TeamBuilding"
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

export default TeamBuilding;
