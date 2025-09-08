import React from 'react';
import { Card, Row, Col } from 'antd';

const HistoryQuery: React.FC = () => {
  return (
    <div>
      <div className="page-title">数据上报 - 历史查询</div>
      
      {/* 主查询界面 */}
      <Card className="custom-card" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img 
            src="./数据上报-历史查询.png" 
            alt="数据上报历史查询" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: '8px'
            }}
            onError={(e) => {
              console.error('历史查询图片加载失败');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </Card>

      {/* 查看按钮和推送详情 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="查看按钮功能" className="custom-card">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <img 
                src="./数据上报-历史查询-查看按钮.png" 
                alt="查看按钮" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.error('查看按钮图片加载失败');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="推送详情" className="custom-card">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <img 
                src="./数据上报-历史查询-推送详情.png" 
                alt="推送详情" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.error('推送详情图片加载失败');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HistoryQuery;
