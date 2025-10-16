import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  UserOutlined, 
  ToolOutlined, 
  SettingOutlined,
  DatabaseOutlined,
  TeamOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title } = Typography;

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'basic-functions',
      label: '基础功能',
      icon: <SettingOutlined />,
      children: [
        { key: '/settings/data-dictionary', label: '数据字典', icon: <DatabaseOutlined /> },
        { key: '/settings/account-management', label: '账号管理', icon: <UserOutlined /> },
        { key: '/settings/system-config', label: '系统配置', icon: <SettingOutlined /> },
      ],
    },
    {
      key: 'master-data',
      label: '主数据管理',
      icon: <DatabaseOutlined />,
      children: [
        { key: '/settings/master-data/personnel', label: '人员', icon: <TeamOutlined /> },
        { key: '/settings/master-data/equipment', label: '设备', icon: <ToolOutlined /> },
        { key: '/settings/master-data/ore', label: '矿石', icon: <DatabaseOutlined /> },
        { key: '/settings/master-data/ore-body', label: '矿体', icon: <DatabaseOutlined /> },
        { key: '/settings/master-data/environment', label: '环境', icon: <SafetyOutlined /> },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
            {collapsed ? '设置' : '系统设置'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['basic-functions', 'master-data']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SettingsLayout;