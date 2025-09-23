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
  Modal,
  Form,
  Upload,
  message,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 数据类别选项
const DATA_CATEGORIES = [
  '卫星正射', '卫星形变', '线划图纸', '调查数据', 
  '倾斜三维', '单体模型', '点云&全景', '其他'
] as const;

// 数据类型选项
const DATA_TYPES = [
  'IFC', 'OSGB', '3DTILES', 'OBJ', 'DWG', 'DXF', 'SHP', 'HSPC'
] as const;

// 服务类型选项
const SERVICE_TYPES = [
  'CSW', 'FILESERVER', 'HSPC', 'LTS', 
  'OGC3DTILES', 'PANORAMICS', 'WCS', 'WFS'
] as const;

// 表格数据结构（与提供的表头一致）
interface ModelRow {
  key: string;
  index: number; // 序号
  name: string; // 模型名称
  category: typeof DATA_CATEGORIES[number]; // 数据类别
  region: string; // 所属区域
  collectTime: string; // 采集时间
  dataType: typeof DATA_TYPES[number]; // 数据类型
  serviceType: typeof SERVICE_TYPES[number]; // 服务类型
  isBasemap: boolean; // 是否有模型服务（true: 已上传）
  serviceZipName?: string; // 已上传服务包名称（可选）
  serviceStatus: '服务正常' | '服务异常' | '维护中'; // 服务状态
}

