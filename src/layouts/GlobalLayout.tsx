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

  const handleTopMenuSelect = (topMenu: string, subMenu: string) => {
    const leftMenu = getLeftMenuForSubMenu(subMenu);
    setCurrentMenu(topMenu, subMenu, leftMenu);

    // 根据选择的菜单项导航到相应的页面
    if (subMenu === 'home') {
      navigate('/home');
    } else if (subMenu === 'slope-monitoring') {
      navigate('/slope-monitoring/slope-home');
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
    } else {
      navigate('/home'); // 默认跳转到首页
    }
  };

  const handleLeftMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
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
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          padding: 0,
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        <TopNavigation onMenuSelect={handleTopMenuSelect} />
      </Header>

      <Layout style={{ flex: 1 }}>
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

        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;
