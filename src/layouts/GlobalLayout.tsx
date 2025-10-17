import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import TopNavigation from '../components/TopNavigation';
import { useNavigation } from '../context/NavigationContext';
import { getLeftMenuForSubMenu } from '../config/leftMenuConfig';

const { Header, Sider, Content } = Layout;

const GlobalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTopMenu, currentSubMenu, leftMenuItems, setCurrentMenu } =
    useNavigation();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleTopMenuSelect = (topMenu: string, subMenu: string) => {
    const leftMenu = getLeftMenuForSubMenu(subMenu);
    setCurrentMenu(topMenu, subMenu, leftMenu);

    // 根据选择的菜单项导航到相应的页面
    if (subMenu === 'home') {
      navigate('/home');
    } else if (subMenu === 'slope-monitoring') {
      navigate('/slope-monitoring/slope-device-management');
    } else if (subMenu === 'personnel-safety') {
      navigate('/personnel-safety/personnel-home');
    } else if (subMenu === 'ioc-planning') {
      navigate('/home'); // 暂时跳转到首页
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
      navigate('/home'); // 默认跳转到首页
    }
  };

  const handleLeftMenuClick = ({ key }: { key: string }) => {
    // 根据当前路由前缀决定导航路径
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/slope-monitoring')) {
      // 在边坡监测管理模块下
      navigate(`/slope-monitoring/${key}`);
    } else if (currentPath.startsWith('/personnel-safety')) {
      // 在人员定位安全模块下
      navigate(`/personnel-safety/${key}`);
    } else if (currentPath.startsWith('/production-execution')) {
      // 在生产执行系统模块下
      navigate(`/production-execution/${key}`);
    } else if (currentPath.startsWith('/equipment-management')) {
      // 在设备管理系统模块下
      navigate(`/equipment-management/${key}`);
    } else {
      // 其他模块或默认
      navigate(`/${key}`);
    }
  };

  const getCurrentLeftMenuKey = () => {
    const path = location.pathname.slice(1);
    return path || 'home';
  };

  // 转换左侧菜单格式为Ant Design Menu可用的格式
  const convertMenuItems = (items: any[]): any[] => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children
        ? convertMenuItems(item.children)
        : undefined,
    }));
  };

  return (
    <Layout style={{ height: '100vh', background: '#0f172a' }}>
      <Header
        style={{
          padding: 0,
          background: 'transparent',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        <TopNavigation onMenuSelect={handleTopMenuSelect} onSettingsClick={handleSettingsClick} />
      </Header>

      <Layout style={{ flex: 1 }}>
        {leftMenuItems.length > 0 && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
              background: '#ffffff',
              borderRight: '1px solid #f0f0f0',
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[getCurrentLeftMenuKey()]}
              items={convertMenuItems(leftMenuItems)}
              onClick={handleLeftMenuClick}
              style={{ borderRight: 0 }}
            />
          </Sider>
        )}

        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;