const initialData: ModelRow[] = [
  {
    key: '1',
    index: 1,
    name: '卫星正射影像_2025_01.zip',
    category: '卫星正射',
    region: '采场区域',
    collectTime: '2025-01-15 10:30:00',
    dataType: 'OSGB',
    serviceType: 'WCS',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '2',
    index: 2,
    name: '形变监测数据_202501.shp',
    category: '卫星形变',
    region: '排土场',
    collectTime: '2025-01-20 14:15:00',
    dataType: 'SHP',
    serviceType: 'WFS',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '3',
    index: 3,
    name: '设计图纸_采场区.dwg',
    category: '线划图纸',
    region: '采场区域',
    collectTime: '2025-02-10 09:00:00',
    dataType: 'DWG',
    serviceType: 'FILESERVER',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '4',
    index: 4,
    name: '地质调查报告_2025Q1.pdf',
    category: '调查数据',
    region: '全覆盖区域',
    collectTime: '2025-03-01 16:45:00',
    dataType: 'HSPC',
    serviceType: 'CSW',
    isBasemap: false,
    serviceStatus: '服务正常',
  },
  {
    key: '5',
    index: 5,
    name: '3dtiles2505.zip',
    category: '倾斜三维',
    region: '采场',
    collectTime: '2025-05-31 08:00:00',
    dataType: '3DTILES',
    serviceType: 'OGC3DTILES',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '6',
    index: 6,
    name: '爆破设备模型.ifc',
    category: '单体模型',
    region: '爆破作业区',
    collectTime: '2025-04-20 11:30:00',
    dataType: 'IFC',
    serviceType: 'LTS',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '7',
    index: 7,
    name: '电铲车点云数据.hspc',
    category: '点云&全景',
    region: '运输道路',
    collectTime: '2025-06-10 15:20:00',
    dataType: 'HSPC',
    serviceType: 'HSPC',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '8',
    index: 8,
    name: '全景影像_观景点.zip',
    category: '点云&全景',
    region: '观景区域',
    collectTime: '2025-07-05 13:10:00',
    dataType: 'OSGB',
    serviceType: 'PANORAMICS',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '9',
    index: 9,
    name: '水文数据.shp',
    category: '其他',
    region: '水体区域',
    collectTime: '2025-08-12 10:45:00',
    dataType: 'SHP',
    serviceType: 'WFS',
    isBasemap: false,
    serviceStatus: '服务异常',
  },
  {
    key: '10',
    index: 10,
    name: '设备模型_破碎机.obj',
    category: '单体模型',
    region: '破碎站',
    collectTime: '2025-09-15 12:00:00',
    dataType: 'OBJ',
    serviceType: 'FILESERVER',
    isBasemap: false,
    serviceStatus: '维护中',
  },
  {
    key: '11',
    index: 11,
    name: '采场边界图.dxf',
    category: '线划图纸',
    region: '采场边界',
    collectTime: '2025-06-25 09:30:00',
    dataType: 'DXF',
    serviceType: 'FILESERVER',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
  {
    key: '12',
    index: 12,
    name: '地质勘探数据_2025.hspc',
    category: '调查数据',
    region: '勘探区域',
    collectTime: '2025-05-10 07:15:00',
    dataType: 'HSPC',
    serviceType: 'CSW',
    isBasemap: true,
    serviceStatus: '服务正常',
  },
];

const ModelManagement: React.FC = () => {
  const [data, setData] = useState<ModelRow[]>(initialData);
  const [filteredData, setFilteredData] = useState<ModelRow[]>(initialData);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ModelRow | null>(null);
  const [form] = Form.useForm();
  
  // 筛选状态
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    dataType: undefined as string | undefined,
    serviceType: undefined as string | undefined,
    keyword: '' as string,
    dateRange: null as any,
  });

  const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;

  // 筛选处理函数
  const handleFilter = () => {
    let filtered = data;
    
    // 按数据类别筛选
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // 按数据类型筛选
    if (filters.dataType) {
      filtered = filtered.filter(item => item.dataType === filters.dataType);
    }
    
    // 按服务类型筛选
    if (filters.serviceType) {
      filtered = filtered.filter(item => item.serviceType === filters.serviceType);
    }
    
    // 按关键词筛选（模型名称）
    if (filters.keyword) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    
    // 按时间范围筛选
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.collectTime);
        return itemDate >= startDate.toDate() && itemDate <= endDate.toDate();
      });
    }
    
    setFilteredData(filtered);
  };
  
  // 重置筛选
  const handleReset = () => {
    setFilters({
      category: undefined,
      dataType: undefined,
      serviceType: undefined,
      keyword: '',
      dateRange: null,
    });
    setFilteredData(data);
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
      title: '模型服务', dataIndex: 'isBasemap', key: 'isBasemap', width: 140,
      render: (_: any, record) => (
        <Tag color={record.isBasemap ? 'blue' : 'default'}>
          {record.isBasemap ? (record.serviceZipName ? `已上传(${record.serviceZipName})` : '已上传') : '未上传'}
        </Tag>
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
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>编辑</Button>
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
        </Space>
      ),
    },
  ];

  const onEdit = (row: ModelRow) => {
    setSelectedRow(row);
    if (form?.setFieldsValue) form.setFieldsValue(row);
    setEditVisible(true);
  };

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
            <Select 
              placeholder="数据类别" 
              style={{ width: '100%' }} 
              allowClear
              value={filters.category}
              onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              {DATA_CATEGORIES.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="数据类型" 
              style={{ width: '100%' }} 
              allowClear
              value={filters.dataType}
              onChange={(value) => setFilters(prev => ({ ...prev, dataType: value }))}
            >
              {DATA_TYPES.map(dataType => (
                <Option key={dataType} value={dataType}>{dataType}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="服务类型" 
              style={{ width: '100%' }} 
              allowClear
              value={filters.serviceType}
              onChange={(value) => setFilters(prev => ({ ...prev, serviceType: value }))}
            >
              {SERVICE_TYPES.map(serviceType => (
                <Option key={serviceType} value={serviceType}>{serviceType}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              value={filters.dateRange}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Input 
                placeholder="输入关键词" 
                prefix={<SearchOutlined />} 
                allowClear 
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" onClick={() => setAddVisible(true)}>新增模型</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="custom-card">
        <Table
          rowKey="key"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 20, total: filteredData.length, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 1600 }}
        />
      </Card>

      {/* 新增/编辑 模型弹窗 */}
      <Modal
        title={selectedRow ? '编辑模型' : '新增模型'}
        open={addVisible || editVisible}
        onCancel={() => { setAddVisible(false); setEditVisible(false); setSelectedRow(null); }}
        onOk={() => {
          if (!form?.validateFields) {
            setAddVisible(false); setEditVisible(false); setSelectedRow(null); return;
          }
          form.validateFields().then(values => {
            const fileList = values.serviceZip as any[] | undefined;
            // 新增时必须上传zip
            if (!selectedRow && (!fileList || fileList.length === 0)) {
              message.error('请上传模型服务zip压缩包');
              return;
            }
            const zipName = fileList && fileList.length > 0 ? fileList[0].name : selectedRow?.serviceZipName;
            const patch = {
              ...values,
              isBasemap: !!zipName,
              serviceZipName: zipName,
            } as Partial<ModelRow>;
            if (selectedRow) {
              setData(prev => prev.map(r => r.key === selectedRow.key ? { ...selectedRow, ...patch } as ModelRow : r));
            } else {
              const newKey = String(Date.now());
              setData(prev => [{ key: newKey, index: prev.length + 1, ...patch } as ModelRow, ...prev]);
            }
            setAddVisible(false);
            setEditVisible(false);
            setSelectedRow(null);
          });
        }}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ category: '倾斜三维', region: '采场', dataType: '3DTILES', serviceType: 'OGC3DTILES', isBasemap: false, serviceStatus: '服务正常' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="模型名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="数据类别" rules={[{ required: true }]}>
                <Select>
                  {DATA_CATEGORIES.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="region" label="所属区域" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="collectTime" label="采集时间" rules={[{ required: true }]}>
                <Input placeholder="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dataType" label="数据类型" rules={[{ required: true }]}>
                <Select>
                  {DATA_TYPES.map(dataType => (
                    <Option key={dataType} value={dataType}>{dataType}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serviceType" label="服务类型" rules={[{ required: true }]}>
                <Select>
                  {SERVICE_TYPES.map(serviceType => (
                    <Option key={serviceType} value={serviceType}>{serviceType}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="serviceStatus" label="服务状态" rules={[{ required: true }]}>
                <Select>
                  <Option value="服务正常">服务正常</Option>
                  <Option value="服务异常">服务异常</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="serviceZip" label="模型服务" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload.Dragger name="files" multiple={false} beforeUpload={() => false} accept=".zip">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">点击或拖拽ZIP文件到此处</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelManagement;
