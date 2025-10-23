import React from 'react';

interface IntegratedSoftwareViewerProps {
  url: string;
}

const IntegratedSoftwareViewer: React.FC<IntegratedSoftwareViewerProps> = ({ url }) => {
  return (
    <iframe
      src={url}
      title="Integrated Software"
      style={{ border: 'none', width: '100%', height: '100%' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // 增加沙箱属性以增强安全性
    ></iframe>
  );
};

export default IntegratedSoftwareViewer;