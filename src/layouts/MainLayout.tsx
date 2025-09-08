import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  AlertOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudUploadOutlined,
  RadarChartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'device-management',
      icon: <DatabaseOutlined />,
      label: '设备管理',
    },
    {
      key: 'model-management',
      icon: <RadarChartOutlined />,
      label: '模型管理',
    },
    {
      key: 'threshold-settings',
      icon: <SettingOutlined />,
      label: '阈值设置',
    },
    {
      key: 'monitoring-data',
      icon: <BarChartOutlined />,
      label: '监测数据',
      children: [
        {
          key: 'monitoring-data/surface-displacement',
          label: '表面位移',
        },
        {
          key: 'monitoring-data/crack-gauge',
          label: '裂缝计',
        },
        {
          key: 'monitoring-data/earth-pressure',
          label: '土压力',
        },
        {
          key: 'monitoring-data/groundwater',
          label: '地下水',
        },
        {
          key: 'monitoring-data/blast-vibration',
          label: '爆破振动',
        },
        {
          key: 'monitoring-data/rain-gauge',
          label: '雨量计',
        },
        {
          key: 'monitoring-data/radar',
          label: '雷达',
        },
      ],
    },
    {
      key: 'alarm-records',
      icon: <AlertOutlined />,
      label: '告警记录',
    },
    {
      key: 'data-reporting',
      icon: <CloudUploadOutlined />,
      label: '数据上报',
      children: [
        {
          key: 'data-reporting/console',
          label: '控制台',
        },
        {
          key: 'data-reporting/history-query',
          label: '历史查询',
        },
      ],
    },
    {
      key: 'account-management',
      icon: <UserOutlined />,
      label: '账号管理',
    },
    {
      key: 'system-config',
      icon: <SettingOutlined />,
      label: '系统配置',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录逻辑
      console.log('退出登录');
    }
  };

  const getCurrentKey = () => {
    const path = location.pathname.slice(1);
    return path || 'home';
  };

  return (
    <Layout style={{ height: '100vh' }}>
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
            fontSize: collapsed ? 16 : 18,
            fontWeight: 'bold',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {collapsed ? '矿山' : '矿山监测系统'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space size="middle">
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text>管理员</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
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

export default MainLayout;
