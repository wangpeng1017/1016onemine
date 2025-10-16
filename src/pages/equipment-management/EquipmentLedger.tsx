import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, DatePicker, Select, message, Space, Row, Col, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Equipment {
  key: string;
  equipmentNo: string;
  equipmentName: string;
  equipmentType: string;
  model: string;
  department: string;
  purchaseDate: string;
  status: string;
  lastMaintenance: string;
}

const EquipmentLedger: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    {
      key: '1',
      equipmentNo: 'EQ-001',
      equipmentName: 'A号采煤机',
      equipmentType: '采煤设备',
      model: 'MG-350',
      department: '采煤一队',
      purchaseDate: '2022-03-15',
      status: '正常',
      lastMaintenance: '2024-06-10',
    },
    {
      key: '2',
      equipmentNo: 'EQ-002',
      equipmentName: 'B号采煤机',
      equipmentType: '采煤设备',
      model: 'MG-350',
      department: '采煤一队',
      purchaseDate: '2022-06-20',
      status: '正常',
      lastMaintenance: '2024-06-08',
    },
    {
      key: '3',
      equipmentNo: 'EQ-003',
      equipmentName: '1号皮带输送机',
      equipmentType: '运输设备',
      model: 'DTⅡ-2250',
      department: '运输队',
      purchaseDate: '2021-11-10',
      status: '维修中',
      lastMaintenance: '2024-05-20',
    },
    {
      key: '4',
      equipmentNo: 'EQ-004',
      equipmentName: '电铲',
      equipmentType: '采装设备',
      model: 'EX-3600',
      department: '采煤二队',
      purchaseDate: '2023-01-05',
      status: '正常',
      lastMaintenance: '2024-06-12',
    },
  ]);

  const columns: ColumnsType<Equipment> = [
    { title: '设备编号', dataIndex: 'equipmentNo', key: 'equipmentNo', width: 120 },
    { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName', width: 150 },
    { title: '设备类型', dataIndex: 'equipmentType', key: 'equipmentType', width: 130 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 130 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 130 },
    { title: '采购日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120 },
    { title: '上次保养', dataIndex: 'lastMaintenance', key: 'lastMaintenance', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ color: status === '正常' ? '#52c41a' : '#faad14' }}>{status}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingKey(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Equipment) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      equipmentNo: record.equipmentNo,
      equipmentName: record.equipmentName,
      equipmentType: record.equipmentType,
      model: record.model,
      department: record.department,
      purchaseDate: record.purchaseDate,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setEquipmentList(equipmentList.filter(item => item.key !== key));
    message.success('设备删除成功！');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingKey) {
        setEquipmentList(equipmentList.map(item =>
          item.key === editingKey ? { ...item, ...values, key: editingKey } : item
        ));
        message.success('设备信息更新成功！');
      } else {
        const newEquipment: Equipment = {
          key: String(equipmentList.length + 1),
          ...values,
          lastMaintenance: new Date().toISOString().split('T')[0],
        };
        setEquipmentList([...equipmentList, newEquipment]);
        message.success('设备添加成功！');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="设备台账管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加设备
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={columns}
          dataSource={equipmentList}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingKey ? '编辑设备信息' : '添加新设备'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备编号" name="equipmentNo" rules={[{ required: true }]}>
                <Input placeholder="请输入设备编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipmentName" rules={[{ required: true }]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备类型" name="equipmentType" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="采煤设备">采煤设备</Select.Option>
                  <Select.Option value="运输设备">运输设备</Select.Option>
                  <Select.Option value="采装设备">采装设备</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name="model" rules={[{ required: true }]}>
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所属部门" name="department" rules={[{ required: true }]}>
                <Input placeholder="请输入所属部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="采购日期" name="purchaseDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="设备状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="维修中">维修中</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentLedger;
