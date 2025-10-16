import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Row, Col, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TestRecord {
  key: string;
  testId: string;
  equipment: string;
  testType: string;
  testPerson: string;
  testDate: string;
  testResult: string;
  nextTestDate: string;
  status: string;
  reportPath: string;
}

const TestingManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);
  const [form] = Form.useForm();

  const mockData: TestRecord[] = [
    {
      key: '1',
      testId: 'TEST-001',
      equipment: 'A号采煤机',
      testType: '安全检测',
      testPerson: '安检员王五',
      testDate: '2024-06-01',
      testResult: '合格',
      nextTestDate: '2024-09-01',
      status: '有效',
      reportPath: '/reports/test-001.pdf',
    },
    {
      key: '2',
      testId: 'TEST-002',
      equipment: '主通风机',
      testType: '性能检验',
      testPerson: '检验员李六',
      testDate: '2024-05-15',
      testResult: '待整改',
      nextTestDate: '2024-06-15',
      status: '临期',
      reportPath: '/reports/test-002.pdf',
    },
    {
      key: '3',
      testId: 'TEST-003',
      equipment: '皮带输送机',
      testType: '电气检测',
      testPerson: '电工赵七',
      testDate: '2024-04-20',
      testResult: '合格',
      nextTestDate: '2024-07-20',
      status: '有效',
      reportPath: '/reports/test-003.pdf',
    },
  ];

  const columns: ColumnsType<TestRecord> = [
    { title: '检测ID', dataIndex: 'testId', key: 'testId', width: 120 },
    { title: '设备名称', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '检测类型', dataIndex: 'testType', key: 'testType', width: 120 },
    { title: '检测人员', dataIndex: 'testPerson', key: 'testPerson', width: 120 },
    { title: '检测日期', dataIndex: 'testDate', key: 'testDate', width: 120 },
    {
      title: '检测结果',
      dataIndex: 'testResult',
      key: 'testResult',
      width: 100,
      render: (result: string) => {
        const color = result === '合格' ? 'success' : result === '待整改' ? 'warning' : 'error';
        return <Tag color={color}>{result}</Tag>;
      },
    },
    { title: '下次检测', dataIndex: 'nextTestDate', key: 'nextTestDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const color = status === '有效' ? 'success' : status === '临期' ? 'warning' : 'error';
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
          <Button type="link" size="small" icon={<FileTextOutlined />}>
            报告
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('检测记录添加成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card
        title="检测检验管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加检测
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 10 }} scroll={{ x: 1300 }} />
      </Card>

      {/* 添加检测记录模态框 */}
      <Modal title="添加检测记录" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipment" rules={[{ required: true }]}>
                <Select placeholder="请选择设备">
                  <Select.Option value="A号采煤机">A号采煤机</Select.Option>
                  <Select.Option value="B号采煤机">B号采煤机</Select.Option>
                  <Select.Option value="主通风机">主通风机</Select.Option>
                  <Select.Option value="皮带输送机">皮带输送机</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测类型" name="testType" rules={[{ required: true }]}>
                <Select placeholder="请选择检测类型">
                  <Select.Option value="安全检测">安全检测</Select.Option>
                  <Select.Option value="性能检验">性能检验</Select.Option>
                  <Select.Option value="电气检测">电气检测</Select.Option>
                  <Select.Option value="机械检测">机械检测</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="检测人员" name="testPerson" rules={[{ required: true }]}>
                <Input placeholder="请输入检测人员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测日期" name="testDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="检测结果" name="testResult" rules={[{ required: true }]}>
                <Select placeholder="请选择检测结果">
                  <Select.Option value="合格">合格</Select.Option>
                  <Select.Option value="待整改">待整改</Select.Option>
                  <Select.Option value="不合格">不合格</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下次检测日期" name="nextTestDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 检测详情模态框 */}
      <Modal 
        title="检测详情" 
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
            <Descriptions.Item label="检测ID">{selectedRecord.testId}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{selectedRecord.equipment}</Descriptions.Item>
            <Descriptions.Item label="检测类型">{selectedRecord.testType}</Descriptions.Item>
            <Descriptions.Item label="检测人员">{selectedRecord.testPerson}</Descriptions.Item>
            <Descriptions.Item label="检测日期">{selectedRecord.testDate}</Descriptions.Item>
            <Descriptions.Item label="检测结果">
              <Tag color={selectedRecord.testResult === '合格' ? 'success' : 'warning'}>
                {selectedRecord.testResult}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="下次检测日期">{selectedRecord.nextTestDate}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedRecord.status === '有效' ? 'success' : 'warning'}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="报告路径" span={2}>{selectedRecord.reportPath}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TestingManagement;