import React, { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, DatePicker, InputNumber, message, Row, Col, Statistic, Progress } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface AcceptanceRecord {
  key: string;
  period: string;
  area: string;
  planCoal: number;
  actualCoal: number;
  planRock: number;
  actualRock: number;
  completionRate: number;
  inspector: string;
  date: string;
}

const SurveyingAcceptance: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const mockData: AcceptanceRecord[] = [
    {
      key: '1',
      period: '2024年6月',
      area: '1号采区',
      planCoal: 180000,
      actualCoal: 183600,
      planRock: 90000,
      actualRock: 88500,
      completionRate: 102,
      inspector: '张工',
      date: '2024-07-01',
    },
    {
      key: '2',
      period: '2024年5月',
      area: '1号采区',
      planCoal: 175000,
      actualCoal: 171200,
      planRock: 87500,
      actualRock: 89000,
      completionRate: 98,
      inspector: '李工',
      date: '2024-06-01',
    },
    {
      key: '3',
      period: '2024年6月',
      area: '2号采区',
      planCoal: 95000,
      actualCoal: 97850,
      planRock: 47500,
      actualRock: 46800,
      completionRate: 103,
      inspector: '王工',
      date: '2024-07-01',
    },
  ];

  const columns: ColumnsType<AcceptanceRecord> = [
    { title: '周期', dataIndex: 'period', key: 'period', width: 120 },
    { title: '采区', dataIndex: 'area', key: 'area', width: 100 },
    {
      title: '计划采煤量(吨)',
      dataIndex: 'planCoal',
      key: 'planCoal',
      width: 140,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '实际采煤量(吨)',
      dataIndex: 'actualCoal',
      key: 'actualCoal',
      width: 140,
      render: (val: number, record) => (
        <span style={{ color: val >= record.planCoal ? '#52c41a' : '#ff4d4f' }}>
          {val.toLocaleString()}
        </span>
      ),
    },
    {
      title: '计划剥离量(吨)',
      dataIndex: 'planRock',
      key: 'planRock',
      width: 140,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '实际剥离量(吨)',
      dataIndex: 'actualRock',
      key: 'actualRock',
      width: 140,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 120,
      render: (val: number) => (
        <span style={{ color: val >= 100 ? '#52c41a' : val >= 95 ? '#faad14' : '#ff4d4f' }}>
          {val}%
        </span>
      ),
    },
    { title: '验收人', dataIndex: 'inspector', key: 'inspector', width: 100 },
    { title: '验收日期', dataIndex: 'date', key: 'date', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" size="small" icon={<EyeOutlined />}>
          查看
        </Button>
      ),
    },
  ];

  const totalPlanCoal = mockData.reduce((sum, item) => sum + item.planCoal, 0);
  const totalActualCoal = mockData.reduce((sum, item) => sum + item.actualCoal, 0);
  const avgCompletionRate = Math.round(
    mockData.reduce((sum, item) => sum + item.completionRate, 0) / mockData.length
  );

  const handleCreate = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('验收数据录入成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="计划采煤总量"
              value={totalPlanCoal}
              suffix="吨"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实际采煤总量"
              value={totalActualCoal}
              suffix="吨"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均完成率" value={avgCompletionRate} suffix="%" />
            <Progress percent={avgCompletionRate} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="超产量"
              value={totalActualCoal - totalPlanCoal}
              suffix="吨"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="地测验收记录"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            录入验收数据
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title="录入验收数据"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="周期"
                name="period"
                rules={[{ required: true, message: '请选择周期' }]}
              >
                <DatePicker.MonthPicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="采区"
                name="area"
                rules={[{ required: true, message: '请输入采区' }]}
              >
                <Input placeholder="请输入采区" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="实际采煤量(吨)"
                name="actualCoal"
                rules={[{ required: true, message: '请输入实际采煤量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="实际剥离量(吨)"
                name="actualRock"
                rules={[{ required: true, message: '请输入实际剥离量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="验收人"
            name="inspector"
            rules={[{ required: true, message: '请输入验收人' }]}
          >
            <Input placeholder="请输入验收人" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SurveyingAcceptance;
