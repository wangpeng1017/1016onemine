import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface EquipmentData {
  key: string;
  equipmentId: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  status: string;
  location: string;
  responsible: string;
}

const Equipment: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EquipmentData | null>(null);
  const [form] = Form.useForm();

  const mockData: EquipmentData[] = [
    {
      key: '1',
      equipmentId: 'EQ001',
      name: 'A号采煤机',
      type: '采掘设备',
      model: 'MG300/730-WD',
      serialNumber: 'SN202401001',
      manufacturer: '中煤装备集团',
      purchaseDate: '2024-01-15',
      status: '运行中',
      location: '1302工作面',
      responsible: '张工程师',
    },
    {
      key: '2',
      equipmentId: 'EQ002',
      name: '1号皮带输送机',
      type: '运输设备',
      model: 'DTL100/40/2×200',
      serialNumber: 'SN202401002',
      manufacturer: '山西煤机集团',
      purchaseDate: '2023-12-20',
      status: '运行中',
      location: '主运输巷',
      responsible: '李技术员',
    },
    {
      key: '3',
      equipmentId: 'EQ003',
      name: '主通风机',
      type: '辅助设备',
      model: 'GAF36-12-1',
      serialNumber: 'SN202401003',
      manufacturer: '沈阳鼓风机集团',
      purchaseDate: '2023-10-10',
      status: '维修中',
      location: '主风井',
      responsible: '王师傅',
    },
  ];

  const columns: ColumnsType<EquipmentData> = [
    { title: '设备编号', dataIndex: 'equipmentId', key: 'equipmentId', width: 120 },
    { title: '设备名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '设备类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 150 },
    { title: '制造商', dataIndex: 'manufacturer', key: 'manufacturer', width: 130 },
    { title: '采购日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === '运行中' ? 'success' : status === '维修中' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
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
      message.success('设备信息添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="设备管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加设备
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>

      {/* 添加设备模态框 */}
      <Modal title="添加设备" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={800}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备编号" name="equipmentId" rules={[{ required: true }]}>
                <Input placeholder="请输入设备编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="请选择设备类型">
                  <Select.Option value="采掘设备">采掘设备</Select.Option>
                  <Select.Option value="运输设备">运输设备</Select.Option>
                  <Select.Option value="辅助设备">辅助设备</Select.Option>
                  <Select.Option value="安全设备">安全设备</Select.Option>
                  <Select.Option value="监测设备">监测设备</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备型号" name="model" rules={[{ required: true }]}>
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="序列号" name="serialNumber" rules={[{ required: true }]}>
                <Input placeholder="请输入设备序列号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商" name="manufacturer" rules={[{ required: true }]}>
                <Input placeholder="请输入制造商" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="采购日期" name="purchaseDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备位置" name="location" rules={[{ required: true }]}>
                <Input placeholder="请输入设备位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责人" name="responsible" rules={[{ required: true }]}>
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备状态" name="status" rules={[{ required: true }]}>
                <Select placeholder="请选择设备状态">
                  <Select.Option value="运行中">运行中</Select.Option>
                  <Select.Option value="停机">停机</Select.Option>
                  <Select.Option value="维修中">维修中</Select.Option>
                  <Select.Option value="报废">报废</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 设备详情模态框 */}
      <Modal 
        title="设备详情" 
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
            <Descriptions.Item label="设备编号">{selectedRecord.equipmentId}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="设备类型">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="设备型号">{selectedRecord.model}</Descriptions.Item>
            <Descriptions.Item label="序列号">{selectedRecord.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="制造商">{selectedRecord.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="采购日期">{selectedRecord.purchaseDate}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                selectedRecord.status === '运行中' ? 'success' : 
                selectedRecord.status === '维修中' ? 'warning' : 'default'
              }>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="设备位置">{selectedRecord.location}</Descriptions.Item>
            <Descriptions.Item label="负责人">{selectedRecord.responsible}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Equipment;