import React from 'react';
import { Layout, Menu, Input, Button, Table, Typography, Card, Row, Col, Select, Space } from 'antd';
import { UploadOutlined, SearchOutlined, DownloadOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TechnicalDataManagement: React.FC = () => {
  const categories = [
    { key: '1', label: '数据库及模型归档', children: [
      { key: '1-1', label: '地质模型' },
      { key: '1-2', label: '采矿模型' },
      { key: '1-3', label: '测量模型' }
    ] },
    { key: '2', label: '技术文件及图纸归档', children: [
      { key: '2-1', label: '设计图纸' },
      { key: '2-2', label: '勘探报告' },
      { key: '2-3', label: '地质报告' },
      { key: '2-4', label: '测量报告' }
    ] },
    { key: '3', label: '管理文件归档', children: [
      { key: '3-1', label: '规章制度' },
      { key: '3-2', label: '安全规范' },
      { key: '3-3', label: '操作手册' }
    ] },
  ];

  const fileColumns = [
    { title: '文件名', dataIndex: 'name', key: 'name' },
    { title: '文件类型', dataIndex: 'type', key: 'type' },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: '版本号', dataIndex: 'version', key: 'version' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} size="small">预览</Button>
          <Button icon={<DownloadOutlined />} size="small">下载</Button>
          <Button icon={<HistoryOutlined />} size="small">历史对比</Button>
        </Space>
      ),
    },
  ];

  const fileData = [
    { key: '1', name: '地质模型_20241022.gltf', type: 'GLTF', uploadDate: '2024-10-22', version: 'V2.0' },
    { key: '2', name: '采矿设计图_A矿区_V3.pdf', type: 'PDF', uploadDate: '2024-10-20', version: 'V3.1' },
    { key: '3', name: '爆破参数设计方案.docx', type: 'DOCX', uploadDate: '2024-10-15', version: 'V1.2' },
    { key: '4', name: '巷道支护设计图.dwg', type: 'DWG', uploadDate: '2024-10-10', version: 'V1.5' },
    { key: '5', name: '2023年A矿区勘探报告.pdf', type: 'PDF', uploadDate: '2023-12-28', version: 'V1.0' },
    { key: '6', name: 'XX矿区安全生产管理制度.docx', type: 'DOCX', uploadDate: '2024-01-05', version: 'V2.0' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultOpenKeys={['1', '2', '3']}
          style={{ height: '100%', borderRight: 0 }}
          items={categories.map((cat) => ({
            key: cat.key,
            label: cat.label,
            children: cat.children?.map((subCat) => ({
              key: subCat.key,
              label: subCat.label,
            })),
          }))}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Title level={2}>技术资料管理</Title>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Card title="文件列表">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<UploadOutlined />} style={{ marginRight: 8 }}>上传</Button>
                  <Search placeholder="按名称搜索" style={{ width: 200 }} />
                </div>
                <Table columns={fileColumns} dataSource={fileData} pagination={false} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="预览与详情区">
                <div style={{ minHeight: '300px', textAlign: 'left', lineHeight: '1.5', padding: '20px', border: '1px solid #f0f0f0' }}>
                  <Title level={5}>地质模型_20241022.gltf</Title>
                  <p><strong>文件类型:</strong> GLTF</p>
                  <p><strong>上传日期:</strong> 2024-10-22</p>
                  <p><strong>版本号:</strong> V2.0</p>
                  <p><strong>大小:</strong> 15.2 MB</p>
                  <p><strong>描述:</strong> 2024年10月22日上传的地质模型，版本为V2.0，包含A矿区地质构造信息，用于三维可视化展示。</p>
                  <Button type="primary" icon={<EyeOutlined />} style={{ marginTop: 16 }}>在线预览</Button>
                </div>
              </Card>
              <Card title="统计分析" style={{ marginTop: 16 }}>
                <div style={{ minHeight: '200px', textAlign: 'left', lineHeight: '1.5', padding: '20px', border: '1px solid #f0f0f0' }}>
                  <Title level={5}>文件类型占比</Title>
                  <p>GLTF: 25%</p>
                  <p>PDF: 35%</p>
                  <p>DOCX: 20%</p>
                  <p>DWG: 20%</p>
                  <Title level={5}>文件上传趋势 (最近6个月)</Title>
                  <p><em>(此处放置柱状图)</em></p>
                </div>
              </Card>
              {/* 模型历史回放与对比模态框占位 */}
              <Card title="模型历史回放与对比 (占位)" style={{ marginTop: 16 }}>
                <Text>模型历史回放与对比功能正在开发中，敬请期待！</Text>
              </Card>
            </Col>
            </Col>
          </Row>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TechnicalDataManagement;