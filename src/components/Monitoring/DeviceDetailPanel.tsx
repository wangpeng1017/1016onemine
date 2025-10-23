import React from 'react';
import { Card, Descriptions, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface DeviceDetailPanelProps {
  device: {
    id: string;
    type: string;
    status: string;
    currentSpeed: number;
    fuelLevel: number;
    workingHours: number;
    efficiency: number;
  } | null;
  onClose: () => void;
}

const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = ({ device, onClose }) => {
  if (!device) {
    return null;
  }

  return (
    <Card
      title={`设备详情: ${device.id}`}
      extra={<Button icon={<CloseOutlined />} onClick={onClose} type="text" />}
      style={{
        width: 300,
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="ID">{device.id}</Descriptions.Item>
        <Descriptions.Item label="类型">{device.type}</Descriptions.Item>
        <Descriptions.Item label="状态">{device.status}</Descriptions.Item>
        <Descriptions.Item label="当前速度">{device.currentSpeed} km/h</Descriptions.Item>
        <Descriptions.Item label="燃油量">{device.fuelLevel}%</Descriptions.Item>
        <Descriptions.Item label="工作时长">{device.workingHours} 小时</Descriptions.Item>
        <Descriptions.Item label="效率">{device.efficiency}%</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DeviceDetailPanel;