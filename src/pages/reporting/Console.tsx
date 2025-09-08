import React from 'react';
import { Card } from 'antd';

const Console: React.FC = () => {
  return (
    <div>
      <div className="page-title">数据上报 - 控制台</div>
      <Card className="custom-card">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <img 
            src="./数据上报-控制台.png" 
            alt="数据上报控制台" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: '8px'
            }}
            onError={(e) => {
              console.error('控制台图片加载失败');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Console;
