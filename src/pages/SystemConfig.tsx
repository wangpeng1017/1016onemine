import React from 'react';
import { Navigate } from 'react-router-dom';

// 该页面已下线，统一重定向到“项目信息”子页面。
// 保留文件仅用于兼容历史链接；去除所有多余类型和实现，避免构建错误。

const SystemConfig: React.FC = () => {
  return <Navigate to="/system-config/project-info" replace />;
};

export default SystemConfig;
