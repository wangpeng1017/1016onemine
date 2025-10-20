import React, { useState, useEffect } from 'react';
import { Card, Form, DatePicker, Select, Button, Table, Tag, Alert as AntAlert, Space, message } from 'antd';
import { ToolOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { equipmentService, workLogService } from '../../services/environmentalMockService';
import type { Equipment, WorkLog } from '../../types/environmental';
import dayjs from 'dayjs';

const { Option } = Select;

const ConstructionUnitsPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setEquipment(equipmentService.getAll());
    setWorkLogs(workLogService.getAll());
  }, []);

  const constructionUnits = ['第一施工队', '第二施工队', '外包施工单位A', '外包施工单位B'];

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newLog = workLogService.add({
        date: values.date.format('YYYY-MM-DD'),
        constructionUnit: values.constructionUnit,
        workArea: values.workArea,
        mainEquipment: values.mainEquipment || [],
        auxiliaryEquipment: values.auxiliaryEquipment || []
      });
      setWorkLogs(workLogService.getAll());
      message.success('作业日志已提交');
      
      if (newLog.complianceIssues.length > 0) {
        message.warning(`发现 ${newLog.complianceIssues.length} 个合规问题，请检查！`);
      }
      
      form.resetFields();
    });
  };

  const logColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '施工单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 150 },
    { title: '作业范围', dataIndex: 'workArea', key: 'workArea', width: 150 },
    { 
      title: '主要设备', 
      dataIndex: 'mainEquipment', 
      key: 'mainEquipment',
      render: (ids: string[]) => ids.map(id => equipment.find(e => e.id === id)?.name).join(', ')
    },
    { 
      title: '附属设备', 
      dataIndex: 'auxiliaryEquipment', 
      key: 'auxiliaryEquipment',
      render: (ids: string[]) => ids.map(id => equipment.find(e => e.id === id)?.name).join(', ')
    },
    {
      title: '合规状态',
      dataIndex: 'complianceIssues',
      key: 'complianceIssues',
      render: (issues: string[]) => 
        issues.length === 0 ? (
          <Tag color="success">合规</Tag>
        ) : (
          <Tag color="error" icon={<WarningOutlined />}>
            {issues.length} 个问题
          </Tag>
        )
    }
  ];

  const equipmentColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '设备名称', dataIndex: 'name', key: 'name', width: 150 },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 100,
      render: (t: string) => t === 'main' ? '主要设备' : '附属设备'
    },
    {
      title: '环保合规',
      dataIndex: 'environmentalCompliant',
      key: 'environmentalCompliant',
      width: 120,
      render: (compliant: boolean, record: Equipment) => 
        compliant ? (
          <Tag color="success">达标</Tag>
        ) : (
          <Tag color="error">{record.description || '不达标'}</Tag>
        )
    }
  ];

  const mainEquipment = equipment.filter(e => e.type === 'main');
  const auxiliaryEquipment = equipment.filter(e => e.type === 'auxiliary');

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={<span><ToolOutlined style={{ marginRight: 8 }} />每日作业日志</span>}>
          <Form form={form} layout="vertical">
            <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="constructionUnit" label="施工单位" rules={[{ required: true, message: '请选择施工单位' }]}>
              <Select placeholder="请选择">
                {constructionUnits.map(u => <Option key={u} value={u}>{u}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="workArea" label="作业范围" rules={[{ required: true, message: '请输入作业范围' }]}>
              <Select mode="tags" placeholder="输入或选择作业区域">
                <Option value="A区">A区</Option>
                <Option value="B区">B区</Option>
                <Option value="C区">C区</Option>
              </Select>
            </Form.Item>
            <Form.Item name="mainEquipment" label="主要设备">
              <Select mode="multiple" placeholder="选择主要设备">
                {mainEquipment.map(e => <Option key={e.id} value={e.id}>{e.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="auxiliaryEquipment" label="附属设备">
              <Select mode="multiple" placeholder="选择附属设备">
                {auxiliaryEquipment.map(e => (
                  <Option key={e.id} value={e.id} disabled={!e.environmentalCompliant}>
                    {e.name} {!e.environmentalCompliant && <Tag color="error" style={{ marginLeft: 4 }}>不合规</Tag>}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleSubmit}>
                提交作业日志
              </Button>
            </Form.Item>
          </Form>

          {workLogs.length > 0 && workLogs.some(log => log.complianceIssues.length > 0) && (
            <AntAlert
              message="合规性警告"
              description={`共 ${workLogs.filter(log => log.complianceIssues.length > 0).length} 条记录存在合规问题，请及时处理。`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
        </Card>

        <Card title="作业记录">
          <Table
            columns={logColumns}
            dataSource={workLogs}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            expandable={{
              expandedRowRender: (record) => 
                record.complianceIssues.length > 0 ? (
                  <div style={{ padding: 8, background: '#fff2e8' }}>
                    <strong>合规问题：</strong>
                    <ul style={{ marginTop: 8 }}>
                      {record.complianceIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                  </div>
                ) : null,
              rowExpandable: (record) => record.complianceIssues.length > 0
            }}
          />
        </Card>

        <Card title="设备台账">
          <Table
            columns={equipmentColumns}
            dataSource={equipment}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      </Space>
    </div>
  );
};

export default ConstructionUnitsPage;
