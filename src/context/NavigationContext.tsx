import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { MenuProps } from 'antd';

export interface LeftMenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: LeftMenuItem[];
}

interface NavigationContextType {
  currentTopMenu: string; // 当前选中的顶部菜单 (一级)
  currentSubMenu: string; // 当前选中的二级菜单
  leftMenuItems: LeftMenuItem[]; // 左侧菜单配置
  setCurrentMenu: (topMenu: string, subMenu: string, leftItems: LeftMenuItem[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTopMenu, setCurrentTopMenu] = useState('home');
  const [currentSubMenu, setCurrentSubMenu] = useState('home');
  const [leftMenuItems, setLeftMenuItems] = useState<LeftMenuItem[]>([]);

  const setCurrentMenu = (topMenu: string, subMenu: string, leftItems: LeftMenuItem[]) => {
    setCurrentTopMenu(topMenu);
    setCurrentSubMenu(subMenu);
    setLeftMenuItems(leftItems);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentTopMenu,
        currentSubMenu,
        leftMenuItems,
        setCurrentMenu,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
