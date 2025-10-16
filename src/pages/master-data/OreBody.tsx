import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, InputNumber, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

interface OreBodyData {
  key: string;
  bodyId: string;
  name: string;
  location: string;
  area: number;
  depth: number;
  thickness: number;
  reserves: number;
  slope: number;
  geologicalStructure: string;
  riskLevel: string;
  supervisor: string;
  status: string;
  description: string;
}

const OreBody: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OreBodyData | null>(null);
  const [form] = Form.useForm();

  const mockData: OreBodyData[] = [
    {
      key: '1',
      bodyId: 'OB001',
      name: '1302工作面',
      location: '东三采区',
      area: 15600,
      depth: 280,
      thickness: 3.2,
      reserves: 125000,
      slope: 15,
      geologicalStructure: '单斜构造',
      riskLevel: '中风险',
      supervisor: '市安监局',
      status: '开采中',
      description: '主要开采区域，煤质优良，地质条件稳定',
    },
    {
      key: '2',
      bodyId: 'OB002',
      name: '1304工作面',
      location: '东四采区',
      area: 18200,
      depth: 320,
      thickness: 2.8,
      reserves: 98000,
      slope: 18,
      geologicalStructure: '向斜构造',
      riskLevel: '高风险',
      supervisor: '市安监局',
      status: '准备中',
      description: '储量丰富，但地质构造复杂，需加强监测',
    },
    {
      key: '3',
      bodyId: 'OB003',
      name: '西二回采区',
      location: '西翼采区',
      area: 12800,
      depth: 240,
      thickness: 4.1,
      reserves: 156000,
      slope: 12,
      geologicalStructure: '背斜构造',
      riskLevel: '低风险',
      supervisor: '省安监厅',
      status: '已完成',
      description: '已完成开采，地质条件良好，无重大事故',
    },
  ];

  const columns: ColumnsType<OreBodyData> = [
    { title: '矿体编号', dataIndex: 'bodyId', key: 'bodyId', width: 120 },
    { title: '矿体名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
    { 
      title: '面积(m²)', 
      dataIndex: 'area', 
      key: 'area', 
      width: 120,
      render: (area: number) => area.toLocaleString(),
    },
    { 
      title: '深度(m)', 
      dataIndex: 'depth', 
      key: 'depth', 
      width: 100,
    },
    { 
      title: '储量(吨)', 
      dataIndex: 'reserves', 
      key: 'reserves', 
      width: 120,
      render: (reserves: number) => reserves.toLocaleString(),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level: string) => {
        const color = level === '低风险' ? 'success' : level === '中风险' ? 'warning' : 'error';
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === '开采中' ? 'processing' : status === '准备中' ? 'warning' : 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setIsDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('矿体信息添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="矿体管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加矿体
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>

      {/* 添加矿体模态框 */}
      <Modal title="添加矿体" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={900}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="矿体编号" name="bodyId" rules={[{ required: true }]}>
                <Input placeholder="请输入矿体编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="矿体名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入矿体名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="位置" name="location" rules={[{ required: true }]}>
                <Input placeholder="请输入矿体位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="面积(m²)" name="area" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="请输入矿体面积" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="深度(m)" name="depth" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  precision={1} 
                  style={{ width: '100%' }} 
                  placeholder="请输入开采深度" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="厚度(m)" name="thickness" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  precision={1} 
                  style={{ width: '100%' }} 
                  placeholder="请输入矿体厚度" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="储量(吨)" name="reserves" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="请输入矿体储量" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="坡度(°)" name="slope" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  max={90} 
                  precision={1} 
                  style={{ width: '100%' }} 
                  placeholder="请输入坡度角度" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="地质构造" name="geologicalStructure" rules={[{ required: true }]}>
                <Select placeholder="请选择地质构造">
                  <Select.Option value="单斜构造">单斜构造</Select.Option>
                  <Select.Option value="向斜构造">向斜构造</Select.Option>
                  <Select.Option value="背斜构造">背斜构造</Select.Option>
                  <Select.Option value="断层构造">断层构造</Select.Option>
                  <Select.Option value="复合构造">复合构造</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="风险等级" name="riskLevel" rules={[{ required: true }]}>
                <Select placeholder="请选择风险等级">
                  <Select.Option value="低风险">低风险</Select.Option>
                  <Select.Option value="中风险">中风险</Select.Option>
                  <Select.Option value="高风险">高风险</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="监管主体" name="supervisor" rules={[{ required: true }]}>
                <Input placeholder="请输入监管单位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                <Select placeholder="请选择状态">
                  <Select.Option value="开采中">开采中</Select.Option>
                  <Select.Option value="准备中">准备中</Select.Option>
                  <Select.Option value="已完成">已完成</Select.Option>
                  <Select.Option value="暂停">暂停</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入矿体描述信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 矿体详情模态框 */}
      <Modal 
        title="矿体详情" 
        open={isDetailVisible} 
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="矿体编号">{selectedRecord.bodyId}</Descriptions.Item>
            <Descriptions.Item label="矿体名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="位置">{selectedRecord.location}</Descriptions.Item>
            <Descriptions.Item label="面积">{selectedRecord.area.toLocaleString()} m²</Descriptions.Item>
            <Descriptions.Item label="深度">{selectedRecord.depth} m</Descriptions.Item>
            <Descriptions.Item label="厚度">{selectedRecord.thickness} m</Descriptions.Item>
            <Descriptions.Item label="储量">{selectedRecord.reserves.toLocaleString()} 吨</Descriptions.Item>
            <Descriptions.Item label="坡度">{selectedRecord.slope}°</Descriptions.Item>
            <Descriptions.Item label="地质构造">{selectedRecord.geologicalStructure}</Descriptions.Item>
            <Descriptions.Item label="风险等级">
              <Tag color={
                selectedRecord.riskLevel === '低风险' ? 'success' : 
                selectedRecord.riskLevel === '中风险' ? 'warning' : 'error'
              }>
                {selectedRecord.riskLevel}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="监管主体">{selectedRecord.supervisor}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                selectedRecord.status === '开采中' ? 'processing' : 
                selectedRecord.status === '准备中' ? 'warning' : 'success'
              }>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>{selectedRecord.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OreBody;