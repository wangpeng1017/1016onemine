import React from 'react';
import { Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RadarRow {
  key: string;
  index: number;         // 序号
  projectName: string;   // 项目名称
  radarName: string;     // 雷达名称
  manufacturer: string;  // 雷达制造商
  serialNo: string;      // 雷达序列号
  location: string;      // 位置
  owner: string;         // 负责人
  online: boolean;       // 在线状态
  lon: number;           // 经度(°)
  lat: number;           // 纬度(°)
  ellipsoidH: number;    // 大地高
  east: number;          // 东
  north: number;         // 北
  height: number;        // 高度
}

const data: RadarRow[] = [
  {
    key: '1',
    index: 1,
    projectName: '石头梅一号露天煤矿',
    radarName: 'S_SAR',
    manufacturer: '中安国泰',
    serialNo: '65222205370801000001',
    location: '采场',
    owner: '张谱',
    online: true,
    lon: 92.946080158416,
    lat: 44.494929858790684,
    ellipsoidH: 825,
    east: 495711.407,
    north: 4928818.942,
    height: 825,
  },
];

const columns: ColumnsType<RadarRow> = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 70 },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '雷达名称', dataIndex: 'radarName', key: 'radarName', width: 120 },
  { title: '雷达制造商', dataIndex: 'manufacturer', key: 'manufacturer', width: 140 },
  { title: '雷达序列号', dataIndex: 'serialNo', key: 'serialNo', width: 200 },
  { title: '位置', dataIndex: 'location', key: 'location', width: 100 },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 100 },
  { title: '在线状态', dataIndex: 'online', key: 'online', width: 100, render: (v: boolean) => v ? <Tag color="green">在线</Tag> : <Tag color="default">离线</Tag> },
  { title: '经度(°)', dataIndex: 'lon', key: 'lon', width: 130 },
  { title: '纬度(°)', dataIndex: 'lat', key: 'lat', width: 150 },
  { title: '大地高', dataIndex: 'ellipsoidH', key: 'ellipsoidH', width: 100 },
  { title: '东', dataIndex: 'east', key: 'east', width: 130 },
  { title: '北', dataIndex: 'north', key: 'north', width: 130 },
  { title: '高度', dataIndex: 'height', key: 'height', width: 100 },
];

const RadarDevices: React.FC = () => {
  return (
    <div>
      <div className="page-title">设备管理 - 雷达设备</div>
      <Card>
        <Table rowKey="key" columns={columns} dataSource={data} pagination={{ pageSize: 10 }} scroll={{ x: 1500 }} />
      </Card>
    </div>
  );
};

export default RadarDevices;

