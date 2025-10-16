import React, { useState } from 'react';
import { Menu, Dropdown, Button, Badge, Avatar, Space } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigation } from '../context/NavigationContext';

interface TopNavItem {
  key: string;
  label: string;
  children?: Array<{
    key: string;
    label: string;
  }>;
}

interface TopNavigationProps {
  onMenuSelect: (topMenu: string, subMenu: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuSelect }) => {
  const { currentTopMenu, currentSubMenu } = useNavigation();

  const topMenuItems: TopNavItem[] = [
    {
      key: 'home',
      label: '首页',
    },
    {
      key: 'ioc-center',
      label: 'IOC中心',
      children: [
        { key: 'ioc-planning', label: '规划设计主题' },
        { key: 'ioc-production', label: '生产综合主题' },
        { key: 'ioc-safety', label: '安全综合主题' },
        { key: 'ioc-operation', label: '运转综合主题' },
      ],
    },
    {
      key: 'smart-mine-design',
      label: '智慧矿山设计',
    },
    {
      key: 'smart-production',
      label: '智能生产协同',
      children: [
        { key: 'production-execution', label: '生产执行系统' },
      ],
    },
    {
      key: 'smart-safety',
      label: '智慧安全保障',
      children: [
        { key: 'slope-monitoring', label: '边坡监测管理' },
        { key: 'personnel-safety', label: '人员定位安全' },
      ],
    },
    {
      key: 'env-monitoring',
      label: '综合环境监测',
    },
    {
      key: 'smart-prod-ops-sales',
      label: '智慧产运销',
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

  const handleTopMenuClick = (item: TopNavItem) => {
    if (item.children && item.children.length > 0) {
      // 如果有子菜单，选择第一个子菜单
      const firstChild = item.children[0];
      onMenuSelect(item.key, firstChild.key);
    } else {
      onMenuSelect(item.key, item.key);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      console.log('退出登录');
    }
  };

  const renderTopMenu = () => {
    return (
      <div style={{ display: 'flex', gap: 0 }}>
        {topMenuItems.map((item) => {
          const isActive = currentTopMenu === item.key;
          const isParent = item.children && item.children.length > 0;

          if (isParent) {
            const subMenu: MenuProps['items'] = item.children!.map((child) => ({
              key: child.key,
              label: child.label,
              onClick: () => onMenuSelect(item.key, child.key),
            }));

            return (
              <Dropdown
                key={item.key}
                menu={{ items: subMenu }}
                placement="bottomLeft"
              >
                <Button
                  type={isActive ? 'primary' : 'text'}
                  style={{
                    borderRadius: 0,
                    borderBottom: isActive ? '2px solid #1890ff' : 'none',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </Button>
              </Dropdown>
            );
          }

          return (
            <Button
              key={item.key}
              type={isActive ? 'primary' : 'text'}
              onClick={() => handleTopMenuClick(item)}
              style={{
                borderRadius: 0,
                borderBottom: isActive ? '2px solid #1890ff' : 'none',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#262626' }}>
        智慧矿山平台
      </div>
      <div style={{ flex: 1, marginLeft: 32 }}>{renderTopMenu()}</div>
      <Space size="middle">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '18px' }} />
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
            <span>管理员</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default TopNavigation;
