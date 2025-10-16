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
      navigate('/slope-monitoring/home');
    } else if (subMenu === 'personnel-safety') {
      navigate('/personnel-safety/home');
    } else if (subMenu === 'ioc-planning') {
      navigate('/ioc-center/planning/home');
    }
    // 可以根据需要添加更多的路由映射
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
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#262626',
              fontSize: collapsed ? 16 : 14,
              fontWeight: 'bold',
              borderBottom: '1px solid #f0f0f0',
              paddingLeft: collapsed ? 0 : 16,
              paddingRight: collapsed ? 0 : 16,
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {collapsed ? '菜单' : currentSubMenu ? `${currentSubMenu}` : '菜单'}
          </div>
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
