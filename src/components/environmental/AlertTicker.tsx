import React from 'react';
import { Card, List, Tag, Button, Empty } from 'antd';
import { WarningOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import type { Alert } from '../../types/environmental';

interface AlertTickerProps {
  alerts: Alert[];
  maxHeight?: number;
  onAcknowledge?: (id: string) => void;
}

const AlertTicker: React.FC<AlertTickerProps> = ({ alerts, maxHeight = 300, onAcknowledge }) => {
  const unacknowledged = alerts.filter(a => !a.acknowledged);

  const getIcon = (level: Alert['level']) => {
    return level === 'alarm' ? (
      <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
    ) : (
      <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
    );
  };

  const getTypeLabel = (type: Alert['type']) => {
    const labels = { water: '水务', air: '大气', noise: '噪声' };
    return labels[type];
  };

  return (
    <Card
      title={
        <span>
          <WarningOutlined style={{ marginRight: 8 }} />
          实时警报 {unacknowledged.length > 0 && (
            <Tag color="red" style={{ marginLeft: 8 }}>{unacknowledged.length} 条未确认</Tag>
          )}
        </span>
      }
      size="small"
    >
      <div style={{ maxHeight, overflowY: 'auto' }}>
        {alerts.length === 0 ? (
          <Empty description="暂无警报" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={alerts}
            renderItem={item => (
              <List.Item
                key={item.id}
                style={{
                  opacity: item.acknowledged ? 0.5 : 1,
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <List.Item.Meta
                  avatar={getIcon(item.level)}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color={item.level === 'alarm' ? 'red' : 'orange'}>
                        {item.level === 'alarm' ? '报警' : '预警'}
                      </Tag>
                      <Tag>{getTypeLabel(item.type)}</Tag>
                      <span style={{ fontSize: 12, color: '#999' }}>{item.timestamp}</span>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <strong>{item.location}</strong>: {item.message}
                      </div>
                      {!item.acknowledged && onAcknowledge && (
                        <Button
                          type="link"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => onAcknowledge(item.id)}
                        >
                          确认
                        </Button>
                      )}
                      {item.acknowledged && (
                        <Tag color="green" icon={<CheckOutlined />}>已确认</Tag>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default AlertTicker;
