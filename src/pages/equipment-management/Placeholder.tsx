import React from 'react';
import { Card, Empty } from 'antd';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <Card title={title}>
      <Empty description={`${title}功能开发中...`} />
    </Card>
  );
};

export default Placeholder;
