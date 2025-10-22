import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Tabs, Tree, Modal, Form, DatePicker, Upload, message } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, DownloadOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;

const StandardArchive: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const standards = [
    { key: '1', name: '煤矿安全规程', category: '国家标准', scope: '全矿', validUntil: '2026-12-31', status: '有效', uploadDate: '2024-01-01' },
    { key: '2', name: '煤矿防治水细则', category: '行业标准', scope: '防排水系统', validUntil: '2025-06-30', status: '有效', uploadDate: '2023-12-15' },
    { key: '3', name: '矿山安全生产标准化', category: '国家标准', scope: '全矿', validUntil: '2026-03-31', status: '有效', uploadDate: '2024-02-01' }
  ];

  const columns = [
    { title: '规范名称', dataIndex: 'name', key: 'name' },
    { title: '所属类别', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color='blue'>{c}</Tag> },
    { title: '适用范围', dataIndex: 'scope', key: 'scope' },
    { title: '有效期限', dataIndex: 'validUntil', key: 'validUntil' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color='success'>{s}</Tag> },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type='link' size='small' icon={<EyeOutlined />}>预览</Button>
        <Button type='link' size='small' icon={<DownloadOutlined />}>下载</Button>
        <Button type='link' danger size='small' icon={<DeleteOutlined />}>删除</Button>
      </Space>
    )}
  ];

  const categoryTree = [
    { title: '安全生产法律法规', key: '0-0', icon: <FolderOutlined />, children: [
      { title: '国家法律', key: '0-0-0', icon: <FolderOutlined /> },
      { title: '地方法规', key: '0-0-1', icon: <FolderOutlined /> }
    ]},
    { title: '安全技术标准', key: '0-1', icon: <FolderOutlined />, children: [
      { title: '国家标准', key: '0-1-0', icon: <FolderOutlined /> },
      { title: '行业标准', key: '0-1-1', icon: <FolderOutlined /> }
    ]},
    { title: '安全管理制度', key: '0-2', icon: <FolderOutlined /> },
    { title: '应急预案', key: '0-3', icon: <FolderOutlined /> }
  ];

  const chartOption = {
    title: { text: '档案类别分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 45, name: '法律法规' },
        { value: 38, name: '技术标准' },
        { value: 28, name: '管理制度' },
        { value: 15, name: '应急预案' }
      ]
    }]
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs items={[
        {
          key: '1',
          label: <span><FileTextOutlined /> 规范管理</span>,
          children: (
            <Card title="标准规范库" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>上传规范</Button>}>
              <Space style={{ marginBottom: 16 }}>
                <Input placeholder='搜索规范名称' prefix={<SearchOutlined />} style={{ width: 250 }} />
                <Select placeholder='所属类别' style={{ width: 150 }}>
                  <Option value='national'>国家标准</Option>
                  <Option value='industry'>行业标准</Option>
                </Select>
                <Button type='primary' icon={<SearchOutlined />}>查询</Button>
              </Space>
              <Table columns={columns} dataSource={standards} pagination={{ pageSize: 10 }} />
            </Card>
          )
        },
        {
          key: '2',
          label: <span><FolderOutlined /> 类别管理</span>,
          children: (
            <Card title="类别结构" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('新增类别功能')}>新增类别</Button>}>
              <Tree 
                showIcon 
                defaultExpandAll 
                treeData={categoryTree}
                onSelect={(keys, info) => {
                  if (keys.length > 0) {
                    Modal.confirm({
                      title: '类别操作',
                      content: `选中: ${info.node.title}`,
                      okText: '编辑',
                      cancelText: '删除',
                      onOk: () => message.info('编辑类别'),
                      onCancel: () => message.warning('删除类别')
                    });
                  }
                }}
              />
              <Card size="small" style={{ marginTop: 16 }} title="类别说明">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><strong>安全生产法律法规:</strong> 包含国家和地方相关法律法规文件</div>
                  <div><strong>安全技术标准:</strong> 包含国家标准、行业标准等技术规范</div>
                  <div><strong>安全管理制度:</strong> 企业内部安全管理制度文件</div>
                  <div><strong>应急预案:</strong> 各类应急预案和处置方案</div>
                </Space>
              </Card>
            </Card>
          )
        },
        {
          key: '3',
          label: <span><FileTextOutlined /> 档案信息</span>,
          children: (
            <Card title="档案信息管理">
              <Tabs tabPosition="left" items={[
                { 
                  key: '3-1', 
                  label: '作业人员信息', 
                  children: (
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} size="small">新增人员</Button>}>
                      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
                        <Input.Search placeholder="搜索人员姓名、工号" style={{ width: 300 }} />
                      </Space>
                      <Table 
                        size="small"
                        columns={[
                          { title: '工号', dataIndex: 'id', key: 'id', width: 100 },
                          { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
                          { title: '部门', dataIndex: 'dept', key: 'dept', width: 120 },
                          { title: '岗位', dataIndex: 'position', key: 'position', width: 120 },
                          { title: '资质', dataIndex: 'cert', key: 'cert', render: (c: string) => <Tag color="blue">{c}</Tag> },
                          { title: '操作', key: 'action', width: 150, render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">编辑</Button></Space> }
                        ]}
                        dataSource={[
                          { key: '1', id: 'P001', name: '张三', dept: '采矿部', position: '采矿工', cert: '特种作业证' },
                          { key: '2', id: 'P002', name: '李四', dept: '机电部', position: '电工', cert: '电工证' }
                        ]}
                        pagination={{ pageSize: 5 }}
                      />
                    </Card>
                  )
                },
                { 
                  key: '3-2', 
                  label: '设备信息', 
                  children: (
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} size="small">新增设备</Button>}>
                      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
                        <Input.Search placeholder="搜索设备名称、编号" style={{ width: 300 }} />
                      </Space>
                      <Table 
                        size="small"
                        columns={[
                          { title: '设备编号', dataIndex: 'id', key: 'id', width: 120 },
                          { title: '设备名称', dataIndex: 'name', key: 'name', width: 150 },
                          { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
                          { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
                          { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === '正常' ? 'success' : 'warning'}>{s}</Tag> },
                          { title: '操作', key: 'action', width: 150, render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">编辑</Button></Space> }
                        ]}
                        dataSource={[
                          { key: '1', id: 'E001', name: '雷达监测仪', type: '监测设备', location: '北区边坡', status: '正常' },
                          { key: '2', id: 'E002', name: '气体传感器', type: '传感器', location: '采矿区A', status: '正常' }
                        ]}
                        pagination={{ pageSize: 5 }}
                      />
                    </Card>
                  )
                },
                { 
                  key: '3-3', 
                  label: '安全管理制度', 
                  children: (
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} size="small">新增制度</Button>}>
                      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
                        <Input.Search placeholder="搜索制度名称" style={{ width: 300 }} />
                      </Space>
                      <Table 
                        size="small"
                        columns={[
                          { title: '制度名称', dataIndex: 'name', key: 'name', width: 200 },
                          { title: '类别', dataIndex: 'category', key: 'category', width: 120, render: (c: string) => <Tag>{c}</Tag> },
                          { title: '发布日期', dataIndex: 'date', key: 'date', width: 120 },
                          { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (s: string) => <Tag color="success">{s}</Tag> },
                          { title: '操作', key: 'action', width: 180, render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">下载</Button></Space> }
                        ]}
                        dataSource={[
                          { key: '1', name: '安全生产责任制', category: '责任制度', date: '2024-01-01', status: '有效' },
                          { key: '2', name: '隐患排查治理制度', category: '管理制度', date: '2024-01-15', status: '有效' }
                        ]}
                        pagination={{ pageSize: 5 }}
                      />
                    </Card>
                  )
                },
                { 
                  key: '3-4', 
                  label: '应急预案', 
                  children: (
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} size="small">新增预案</Button>}>
                      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
                        <Input.Search placeholder="搜索预案名称" style={{ width: 300 }} />
                      </Space>
                      <Table 
                        size="small"
                        columns={[
                          { title: '预案名称', dataIndex: 'name', key: 'name', width: 200 },
                          { title: '类型', dataIndex: 'type', key: 'type', width: 120, render: (t: string) => <Tag color="blue">{t}</Tag> },
                          { title: '编制日期', dataIndex: 'date', key: 'date', width: 120 },
                          { title: '演练次数', dataIndex: 'drills', key: 'drills', width: 100 },
                          { title: '操作', key: 'action', width: 180, render: () => <Space><Button type="link" size="small">查看</Button><Button type="link" size="small">演练</Button></Space> }
                        ]}
                        dataSource={[
                          { key: '1', name: '边坡滑坡应急预案', type: '专项预案', date: '2024-01-10', drills: 2 },
                          { key: '2', name: '火灾事故应急预案', type: '专项预案', date: '2023-12-20', drills: 3 }
                        ]}
                        pagination={{ pageSize: 5 }}
                      />
                    </Card>
                  )
                }
              ]} />
            </Card>
          )
        },
        {
          key: '4',
          label: <span><SearchOutlined /> 统计分析</span>,
          children: (
            <div>
              <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>126</div><div style={{ color: '#999' }}>档案总数</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>45</div><div style={{ color: '#999' }}>法律法规</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>38</div><div style={{ color: '#999' }}>技术标准</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>28</div><div style={{ color: '#999' }}>管理制度</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 'bold' }}>15</div><div style={{ color: '#999' }}>应急预案</div></div>
                </Space>
              </Card>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Card title="档案类别分布">
                  <ReactECharts option={chartOption} style={{ height: 300 }} />
                </Card>
                <Card title="档案更新频率">
                  <ReactECharts 
                    option={{
                      title: { text: '近6个月档案更新趋势', left: 'center' },
                      tooltip: { trigger: 'axis' },
                      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
                      yAxis: { type: 'value' },
                      series: [{
                        name: '新增档案',
                        type: 'line',
                        data: [12, 15, 18, 14, 16, 20],
                        itemStyle: { color: '#1890ff' }
                      }, {
                        name: '更新档案',
                        type: 'line',
                        data: [8, 10, 12, 9, 11, 13],
                        itemStyle: { color: '#52c41a' }
                      }]
                    }} 
                    style={{ height: 300 }} 
                  />
                </Card>
                <Card title="档案使用统计">
                  <Table 
                    size="small"
                    columns={[
                      { title: '档案类别', dataIndex: 'category', key: 'category' },
                      { title: '总数', dataIndex: 'total', key: 'total' },
                      { title: '本月查阅', dataIndex: 'views', key: 'views' },
                      { title: '本月下载', dataIndex: 'downloads', key: 'downloads' },
                      { title: '使用率', dataIndex: 'rate', key: 'rate', render: (r: number) => `${r}%` }
                    ]}
                    dataSource={[
                      { key: '1', category: '法律法规', total: 45, views: 128, downloads: 45, rate: 85 },
                      { key: '2', category: '技术标准', total: 38, views: 96, downloads: 32, rate: 78 },
                      { key: '3', category: '管理制度', total: 28, views: 156, downloads: 68, rate: 92 },
                      { key: '4', category: '应急预案', total: 15, views: 89, downloads: 28, rate: 88 }
                    ]}
                    pagination={false}
                  />
                </Card>
              </Space>
            </div>
          )
        }
      ]} />

      <Modal
        title="上传规范文档"
        open={modalVisible}
        onOk={() => { message.success('上传成功'); setModalVisible(false); form.resetFields(); }}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规范名称" rules={[{ required: true }]}>
            <Input placeholder="请输入规范名称" />
          </Form.Item>
          <Form.Item name="category" label="所属类别" rules={[{ required: true }]}>
            <Select placeholder="请选择类别">
              <Option value="national">国家标准</Option>
              <Option value="industry">行业标准</Option>
            </Select>
          </Form.Item>
          <Form.Item name="scope" label="适用范围" rules={[{ required: true }]}>
            <Input placeholder="请输入适用范围" />
          </Form.Item>
          <Form.Item name="validUntil" label="有效期限" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="file" label="上传文件" rules={[{ required: true }]}>
            <Upload><Button icon={<UploadOutlined />}>选择文件</Button></Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StandardArchive;
