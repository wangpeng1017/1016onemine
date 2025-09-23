import React from 'react';
import { Card, Row, Col, Button, Tree, Typography, Space } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MineTopology: React.FC = () => {
  const treeData: DataNode[] = [
    {
      key: 'mine',
      title: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿-652222053708',
      children: [
        {
          key: '采场东边坡-0101',
          title: '采场东边坡-0101',
        },
        {
          key: '采场南边坡-0102',
          title: '采场南边坡-0102',
        },
        {
          key: '采场西边坡-0103',
          title: '采场西边坡-0103',
        },
        {
          key: '采场北边坡-0104',
          title: '采场北边坡-0104',
        },
        {
          key: '西排土场边坡-0201',
          title: '西排土场边坡-0201',
        },
        {
          key: '南排土场边坡-0202',
          title: '南排土场边坡-0202',
        },
        {
          key: '内排土场边坡-0203',
          title: '内排土场边坡-0203',
        },
        {
          key: '边坡10-bp12',
          title: '边坡10-bp12',
          children: [
            { key: '采场东边坡-0101-child', title: '采场东边坡-0101' },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="page-title">数据上报 - 矿山拓扑</div>
      <Row gutter={16}>
        <Col span={6}>
          <Card hoverable>
            <div style={{ width: '100%', height: 120, background: '#eee', borderRadius: 6 }} />
            <div style={{ marginTop: 12 }}>
              <Title level={5} style={{ marginBottom: 4 }}>新塘能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿</Title>
              <Text type="secondary">652222053708</Text>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card
            title="矿山—边坡—台阶 结构"
            extra={
              <Space>
                <Button icon={<PlusOutlined />}>新增</Button>
              </Space>
            }
          >
            <div style={{ maxHeight: 520, overflow: 'auto' }}>
              <Tree
                showLine
                defaultExpandAll
                treeData={treeData}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MineTopology;
