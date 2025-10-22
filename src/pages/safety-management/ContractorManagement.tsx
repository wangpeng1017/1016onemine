import React from 'react';
import { Card, Table, Button, Space, Tabs, Tag, Badge, Progress } from 'antd';
import { SolutionOutlined, TeamOutlined, SafetyCertificateOutlined, BarChartOutlined, PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const ContractorManagement: React.FC = () => {
  const contractors = [
    { id: '1', name: '建设公司A', personnel: 25, projects: 3, score: 95, status: 'active' },
    { id: '2', name: '维修公司B', personnel: 18, projects: 2, score: 88, status: 'active' }
  ];

  const columns = [
    { title: '承包商名称', dataIndex: 'name', key: 'name' },
    { title: '人员数量', dataIndex: 'personnel', key: 'personnel' },
    { title: '在场项目', dataIndex: 'projects', key: 'projects' },
    { title: '安全绩效', dataIndex: 'score', key: 'score', render: (s: number) => <Tag color={s >= 90 ? 'success' : 'warning'}>{s}分</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'active' ? 'success' : 'default'} text={s === 'active' ? '在场' : '离场'} /> },
    { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">管理</Button></Space> }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        { 
          key: '1', 
          label: <span><SolutionOutlined /> 承包商信息库</span>, 
          children: (
            <Card title="承包商列表" extra={<Button type="primary" icon={<PlusOutlined />}>新增承包商</Button>}>
              <Table columns={columns} dataSource={contractors} rowKey="id" />
            </Card>
          )
        },
        { 
          key: '2', 
          label: <span><TeamOutlined /> 人员管理</span>, 
          children: (
            <Card title="承包商人员" extra={<Button type="primary" icon={<PlusOutlined />}>添加人员</Button>}>
              <Table 
                size="small"
                columns={[
                  { title: '姓名', dataIndex: 'name', key: 'name' },
                  { title: '所属公司', dataIndex: 'company', key: 'company' },
                  { title: '岗位', dataIndex: 'position', key: 'position' },
                  { title: '证件', dataIndex: 'cert', key: 'cert', render: (c: string) => <Tag color="blue">{c}</Tag> },
                  { title: '入场日期', dataIndex: 'entryDate', key: 'entryDate' },
                  { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'active' ? 'success' : 'default'} text={s === 'active' ? '在场' : '离场'} /> },
                  { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">编辑</Button></Space> }
                ]}
                dataSource={[
                  { key: '1', name: '张三', company: '建设公司A', position: '电工', cert: '特种作业证', entryDate: '2024-01-01', status: 'active' },
                  { key: '2', name: '李四', company: '建设公司A', position: '焊工', cert: '焊工证', entryDate: '2024-01-01', status: 'active' }
                ]}
              />
            </Card>
          )
        },
        { 
          key: '3', 
          label: <span><SafetyCertificateOutlined /> 资质管理</span>, 
          children: (
            <Card title="资质档案">
              <Table 
                size="small"
                columns={[
                  { title: '公司名称', dataIndex: 'company', key: 'company' },
                  { title: '资质类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
                  { title: '证书编号', dataIndex: 'certNo', key: 'certNo' },
                  { title: '有效期', dataIndex: 'validUntil', key: 'validUntil' },
                  { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'valid' ? 'success' : 'warning'}>{s === 'valid' ? '有效' : '即将过期'}</Tag> },
                  { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">下载</Button></Space> }
                ]}
                dataSource={[
                  { key: '1', company: '建设公司A', type: '建筑施工资质', certNo: 'JZ20240001', validUntil: '2025-12-31', status: 'valid' },
                  { key: '2', company: '维修公司B', type: '特种设备维修', certNo: 'WX20240002', validUntil: '2024-06-30', status: 'expiring' }
                ]}
              />
            </Card>
          )
        },
        { 
          key: '4', 
          label: <span><BarChartOutlined /> 绩效评估</span>, 
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>2</div><div style={{ color: '#999' }}>在场承包商</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>43</div><div style={{ color: '#999' }}>在场人员</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>5</div><div style={{ color: '#999' }}>在场项目</div></div>
                  <div><Progress type="circle" percent={92} width={80} /><div style={{ textAlign: 'center', marginTop: 8 }}>平均绩效</div></div>
                </Space>
              </Card>
              <Card title="绩效趋势">
                <ReactECharts 
                  option={{
                    title: { text: '承包商安全绩效趋势', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    legend: { bottom: 0 },
                    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
                    yAxis: { type: 'value', max: 100 },
                    series: [
                      { name: '建设公司A', type: 'line', data: [92, 94, 93, 95, 96, 95] },
                      { name: '维修公司B', type: 'line', data: [85, 87, 88, 89, 88, 88] }
                    ]
                  }}
                  style={{ height: 300 }}
                />
              </Card>
            </div>
          )
        }
      ]} />
    </div>
  );
};

export default ContractorManagement;
