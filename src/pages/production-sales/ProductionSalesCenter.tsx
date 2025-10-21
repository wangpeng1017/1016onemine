import React from 'react';
import { Card, Tabs } from 'antd';
import { BarChartOutlined, DatabaseOutlined, LineChartOutlined, CommentOutlined } from '@ant-design/icons';
import SalesPlanPageEnhanced from './SalesPlanPageEnhanced';
import InventoryManagementPageEnhanced from './InventoryManagementPageEnhanced';
import ReportPageEnhanced from './ReportPageEnhanced';
import FeedbackPageEnhanced from './FeedbackPageEnhanced';

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
              children: <SalesPlanPageEnhanced />
            },
            {
              key: 'inventory',
              label: (
                <span>
                  <DatabaseOutlined />
                  存量管理
                </span>
              ),
              children: <InventoryManagementPageEnhanced />
            },
            {
              key: 'report',
              label: (
                <span>
                  <LineChartOutlined />
                  产存销报表
                </span>
              ),
              children: <ReportPageEnhanced />
            },
            {
              key: 'feedback',
              label: (
                <span>
                  <CommentOutlined />
                  销售反馈
                </span>
              ),
              children: <FeedbackPageEnhanced />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default ProductionSalesCenter;
