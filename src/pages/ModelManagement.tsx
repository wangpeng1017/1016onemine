import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Switch,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 表格数据结构（与提供的表头一致）
interface ModelRow {
  key: string;
  index: number; // 序号
  name: string; // 模型名称
  category: string; // 数据类别
  region: string; // 所属区域
  collectTime: string; // 采集时间
  dataType: '3DTILES' | 'PTS' | 'DXF' | 'DWG' | 'GEOTIFF'; // 数据类型
  serviceType: 'OGC3DTILES' | 'HSPC' | 'WMS'; // 服务类型
  isBasemap: boolean; // 是否底图
  serviceStatus: '服务正常' | '服务异常' | '维护中'; // 服务状态
}

const initialData: ModelRow[] = [
  {
    key: '1',
    index: 1,
    name: '3dtiles2505.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-05-31 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '2',
    index: 2,
    name: '3dtiles2505-2.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-05-31 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '3',
    index: 3,
    name: '3dtiles2504.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '4',
    index: 4,
    name: '3dtiles2503.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '5',
    index: 5,
    name: '3dtiles2502.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '6',
    index: 6,
    name: '3dtiles2502-2.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '7',
    index: 7,
    name: '3dtiles2501.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '8',
    index: 8,
    name: '3dtiles2500.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '9',
    index: 9,
    name: '3dtiles2499.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '10',
    index: 10,
    name: '3dtiles2498.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-03-15 00:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
];

const ModelManagement: React.FC = () => {
  const [data, setData] = useState<ModelRow[]>(initialData);

  const toggleBasemap = (record: ModelRow, checked: boolean) => {
    setData(prev => prev.map(item => (item.key === record.key ? { ...item, isBasemap: checked } : item)));
  };

  const columns: ColumnsType<ModelRow> = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 70 },
    { title: '模型名称', dataIndex: 'name', key: 'name', width: 220, render: (text: string, record) => (
      <Button type="link" onClick={() => handleModelNameClick(record)}>{text}</Button>
    ) },
    {
      title: '数据类别', dataIndex: 'category', key: 'category', width: 120,
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    { title: '所属区域', dataIndex: 'region', key: 'region', width: 100 },
    { title: '采集时间', dataIndex: 'collectTime', key: 'collectTime', width: 180 },
    { title: '数据类型', dataIndex: 'dataType', key: 'dataType', width: 110 },
    { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
    {
      title: '是否底图', dataIndex: 'isBasemap', key: 'isBasemap', width: 140,
      render: (_: any, record) => (
        <Space>
          <Switch size="small" checked={record.isBasemap} onChange={(checked) => toggleBasemap(record, checked)} />
          <span>{record.isBasemap ? '底图' : '非底图'}</span>
        </Space>
      ),
    },
    {
      title: '服务状态', dataIndex: 'serviceStatus', key: 'serviceStatus', width: 120,
      render: (text: string) => <Tag color="success">{text}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 160,
      render: (_: any, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
        </Space>
      ),
    },
  ];

  const handleModelNameClick = (row: ModelRow) => {
    Modal.info({
      title: '慧图云地图服务',
      content: '显示慧图云发布的地图服务',
      okText: '知道了',
    });
  };

  return (
    <div>
      <div className="page-title">模型管理</div>

      {/* 查询条件（与截图风格接近） */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select placeholder="数据类别" style={{ width: '100%' }} allowClear>
              <Option value="倾斜三维">倾斜三维</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="数据类型" style={{ width: '100%' }} allowClear>
              <Option value="3DTILES">3DTILES</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="服务类型" style={{ width: '100%' }} allowClear>
              <Option value="OGC3DTILES">OGC3DTILES</Option>
              <Option value="WMS">WMS</Option>
              <Option value="HSPC">HSPC</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Space>
              <Input placeholder="输入关键词" prefix={<SearchOutlined />} allowClear />
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="custom-card">
        <Table
          rowKey="key"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20, total: data.length, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
    </div>
  );
};

export default ModelManagement;
