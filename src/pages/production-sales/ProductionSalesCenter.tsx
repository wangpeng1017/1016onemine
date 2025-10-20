import React from 'react';
import { Card, Tabs } from 'antd';
import { BarChartOutlined, DatabaseOutlined, LineChartOutlined, CommentOutlined } from '@ant-design/icons';
import SalesPlanPage from './SalesPlanPage';
import InventoryManagementPage from './InventoryManagementPage';

// 简化版报表和反馈页面
const ReportPage: React.FC = () => (
  <Card style={{ padding: 24, minHeight: 600 }}>
    <h2>产存销报表</h2>
    <p>产量报表、存量报表、销量报表、产存销平衡表功能开发中...</p>
  </Card>
);

const FeedbackPage: React.FC = () => (
  <Card style={{ padding: 24, minHeight: 600 }}>
    <h2>销售反馈</h2>
    <p>销售数据看板、客户反馈管理功能开发中...</p>
  </Card>
);

const ProductionSalesCenter: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title="智慧产运销管理中心">
        <Tabs
          defaultActiveKey="plan"
          tabPosition="left"
          style={{ minHeight: 600 }}
          items={[
            {
              key: 'plan',
              label: (
                <span>
                  <BarChartOutlined />
                  销售计划
                </span>
              ),
              children: <SalesPlanPage />
            },
            {
              key: 'inventory',
              label: (
                <span>
                  <DatabaseOutlined />
                  存量管理
                </span>
              ),
              children: <InventoryManagementPage />
            },
            {
              key: 'report',
              label: (
                <span>
                  <LineChartOutlined />
                  产存销报表
                </span>
              ),
              children: <ReportPage />
            },
            {
              key: 'feedback',
              label: (
                <span>
                  <CommentOutlined />
                  销售反馈
                </span>
              ),
              children: <FeedbackPage />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default ProductionSalesCenter;
