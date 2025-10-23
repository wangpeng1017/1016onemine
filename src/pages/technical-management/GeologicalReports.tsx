import React from 'react';
import { Card, Col, Row, Typography, Select, Button, Table, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const GeologicalReports: React.FC = () => {
  const columns = [
    {
      title: '报表项',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
  ];

  const data = [
    {
      key: '1',
      item: '地质储量',
      value: '1200',
      unit: '万吨',
    },
    {
      key: '2',
      item: '工业储量',
      value: '850',
      unit: '万吨',
    },
    {
      key: '3',
      item: '设计可采储量',
      value: '700',
      unit: '万吨',
    },
    {
      key: '4',
      item: '累计采出量',
      value: '300',
      unit: '万吨',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>地质保障 - 统计报表</Title>
      <Card>
        <Row gutter={16} align="middle">
          <Col>
            <Select defaultValue="type1" style={{ width: 120 }}>
              <Option value="type1">报表类型一</Option>
              <Option value="type2">报表类型二</Option>
            </Select>
          </Col>
          <Col>
            <RangePicker />
          </Col>
          <Col>
            <Button type="primary">生成报表</Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />}>导出Excel</Button>
          </Col>
        </Row>
        <div style={{ marginTop: 24 }}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </Card>
    </div>
  );
};

export default GeologicalReports;