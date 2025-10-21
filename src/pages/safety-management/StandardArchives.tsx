import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface StandardRecord { key: string; name: string; category: string; scope: string; validUntil: string; status: string; }

const StandardArchives: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  const columns: ColumnsType<StandardRecord> = [
    { title: '规范名称', dataIndex: 'name', key: 'name' },
    { title: '所属类别', dataIndex: 'category', key: 'category', render: (category) => <Tag color='blue'>{category}</Tag> },
    { title: '适用范围', dataIndex: 'scope', key: 'scope' },
    { title: '有效期限', dataIndex: 'validUntil', key: 'validUntil' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作', key: 'action', render: () => <Space><Button type='link' size='small' icon={<EyeOutlined />}>预览</Button><Button type='link' size='small' icon={<DownloadOutlined />}>下载</Button></Space> },
  ];
  
  const data: StandardRecord[] = [
    { key: '1', name: '煤矿安全规程', category: '国家标准', scope: '全矿', validUntil: '2026-12-31', status: '有效' },
    { key: '2', name: '煤矿防治水细则', category: '行业标准', scope: '防排水系统', validUntil: '2025-06-30', status: '有效' },
  ];
  
  return (
    <div style={{ padding: 24 }}>
      <Card title={<><FileTextOutlined /> 标准规范档案库</>}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          { key: '1', label: '规范管理', children: (
            <>
              <Space style={{ marginBottom: 16 }}>
                <Input placeholder='搜索规范名称' prefix={<SearchOutlined />} style={{ width: 250 }} />
                <Select placeholder='所属类别' style={{ width: 150 }} options={[{value:'national',label:'国家标准'},{value:'industry',label:'行业标准'}]} />
                <Button type='primary' icon={<SearchOutlined />}>查询</Button>
                <Button type='primary' icon={<PlusOutlined />}>上传规范</Button>
              </Space>
              <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
            </>
          )},
          { key: '2', label: '类别管理', children: <div style={{ padding: 20, textAlign: 'center' }}>类别管理功能开发中...</div> },
          { key: '3', label: '档案信息', children: <div style={{ padding: 20, textAlign: 'center' }}>档案信息功能开发中...</div> },
          { key: '4', label: '统计分析', children: <div style={{ padding: 20, textAlign: 'center' }}>统计分析功能开发中...</div> },
        ]} />
      </Card>
    </div>
  );
};

export default StandardArchives;
