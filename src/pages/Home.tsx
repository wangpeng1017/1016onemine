import React from 'react';
import { Card } from 'antd';

const Home: React.FC = () => {
  return (
    <div>
      <div className="page-title">矿山监测系统首页</div>
      
      <Card className="custom-card" style={{ padding: 0 }}>
        <div style={{ 
          width: '100%', 
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <img 
            src="./首页.png" 
            alt="矿山监测系统首页" 
            style={{ 
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              display: 'block'
            }} 
            onError={(e) => {
              console.error('图片加载失败:', e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Home;
