import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  UserOutlined, 
  ToolOutlined, 
  SettingOutlined,
  DatabaseOutlined,
  TeamOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';

const { Header, Sider, Content } = Layout;

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

  const handleTopMenuSelect = (topMenu: string, subMenu: string) => {
    // 处理顶部菜单选择，跳转到其他页面
    if (subMenu === 'home') {
      navigate('/home');
    } else if (subMenu === 'slope-monitoring') {
      navigate('/slope-monitoring/slope-device-management');
    } else if (subMenu === 'personnel-safety') {
      navigate('/personnel-safety/personnel-home');
    } else if (subMenu === 'ioc-planning') {
      navigate('/home');
    } else if (subMenu === 'ioc-production') {
      navigate('/home');
    } else if (subMenu === 'ioc-safety') {
      navigate('/home');
    } else if (subMenu === 'ioc-operation') {
      navigate('/home');
    } else if (subMenu === 'production-execution') {
      navigate('/production-execution/production-continuity');
    } else if (subMenu === 'equipment-management') {
      navigate('/equipment-management/equipment-ledger');
    } else {
      navigate('/home');
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: 0,
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        <TopNavigation onMenuSelect={handleTopMenuSelect} onSettingsClick={handleSettingsClick} />
      </Header>
      
      <Layout style={{ flex: 1 }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          style={{
            background: '#ffffff',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['basic-functions', 'master-data']}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
        
        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SettingsLayout;