import React, { useEffect } from 'react';
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
  const [collapsed] = React.useState(false);

  // 根据当前路由初始化导航状态
  useEffect(() => {
    const path = location.pathname;
    
    // 根据路径确定当前的菜单状态
    let topMenu = 'home';
    let subMenu = 'home';
    
    if (path.startsWith('/slope-monitoring')) {
      topMenu = 'smart-safety';
      subMenu = 'slope-monitoring';
    } else if (path.startsWith('/personnel-safety')) {
      topMenu = 'smart-safety';
      subMenu = 'personnel-safety';
    } else if (path.startsWith('/production-execution')) {
      topMenu = 'smart-production';
      subMenu = 'production-execution';
    } else if (path.startsWith('/equipment-management')) {
      topMenu = 'smart-production';
      subMenu = 'equipment-management';
    } else if (path.startsWith('/intelligent-ore-blending')) {
      topMenu = 'smart-mine-design';
      subMenu = 'intelligent-ore-blending';
    } else if (path.startsWith('/env-monitoring')) {
      topMenu = 'env-monitoring';
      subMenu = 'env-monitoring';
    } else if (path.startsWith('/smart-prod-ops-sales')) {
      topMenu = 'smart-prod-ops-sales';
      subMenu = 'smart-prod-ops-sales';
    } else if (path.startsWith('/ioc-planning')) {
      topMenu = 'ioc-center';
      subMenu = 'ioc-planning';
    } else if (path.startsWith('/ioc-production')) {
      topMenu = 'ioc-center';
      subMenu = 'ioc-production';
    } else if (path.startsWith('/ioc-safety')) {
      topMenu = 'ioc-center';
      subMenu = 'ioc-safety';
    } else if (path.startsWith('/ioc-operation')) {
      topMenu = 'ioc-center';
      subMenu = 'ioc-operation';
    } else if (path.startsWith('/safety-management')) {
      topMenu = 'smart-safety';
      subMenu = 'safety-management';
    } else if (path === '/home' || path === '/') {
      topMenu = 'home';
      subMenu = 'home';
    }
    
    // 只有在导航状态未初始化或者与当前路径不匹配时才设置
    if (currentTopMenu !== topMenu || currentSubMenu !== subMenu) {
      const leftMenu = getLeftMenuForSubMenu(subMenu);
      setCurrentMenu(topMenu, subMenu, leftMenu);
    }
  }, [location.pathname, currentTopMenu, currentSubMenu, setCurrentMenu]);

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
      navigate('/personnel-safety/personnel-tracking');
    } else if (subMenu === 'ioc-planning') {
      navigate('/ioc-planning');
    } else if (subMenu === 'ioc-production') {
      navigate('/ioc-production');
    } else if (subMenu === 'ioc-safety') {
      navigate('/ioc-safety');
    } else if (subMenu === 'ioc-operation') {
      navigate('/ioc-operation');
    } else if (subMenu === 'production-execution') {
      navigate('/production-execution/production-continuity');
    } else if (subMenu === 'equipment-management') {
      navigate('/equipment-management/equipment-ledger');
    } else if (subMenu === 'intelligent-ore-blending') {
      navigate('/intelligent-ore-blending');
    } else if (subMenu === 'env-monitoring') {
      navigate('/env-monitoring/env-home');
    } else if (subMenu === 'smart-prod-ops-sales') {
      navigate('/smart-prod-ops-sales');
    } else if (subMenu === 'safety-management') {
      navigate('/safety-management/home');
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
    } else if (currentPath.startsWith('/intelligent-ore-blending')) {
      // 在智能配矿管理模块下，保持在同一页面内切换左侧菜单
      return; // IntelligentOreBlendingLayout 组件内部处理菜单切换
    } else if (currentPath.startsWith('/env-monitoring')) {
      // 在综合环境监测模块下
      navigate(`/env-monitoring/${key}`);
    } else if (currentPath.startsWith('/safety-management')) {
      // 在安全管理中心模块下
      if (key === 'safety-management-home') {
        navigate('/safety-management/home');
      } else {
        navigate(`/safety-management/${key}`);
      }
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
