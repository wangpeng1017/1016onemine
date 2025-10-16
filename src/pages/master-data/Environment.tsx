import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, InputNumber, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

interface EnvironmentData {
  key: string;
  monitorId: string;
  name: string;
  type: string;
  location: string;
  sensorModel: string;
  standardLimit: number;
  unit: string;
  currentValue: number;
  status: string;
  installDate: string;
  responsible: string;
  description: string;
}

const Environment: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EnvironmentData | null>(null);
  const [form] = Form.useForm();

  const mockData: EnvironmentData[] = [
    {
      key: '1',
      monitorId: 'ENV001',
      name: '1302工作面粉尘监测点',
      type: '粉尘监测点',
      location: '1302工作面进风口',
      sensorModel: 'GCG1000',
      standardLimit: 10,
      unit: 'mg/m³',
      currentValue: 8.2,
      status: '正常',
      installDate: '2024-01-15',
      responsible: '安全科李工',
      description: '监测工作面粉尘浓度，确保作业环境安全',
    },
    {
      key: '2',
      monitorId: 'ENV002',
      name: '主井噪音监测点',
      type: '噪音监测点',
      location: '主井口',
      sensorModel: 'AWA5688',
      standardLimit: 85,
      unit: 'dB',
      currentValue: 78.5,
      status: '正常',
      installDate: '2023-12-20',
      responsible: '环保科王工',
      description: '监测主井提升设备噪音水平',
    },
    {
      key: '3',
      monitorId: 'ENV003',
      name: '瓦斯浓度监测点',
      type: '气体监测点',
      location: '1304工作面回风巷',
      sensorModel: 'GJC4',
      standardLimit: 1.0,
      unit: '%',
      currentValue: 1.2,
      status: '超标',
      installDate: '2024-02-10',
      responsible: '通风科张工',
      description: '监测工作面瓦斯浓度，防止瓦斯超限',
    },
    {
      key: '4',
      monitorId: 'ENV004',
      name: '空气温度监测点',
      type: '温度监测点',
      location: '主运输巷',
      sensorModel: 'PT100',
      standardLimit: 26,
      unit: '°C',
      currentValue: 23.8,
      status: '正常',
      installDate: '2024-03-05',
      responsible: '通风科赵工',
      description: '监测井下作业环境温度',
    },
  ];

  const columns: ColumnsType<EnvironmentData> = [
    { title: '监测点编号', dataIndex: 'monitorId', key: 'monitorId', width: 120 },
    { title: '监测点名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '监测类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 150 },
    { 
      title: '当前值', 
      key: 'currentValue', 
      width: 120,
      render: (_, record) => `${record.currentValue} ${record.unit}`,
    },
    { 
      title: '标准限值', 
      key: 'standardLimit', 
      width: 120,
      render: (_, record) => `${record.standardLimit} ${record.unit}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === '正常' ? 'success' : status === '超标' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '负责人', dataIndex: 'responsible', key: 'responsible', width: 120 },
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
      message.success('环境监测点添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="环境管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加监测点
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>

      {/* 添加监测点模态框 */}
      <Modal title="添加环境监测点" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={800}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="监测点编号" name="monitorId" rules={[{ required: true }]}>
                <Input placeholder="请输入监测点编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="监测点名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入监测点名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="监测类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="请选择监测类型">
                  <Select.Option value="粉尘监测点">粉尘监测点</Select.Option>
                  <Select.Option value="噪音监测点">噪音监测点</Select.Option>
                  <Select.Option value="气体监测点">气体监测点</Select.Option>
                  <Select.Option value="温度监测点">温度监测点</Select.Option>
                  <Select.Option value="湿度监测点">湿度监测点</Select.Option>
                  <Select.Option value="振动监测点">振动监测点</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="安装位置" name="location" rules={[{ required: true }]}>
                <Input placeholder="请输入安装位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="传感器型号" name="sensorModel" rules={[{ required: true }]}>
                <Input placeholder="请输入传感器型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="负责人" name="responsible" rules={[{ required: true }]}>
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="标准限值" name="standardLimit" rules={[{ required: true }]}>
                <InputNumber 
                  min={0} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入标准限值" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计量单位" name="unit" rules={[{ required: true }]}>
                <Select placeholder="请选择单位">
                  <Select.Option value="mg/m³">mg/m³</Select.Option>
                  <Select.Option value="dB">dB</Select.Option>
                  <Select.Option value="%">%</Select.Option>
                  <Select.Option value="°C">°C</Select.Option>
                  <Select.Option value="ppm">ppm</Select.Option>
                  <Select.Option value="m/s">m/s</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前数值" name="currentValue">
                <InputNumber 
                  min={0} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="当前读数" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入监测点描述信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 监测点详情模态框 */}
      <Modal 
        title="环境监测点详情" 
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
            <Descriptions.Item label="监测点编号">{selectedRecord.monitorId}</Descriptions.Item>
            <Descriptions.Item label="监测点名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="监测类型">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="安装位置">{selectedRecord.location}</Descriptions.Item>
            <Descriptions.Item label="传感器型号">{selectedRecord.sensorModel}</Descriptions.Item>
            <Descriptions.Item label="安装日期">{selectedRecord.installDate}</Descriptions.Item>
            <Descriptions.Item label="标准限值">
              {selectedRecord.standardLimit} {selectedRecord.unit}
            </Descriptions.Item>
            <Descriptions.Item label="当前数值">
              {selectedRecord.currentValue} {selectedRecord.unit}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                selectedRecord.status === '正常' ? 'success' : 
                selectedRecord.status === '超标' ? 'error' : 'warning'
              }>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="负责人">{selectedRecord.responsible}</Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>{selectedRecord.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Environment;