import React, { useState } from 'react';
import { Menu, Dropdown, Button, Badge, Avatar, Space } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
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
  onSettingsClick?: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuSelect, onSettingsClick }) => {
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
        { key: 'equipment-management', label: '设备管理系统' },
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
      <div style={{ display: 'flex', gap: 8 }}>
        {topMenuItems.map((item) => {
          const isActive = currentTopMenu === item.key;
          const isParent = item.children && item.children.length > 0;

          const baseStyle: React.CSSProperties = {
            borderRadius: 20,
            padding: '6px 12px',
            color: isActive ? '#fff' : '#cbd5e1',
            background: isActive ? 'linear-gradient(135deg, #3b82f6, #9333ea)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            fontWeight: isActive ? 600 : 500,
          };

          if (isParent) {
            const subMenu: MenuProps['items'] = item.children!.map((child) => ({
              key: child.key,
              label: child.label,
              onClick: () => onMenuSelect(item.key, child.key),
            }));

            return (
              <Dropdown key={item.key} menu={{ items: subMenu }} placement="bottomLeft">
                <Button type="text" style={baseStyle}>
                  {item.label}
                </Button>
              </Dropdown>
            );
          }

          return (
            <Button key={item.key} type="text" onClick={() => handleTopMenuClick(item)} style={baseStyle}>
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
        padding: '8px 16px',
        background: 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          padding: '8px 12px',
          background: 'rgba(13,17,23,0.75)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            智慧矿山平台
          </div>
          <div style={{ flex: 1, marginLeft: 8 }}>{renderTopMenu()}</div>
        </div>
        <Space size="large" align="center">
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, color: '#94a3b8' }} />
          </Badge>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer', color: '#cbd5e1' }}>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default TopNavigation;
