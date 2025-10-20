import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select, message, Alert, Space } from 'antd';
import { WarningOutlined, PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { siloService, tempPileService, lossService } from '../../services/productionSalesMockService';
import type { Silo, TemporaryCoalPile, LossRecord } from '../../types/productionSales';
import dayjs from 'dayjs';

const { Option } = Select;

const InventoryManagementPage: React.FC = () => {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [tempPiles, setTempPiles] = useState<TemporaryCoalPile[]>([]);
  const [lossRecords, setLossRecords] = useState<LossRecord[]>([]);
  const [pileModalVisible, setPileModalVisible] = useState(false);
  const [lossModalVisible, setLossModalVisible] = useState(false);
  const [pileForm] = Form.useForm();
  const [lossForm] = Form.useForm();

  useEffect(() => {
    setSilos(siloService.getAll());
    setTempPiles(tempPileService.getAll());
    setLossRecords(lossService.getAll());

    const interval = setInterval(() => {
      const updated = siloService.updateRealtime();
      setSilos(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalInventory = silos.reduce((sum, s) => sum + s.currentVolume, 0) + 
                        tempPiles.reduce((sum, p) => sum + p.volume, 0);

  const warningCount = silos.filter(s => s.status !== 'normal').length;

  const pileColumns = [
    { title: '煤堆编号', dataIndex: 'pileNumber', key: 'pileNumber', width: 100 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
    { title: '盘点日期', dataIndex: 'inventoryDate', key: 'inventoryDate', width: 120 },
    { title: '数量(吨)', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '盘点人', dataIndex: 'inspector', key: 'inspector', width: 100 },
    { title: '预计出场', dataIndex: 'expectedOutbound', key: 'expectedOutbound', width: 120 },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: TemporaryCoalPile) => 
        record.overdueWarning ? <Alert message="超期" type="warning" showIcon style={{ padding: '4px 8px' }} /> : <span>正常</span>
    }
  ];

  const lossColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '类别', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
    { title: '损耗量(吨)', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '责任部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '责任人', dataIndex: 'responsible', key: 'responsible', width: 100 },
    { title: '原因', dataIndex: 'reason', key: 'reason', ellipsis: true }
  ];

  const handleAddPile = () => {
    pileForm.resetFields();
    setPileModalVisible(true);
  };

  const handlePileSubmit = () => {
    pileForm.validateFields().then(values => {
      tempPileService.add({
        ...values,
        inventoryDate: values.inventoryDate.format('YYYY-MM-DD'),
        expectedOutbound: values.expectedOutbound?.format('YYYY-MM-DD')
      });
      setTempPiles(tempPileService.getAll());
      message.success('临时堆煤记录已添加');
      setPileModalVisible(false);
    });
  };

  const handleAddLoss = () => {
    lossForm.resetFields();
    setLossModalVisible(true);
  };

  const handleLossSubmit = () => {
    lossForm.validateFields().then(values => {
      const categoryMap: Record<string, string> = {
        external_coal: '外协用煤',
        production_waste: '生产排弃废料',
        natural_loss: '损耗煤'
      };
      lossService.add({
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        categoryName: categoryMap[values.category]
      });
      setLossRecords(lossService.getAll());
      message.success('损耗记录已添加');
      setLossModalVisible(false);
    });
  };

  const siloChartOption = {
    title: { text: '筒仓存煤分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c}吨 ({d}%)' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: silos.map(s => ({ name: s.name, value: s.currentVolume })),
      label: { formatter: '{b}\n{c}吨' }
    }]
  };

  const lossStats = lossService.getStatistics('2024-01-01', '2024-12-31');
  const lossChartOption = {
    title: { text: '损耗量统计', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Object.keys(lossStats) },
    yAxis: { type: 'value', name: '损耗量(吨)' },
    series: [{
      type: 'bar',
      data: Object.values(lossStats).map(v => v.toFixed(1)),
      itemStyle: { color: '#ff7875' }
    }],
    grid: { left: '15%', right: '5%', bottom: '15%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总库存量" value={totalInventory.toFixed(0)} suffix="吨" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="筒仓存煤" value={silos.reduce((sum, s) => sum + s.currentVolume, 0).toFixed(0)} suffix="吨" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="临时堆煤" value={tempPiles.reduce((sum, p) => sum + p.volume, 0).toFixed(0)} suffix="吨" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="预警数量" 
              value={warningCount} 
              suffix="处" 
              valueStyle={{ color: warningCount > 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={warningCount > 0 ? <WarningOutlined /> : null}
            />
          </Card>
        </Col>
      </Row>

      <Card title="筒仓实时监测" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {silos.map(silo => (
            <Col span={8} key={silo.id} style={{ marginBottom: 16 }}>
              <Card size="small" title={silo.name} extra={<span style={{ fontSize: 12, color: '#999' }}>{silo.lastUpdate}</span>}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Progress
                    type="circle"
                    percent={parseFloat(((silo.currentLevel / (silo.highAlarm + 1)) * 100).toFixed(1))}
                    format={() => `${silo.currentVolume}吨`}
                    status={silo.status === 'high_warning' ? 'exception' : silo.status === 'low_warning' ? 'exception' : 'success'}
                  />
                </div>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>料位高度:</span><strong>{silo.currentLevel}m</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>总容量:</span><span>{silo.capacity}吨</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>利用率:</span><span>{((silo.currentVolume / silo.capacity) * 100).toFixed(1)}%</span>
                  </div>
                  {silo.status !== 'normal' && (
                    <Alert
                      message={silo.status === 'high_warning' ? '高位预警' : '低位预警'}
                      type="warning"
                      showIcon
                      style={{ marginTop: 8 }}
                    />
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
        <ReactECharts option={siloChartOption} style={{ height: 300, marginTop: 24 }} />
      </Card>

      <Card
        title="临时堆煤管理"
        style={{ marginBottom: 24 }}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddPile}>新增盘点</Button>}
      >
        <Table columns={pileColumns} dataSource={tempPiles} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Card
        title="损耗量管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddLoss}>新增损耗</Button>}
      >
        <Table columns={lossColumns} dataSource={lossRecords} rowKey="id" pagination={{ pageSize: 10 }} style={{ marginBottom: 24 }} />
        <ReactECharts option={lossChartOption} style={{ height: 300 }} />
      </Card>

      <Modal title="新增临时堆煤盘点" open={pileModalVisible} onOk={handlePileSubmit} onCancel={() => setPileModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={pileForm} layout="vertical">
          <Form.Item name="pileNumber" label="煤堆编号" rules={[{ required: true }]}>
            <Input placeholder="例如：A-01" />
          </Form.Item>
          <Form.Item name="location" label="位置" rules={[{ required: true }]}>
            <Input placeholder="例如：北区堆场" />
          </Form.Item>
          <Form.Item name="inventoryDate" label="盘点日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="volume" label="盘点数量(吨)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="inspector" label="盘点人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="expectedOutbound" label="预计出场时间">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="新增损耗记录" open={lossModalVisible} onOk={handleLossSubmit} onCancel={() => setLossModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={lossForm} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="category" label="损耗类别" rules={[{ required: true }]}>
            <Select>
              <Option value="external_coal">外协用煤</Option>
              <Option value="production_waste">生产排弃废料</Option>
              <Option value="natural_loss">损耗煤</Option>
            </Select>
          </Form.Item>
          <Form.Item name="volume" label="损耗量(吨)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="department" label="责任部门" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="responsible" label="责任人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="reason" label="原因说明" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
