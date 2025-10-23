import React, { useState, useEffect, useRef } from 'react';
import { Tag, Card } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Alert {
  id: string;
  message: string;
  timestamp: string;
  level: '紧急' | '警告' | '通知';
}

const generateRandomAlert = (): Alert => {
  const messages = [
    '设备XXX发生故障',
    '区域Y气体浓度超标',
    '传感器Z数据异常',
    '网络连接中断',
    '系统过载预警',
  ];
  const levels: Array<Alert['level']> = ['紧急', '警告', '通知'];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  return {
    id: Math.random().toString(36).substring(7),
    message: randomMessage,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    level: randomLevel,
  };
};

const AlertTicker: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 初始加载一些告警
    setAlerts([
      generateRandomAlert(),
      generateRandomAlert(),
      generateRandomAlert(),
    ]);

    const interval = setInterval(() => {
      setAlerts((prevAlerts) => [generateRandomAlert(), ...prevAlerts].slice(0, 5)); // 保持最多5条告警
    }, 3000); // 每3秒生成一条新告警

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!tickerRef.current) return;

    const ticker = tickerRef.current;
    let animationFrameId: number;
    let scrollSpeed = 1; // 滚动速度

    const animateScroll = () => {
      if (!isPaused) {
        ticker.scrollTop += scrollSpeed;
        if (ticker.scrollTop + ticker.clientHeight >= ticker.scrollHeight) {
          ticker.scrollTop = 0; // 滚动到底部后回到顶部
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [alerts, isPaused]);

  const getLevelColor = (level: Alert['level']) => {
    switch (level) {
      case '紧急':
        return 'error';
      case '警告':
        return 'warning';
      case '通知':
        return 'processing';
      default:
        return 'default';
    }
  };

  return (
    <Card
      title="实时告警"
      bordered={false}
      style={{ width: '100%', height: '300px', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={tickerRef}
        style={{ height: '100%', overflowY: 'hidden', position: 'relative' }}
      >
        {alerts.map((alert) => (
          <div key={alert.id} style={{ marginBottom: '8px' }}>
            <Tag color={getLevelColor(alert.level)}>{alert.level}</Tag>
            <span style={{ marginLeft: '8px' }}>{alert.message}</span>
            <span style={{ float: 'right', color: '#999' }}>
              {dayjs(alert.timestamp).fromNow()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertTicker;