import React from 'react';
import { Card, Col } from 'antd';

interface KpiCardProps {
  title: string;
  value: string;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, color }) => {
  return (
    <Col span={8}>
      <Card title={title} bordered={false}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</p>
      </Card>
    </Col>
  );
};

export default KpiCard;