import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select, message, Alert, Space, Tag, Tabs, Timeline } from 'antd';
import { WarningOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { siloService, tempPileService, lossService } from '../../services/productionSalesMockService';
import type { Silo, TemporaryCoalPile, LossRecord } from '../../types/productionSales';
import dayjs from 'dayjs';

const { Option } = Select;

const InventoryManagementPageEnhanced: React.FC = () => {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [tempPiles, setTempPiles] = useState<TemporaryCoalPile[]>([]);
  const [lossRecords, setLossRecords] = useState<LossRecord[]>([]);
  const [pileModalVisible, setPileModalVisible] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [lossModalVisible, setLossModalVisible] = useState(false);
  const [pileForm] = Form.useForm();
  const [planForm] = Form.useForm();
  const [lossForm] = Form.useForm();

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      const updated = siloService.updateRealtime();
      setSilos(updated);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setSilos(siloService.getAll());
    setTempPiles(tempPileService.getAll());
    setLossRecords(lossService.getAll());
  };

  const totalInventory = silos.reduce((sum, s) => sum + s.currentVolume, 0) + 
                        tempPiles.reduce((sum, p) => sum + p.volume, 0);
  const warningCount = silos.filter(s => s.status !== 'normal').length;
  const overdueCount = tempPiles.filter(p => p.overdueWarning).length;

  const pileColumns = [
    { title: '煤堆编号', dataIndex: 'pileNumber', key: 'pileNumber', width: 100 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
    { title: '盘点日期', dataIndex: 'inventoryDate', key: 'inventoryDate', width: 120 },
    { title: '数量(吨)', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '盘点人', dataIndex: 'inspector', key: 'inspector', width: 100 },
    { 
      title: '预计进场', 
      dataIndex: 'expectedInbound', 
      key: 'expectedInbound', 
      width: 120,
      render: (date: string) => date || '-'
    },
    { 
      title: '预计出场', 
      dataIndex: 'expectedOutbound', 
      key: 'expectedOutbound', 
      width: 120,
      render: (date: string) => date || '-'
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_: any, record: TemporaryCoalPile) => {
        if (record.overdueWarning) {
          return <Tag color="error" icon={<WarningOutlined />}>超期堆放</Tag>;
        }
        if (record.expectedOutbound) {
          const daysRemaining = dayjs(record.expectedOutbound).diff(dayjs(), 'day');
          if (daysRemaining <= 3 && daysRemaining > 0) {
            return <Tag color="warning">即将到期({daysRemaining}天)</Tag>;
          }
        }
        return <Tag color="success">正常</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: TemporaryCoalPile) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleManagePlan(record)}>
            计划管理
          </Button>
          <Button type="link" size="small" onClick={() => handleViewPileDetail(record)}>
            详情
          </Button>
        </Space>
      )
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
        expectedInbound: values.expectedInbound?.format('YYYY-MM-DD'),
        expectedOutbound: values.expectedOutbound?.format('YYYY-MM-DD')
      });
      loadData();
      message.success('临时堆煤记录已添加');
      setPileModalVisible(false);
    });
  };

  const handleManagePlan = (pile: TemporaryCoalPile) => {
    planForm.setFieldsValue({
      pileNumber: pile.pileNumber,
      location: pile.location,
      expectedInbound: pile.expectedInbound ? dayjs(pile.expectedInbound) : null,
      expectedOutbound: pile.expectedOutbound ? dayjs(pile.expectedOutbound) : null
    });
    setPlanModalVisible(true);
  };

  const handlePlanSubmit = () => {
    planForm.validateFields().then(values => {
      const pile = tempPiles.find(p => p.pileNumber === values.pileNumber);
      if (pile) {
        tempPileService.update(pile.id, {
          expectedInbound: values.expectedInbound?.format('YYYY-MM-DD'),
          expectedOutbound: values.expectedOutbound?.format('YYYY-MM-DD')
        });
        loadData();
        message.success('进出场计划已更新');
        setPlanModalVisible(false);
      }
    });
  };

  const handleViewPileDetail = (pile: TemporaryCoalPile) => {
    const daysStored = dayjs().diff(dayjs(pile.inventoryDate), 'day');
    const daysUntilOutbound = pile.expectedOutbound ? dayjs(pile.expectedOutbound).diff(dayjs(), 'day') : null;
    
    Modal.info({
      title: `煤堆详情 - ${pile.pileNumber}`,
      width: 700,
      content: (
        <div>
          <p><strong>位置：</strong>{pile.location}</p>
          <p><strong>盘点日期：</strong>{pile.inventoryDate}</p>
          <p><strong>盘点数量：</strong>{pile.volume.toLocaleString()} 吨</p>
          <p><strong>盘点人：</strong>{pile.inspector}</p>
          <p><strong>已堆放天数：</strong>{daysStored} 天</p>
          {pile.expectedInbound && (
            <p><strong>预计进场时间：</strong>{pile.expectedInbound}</p>
          )}
          {pile.expectedOutbound && (
            <p><strong>预计出场时间：</strong>{pile.expectedOutbound}</p>
          )}
          {daysUntilOutbound !== null && (
            <p>
              <strong>距离出场：</strong>
              {daysUntilOutbound > 0 ? (
                <span style={{ color: daysUntilOutbound <= 3 ? '#faad14' : '#52c41a' }}>
                  {daysUntilOutbound} 天
                </span>
              ) : (
                <span style={{ color: '#ff4d4f' }}>已超期 {Math.abs(daysUntilOutbound)} 天</span>
              )}
            </p>
          )}
          {pile.remark && <p><strong>备注：</strong>{pile.remark}</p>}
          {pile.overdueWarning && (
            <Alert 
              message="超期预警" 
              description="该煤堆已超过预计出场时间，请尽快处理！" 
              type="warning" 
              showIcon 
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      )
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
      loadData();
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

  // 预警时间线
  const warningTimeline = [
    ...silos.filter(s => s.status !== 'normal').map(s => ({
      time: s.lastUpdate,
      type: 'silo',
      content: `${s.name} - ${s.status === 'high_warning' ? '高位预警' : '低位预警'}`,
      color: 'red'
    })),
    ...tempPiles.filter(p => p.overdueWarning || (p.expectedOutbound && dayjs(p.expectedOutbound).diff(dayjs(), 'day') <= 3)).map(p => ({
      time: p.inventoryDate,
      type: 'pile',
      content: `${p.pileNumber} - ${p.overdueWarning ? '超期堆放' : '即将到期'}`,
      color: 'orange'
    }))
  ].sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf()).slice(0, 10);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="当前总库存" value={totalInventory.toFixed(0)} suffix="吨" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="筒仓预警数" 
              value={warningCount} 
              suffix="处"
              prefix={warningCount > 0 ? <WarningOutlined /> : null}
              valueStyle={{ color: warningCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="超期堆煤" 
              value={overdueCount} 
              suffix="处"
              prefix={overdueCount > 0 ? <BellOutlined /> : null}
              valueStyle={{ color: overdueCount > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="临时堆煤总量" 
              value={tempPiles.reduce((sum, p) => sum + p.volume, 0).toFixed(0)} 
              suffix="吨"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="silos"
        items={[
          {
            key: 'silos',
            label: '筒仓监测',
            children: (
              <Card title="筒仓实时监测">
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
            )
          },
          {
            key: 'piles',
            label: '临时堆煤',
            children: (
              <Card
                title="临时堆煤管理"
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddPile}>新增盘点</Button>}
              >
                {overdueCount > 0 && (
                  <Alert
                    message={`当前有 ${overdueCount} 处煤堆超期堆放`}
                    description="超期堆放会增加管理成本和自然损耗，请尽快安排出场"
                    type="warning"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                  />
                )}
                <Table columns={pileColumns} dataSource={tempPiles} rowKey="id" pagination={{ pageSize: 10 }} />
              </Card>
            )
          },
          {
            key: 'loss',
            label: '损耗管理',
            children: (
              <Card
                title="损耗量管理"
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddLoss}>新增损耗</Button>}
              >
                <Table columns={lossColumns} dataSource={lossRecords} rowKey="id" pagination={{ pageSize: 10 }} style={{ marginBottom: 24 }} />
                <ReactECharts option={lossChartOption} style={{ height: 300 }} />
              </Card>
            )
          },
          {
            key: 'warnings',
            label: (
              <span>
                <BellOutlined />
                预警中心
              </span>
            ),
            children: (
              <Card title="预警时间线">
                {warningTimeline.length > 0 ? (
                  <Timeline
                    items={warningTimeline.map(w => ({
                      color: w.color,
                      children: (
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{w.content}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>{dayjs(w.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                      )
                    }))}
                  />
                ) : (
                  <Alert message="当前无预警信息" type="success" showIcon />
                )}
              </Card>
            )
          }
        ]}
      />

      {/* 新增临时堆煤盘点 */}
      <Modal title="新增临时堆煤盘点" open={pileModalVisible} onOk={handlePileSubmit} onCancel={() => setPileModalVisible(false)} okText="保存" cancelText="取消" width={700}>
        <Form form={pileForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="pileNumber" label="煤堆编号" rules={[{ required: true }]}>
                <Input placeholder="例如：A-01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="位置" rules={[{ required: true }]}>
                <Input placeholder="例如：北区堆场" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="inventoryDate" label="盘点日期" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="volume" label="盘点数量(吨)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="inspector" label="盘点人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="expectedInbound" label="预计进场时间">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedOutbound" label="预计出场时间">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 进出场计划管理 */}
      <Modal title="进出场计划管理" open={planModalVisible} onOk={handlePlanSubmit} onCancel={() => setPlanModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={planForm} layout="vertical">
          <Form.Item name="pileNumber" label="煤堆编号">
            <Input disabled />
          </Form.Item>
          <Form.Item name="location" label="位置">
            <Input disabled />
          </Form.Item>
          <Form.Item name="expectedInbound" label="预计进场时间">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expectedOutbound" label="预计出场时间">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Alert
            message="提示"
            description="设置预计出场时间后，系统会在临近或超期时自动预警"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>

      {/* 新增损耗记录 */}
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

export default InventoryManagementPageEnhanced;
