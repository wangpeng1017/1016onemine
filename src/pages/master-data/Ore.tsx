import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, InputNumber, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

interface OreData {
  key: string;
  oreId: string;
  name: string;
  type: string;
  grade: number;
  moisture: number;
  ashContent: number;
  calorificValue: number;
  density: number;
  hardness: string;
  description: string;
  status: string;
}

const Ore: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OreData | null>(null);
  const [form] = Form.useForm();

  const mockData: OreData[] = [
    {
      key: '1',
      oreId: 'ORE001',
      name: '优质烟煤',
      type: '烟煤',
      grade: 85.6,
      moisture: 8.2,
      ashContent: 12.5,
      calorificValue: 6500,
      density: 1.35,
      hardness: '中硬',
      description: '优质工业用烟煤，适用于发电和钢铁冶炼',
      status: '活跃',
    },
    {
      key: '2',
      oreId: 'ORE002',
      name: '褐煤',
      type: '褐煤',
      grade: 65.2,
      moisture: 15.8,
      ashContent: 18.3,
      calorificValue: 4200,
      density: 1.2,
      hardness: '软',
      description: '中等品质褐煤，主要用于发电',
      status: '活跃',
    },
    {
      key: '3',
      oreId: 'ORE003',
      name: '无烟煤',
      type: '无烟煤',
      grade: 92.1,
      moisture: 3.5,
      ashContent: 8.2,
      calorificValue: 7200,
      density: 1.45,
      hardness: '硬',
      description: '高品质无烟煤，用于特殊工业用途',
      status: '停用',
    },
  ];

  const columns: ColumnsType<OreData> = [
    { title: '矿石编号', dataIndex: 'oreId', key: 'oreId', width: 120 },
    { title: '矿石名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '矿石类型', dataIndex: 'type', key: 'type', width: 120 },
    { 
      title: '品位(%)', 
      dataIndex: 'grade', 
      key: 'grade', 
      width: 100,
      render: (grade: number) => `${grade}%`,
    },
    { 
      title: '水分(%)', 
      dataIndex: 'moisture', 
      key: 'moisture', 
      width: 100,
      render: (moisture: number) => `${moisture}%`,
    },
    { 
      title: '发热量', 
      dataIndex: 'calorificValue', 
      key: 'calorificValue', 
      width: 120,
      render: (value: number) => `${value} kcal/kg`,
    },
    { title: '硬度', dataIndex: 'hardness', key: 'hardness', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '活跃' ? 'success' : 'default'}>{status}</Tag>
      ),
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
      message.success('矿石信息添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="矿石管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加矿石
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1300 }} />
      </Card>

      {/* 添加矿石模态框 */}
      <Modal title="添加矿石" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={800}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="矿石编号" name="oreId" rules={[{ required: true }]}>
                <Input placeholder="请输入矿石编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="矿石名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入矿石名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="矿石类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="请选择矿石类型">
                  <Select.Option value="烟煤">烟煤</Select.Option>
                  <Select.Option value="褐煤">褐煤</Select.Option>
                  <Select.Option value="无烟煤">无烟煤</Select.Option>
                  <Select.Option value="铁矿石">铁矿石</Select.Option>
                  <Select.Option value="铜矿石">铜矿石</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品位(%)" name="grade" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  max={100} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入品位" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="水分(%)" name="moisture" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  max={100} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入水分含量" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="灰分(%)" name="ashContent" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  max={100} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入灰分含量" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="发热量(kcal/kg)" name="calorificValue" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="请输入发热量" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="密度(g/cm³)" name="density" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入密度" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="硬度" name="hardness" rules={[{ required: true }]}>
                <Select placeholder="请选择硬度">
                  <Select.Option value="软">软</Select.Option>
                  <Select.Option value="中软">中软</Select.Option>
                  <Select.Option value="中硬">中硬</Select.Option>
                  <Select.Option value="硬">硬</Select.Option>
                  <Select.Option value="极硬">极硬</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                <Select placeholder="请选择状态">
                  <Select.Option value="活跃">活跃</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入矿石描述信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 矿石详情模态框 */}
      <Modal 
        title="矿石详情" 
        open={isDetailVisible} 
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="矿石编号">{selectedRecord.oreId}</Descriptions.Item>
            <Descriptions.Item label="矿石名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="矿石类型">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="品位">{selectedRecord.grade}%</Descriptions.Item>
            <Descriptions.Item label="水分">{selectedRecord.moisture}%</Descriptions.Item>
            <Descriptions.Item label="灰分">{selectedRecord.ashContent}%</Descriptions.Item>
            <Descriptions.Item label="发热量">{selectedRecord.calorificValue} kcal/kg</Descriptions.Item>
            <Descriptions.Item label="密度">{selectedRecord.density} g/cm³</Descriptions.Item>
            <Descriptions.Item label="硬度">{selectedRecord.hardness}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedRecord.status === '活跃' ? 'success' : 'default'}>
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

export default Ore;