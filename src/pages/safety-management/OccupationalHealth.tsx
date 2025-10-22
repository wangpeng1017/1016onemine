import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Badge, Progress, Row, Col, Statistic } from 'antd';
import { MedicineBoxOutlined, UserOutlined, EnvironmentOutlined, ShoppingOutlined, FileTextOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const OccupationalHealth: React.FC = () => {
  const healthRecords = [
    { id: '1', name: '张三', dept: '采矿部', lastCheck: '2024-01-10', status: 'normal', abnormal: 0 },
    { id: '2', name: '李四', dept: '机电部', lastCheck: '2023-12-15', status: 'warning', abnormal: 2 }
  ];

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '最近体检', dataIndex: 'lastCheck', key: 'lastCheck' },
    { title: '异常项', dataIndex: 'abnormal', key: 'abnormal', render: (n: number) => n > 0 ? <Badge count={n} /> : '-' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'normal' ? 'success' : 'warning'}>{s === 'normal' ? '正常' : '异常'}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { 
          key: '1', 
          label: <span><UserOutlined /> 健康档案</span>, 
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={6}><Statistic title="在职人员" value={280} /></Col>
                  <Col span={6}><Statistic title="异常人员" value={8} valueStyle={{ color: '#ff4d4f' }} /></Col>
                  <Col span={6}><Statistic title="职业病" value={2} valueStyle={{ color: '#faad14' }} /></Col>
                  <Col span={6}><Progress type="circle" percent={97} width={60} /><div style={{ textAlign: 'center', marginTop: 8 }}>体检率</div></Col>
                </Row>
              </Card>
              <Card title="职业健康档案"><Table columns={columns} dataSource={healthRecords} rowKey="id" /></Card>
            </div>
          )
        },
        { 
          key: '2', 
          label: <span><MedicineBoxOutlined /> 体检管理</span>, 
          children: (
            <div>
              <Card title="体检计划" extra={<Button type="primary" icon={<PlusOutlined />}>新增计划</Button>} style={{ marginBottom: 16 }}>
                <Table 
                  size="small"
                  columns={[
                    { title: '计划名称', dataIndex: 'name', key: 'name' },
                    { title: '体检类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
                    { title: '计划时间', dataIndex: 'date', key: 'date' },
                    { title: '参与人数', dataIndex: 'count', key: 'count' },
                    { title: '完成率', dataIndex: 'rate', key: 'rate', render: (r: number) => <Progress percent={r} size="small" /> },
                    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">编辑</Button></Space> }
                  ]}
                  dataSource={[
                    { key: '1', name: '2024年度职业健康体检', type: '年度体检', date: '2024-03-01', count: 280, rate: 85 },
                    { key: '2', name: '特种作业人员体检', type: '专项体检', date: '2024-01-15', count: 45, rate: 100 }
                  ]}
                />
              </Card>
              <Card title="异常预警">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card size="small" style={{ borderLeft: '3px solid #ff4d4f' }}>
                    <Space><WarningOutlined style={{ color: '#ff4d4f' }} /><span>张三 - 血压异常，建议复检</span><Button type="link" size="small">处理</Button></Space>
                  </Card>
                  <Card size="small" style={{ borderLeft: '3px solid #faad14' }}>
                    <Space><WarningOutlined style={{ color: '#faad14' }} /><span>李四 - 听力下降，需跟踪观察</span><Button type="link" size="small">处理</Button></Space>
                  </Card>
                </Space>
              </Card>
            </div>
          )
        },
        { 
          key: '3', 
          label: <span><EnvironmentOutlined /> 防护设施</span>, 
          children: (
            <Card title="防护设施管理" extra={<Button type="primary" icon={<PlusOutlined />}>添加设施</Button>}>
              <Table 
                size="small"
                columns={[
                  { title: '设施名称', dataIndex: 'name', key: 'name' },
                  { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
                  { title: '位置', dataIndex: 'location', key: 'location' },
                  { title: '数量', dataIndex: 'count', key: 'count' },
                  { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'normal' ? 'success' : 'warning'}>{s === 'normal' ? '正常' : '待维护'}</Tag> },
                  { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">维护</Button></Space> }
                ]}
                dataSource={[
                  { key: '1', name: '安全警示标识', type: '警示标识', location: '采矿区A', count: 25, status: 'normal' },
                  { key: '2', name: '应急洗眼器', type: '应急设施', location: '化学品库', count: 8, status: 'normal' },
                  { key: '3', name: '防尘口罩分发点', type: '防护用品', location: '各作业区', count: 12, status: 'normal' }
                ]}
              />
            </Card>
          )
        },
        { 
          key: '4', 
          label: <span><ShoppingOutlined /> 劳保用品</span>, 
          children: (
            <div>
              <Card title="发放计划" extra={<Button type="primary" icon={<PlusOutlined />}>制定计划</Button>} style={{ marginBottom: 16 }}>
                <Table 
                  size="small"
                  columns={[
                    { title: '计划名称', dataIndex: 'name', key: 'name' },
                    { title: '用品类型', dataIndex: 'type', key: 'type' },
                    { title: '预计数量', dataIndex: 'planned', key: 'planned' },
                    { title: '已发放', dataIndex: 'issued', key: 'issued' },
                    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" /> },
                    { title: '操作', key: 'action', render: () => <Button type="link" size="small">查看</Button> }
                  ]}
                  dataSource={[
                    { key: '1', name: '2024年上半年劳保发放', type: '安全鞋、工作服', planned: 280, issued: 245, progress: 88 },
                    { key: '2', name: '夏季防暑用品', type: '防暑降温', planned: 300, issued: 300, progress: 100 }
                  ]}
                />
              </Card>
              <Card title="库存统计">
                <ReactECharts 
                  option={{
                    title: { text: '劳保用品库存情况', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: ['安全帽', '安全鞋', '防尘口罩', '防护手套', '工作服'] },
                    yAxis: { type: 'value' },
                    series: [{ name: '库存数量', type: 'bar', data: [450, 380, 520, 680, 420], itemStyle: { color: '#1890ff' } }]
                  }}
                  style={{ height: 300 }}
                />
              </Card>
            </div>
          )
        },
        { 
          key: '5', 
          label: <span><FileTextOutlined /> 报表管理</span>, 
          children: (
            <Card title="法定报表">
              <Space direction="vertical" style={{ width: '100%' }}>
                {['职业病危害因素识别清单', '职业健康检查统计表', '劳保用品发放记录', '职业病人员台账'].map(name => (
                  <Card key={name} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><FileTextOutlined /> {name}</span>
                      <Space>
                        <Button type="link" size="small">生成</Button>
                        <Button type="link" size="small">下载</Button>
                        <Button type="link" size="small">预览</Button>
                      </Space>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>
          )
        }
      ]} />
    </div>
  );
};

export default OccupationalHealth;
