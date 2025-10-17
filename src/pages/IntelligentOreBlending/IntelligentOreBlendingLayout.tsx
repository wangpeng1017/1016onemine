import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { CalendarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import BlendingPlanContent from './BlendingPlanContent';
import IntelligentBlendingContent from './IntelligentBlendingContent';

const { Sider, Content } = Layout;

const IntelligentOreBlendingLayout: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('blending-plan');

  const menuItems = [
    {
      key: 'blending-plan',
      icon: <CalendarOutlined />,
      label: '配矿计划',
    },
    {
      key: 'intelligent-blending',
      icon: <ThunderboltOutlined />,
      label: '智能配矿',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'blending-plan':
        return <BlendingPlanContent />;
      case 'intelligent-blending':
        return <IntelligentBlendingContent />;
      default:
        return <BlendingPlanContent />;
    }
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
      <Sider
        width={200}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{
          padding: '16px',
          fontSize: 16,
          fontWeight: 600,
          color: '#262626',
          borderBottom: '1px solid #f0f0f0',
        }}>
          智能配矿管理
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ background: '#f0f2f5' }}>
        <Content style={{ margin: 0 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default IntelligentOreBlendingLayout;
