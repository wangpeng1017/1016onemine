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
  isBasemap: boolean; // 是否有模型服务（true: 已上传）
  serviceZipName?: string; // 已上传服务包名称（可选）
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
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ModelRow | null>(null);
  const [form] = Form.useForm();

  const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;


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
              <Button type="primary" onClick={() => setAddVisible(true)}>新增模型</Button>
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
                  <Option value="倾斜三维">倾斜三维</Option>
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
                  <Option value="3DTILES">3DTILES</Option>
                  <Option value="PTS">PTS</Option>
                  <Option value="DXF">DXF</Option>
                  <Option value="DWG">DWG</Option>
                  <Option value="GEOTIFF">GEOTIFF</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serviceType" label="服务类型" rules={[{ required: true }]}>
                <Select>
                  <Option value="OGC3DTILES">OGC3DTILES</Option>
                  <Option value="HSPC">HSPC</Option>
                  <Option value="WMS">WMS</Option>
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
          <Form.Item name="serviceZip" label="服务ZIP压缩包" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload.Dragger name="files" multiple={false} beforeUpload={() => false} accept=".zip">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">点击或拖拽ZIP文件到此处（仅前端预览，不会实际上传）</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelManagement;
