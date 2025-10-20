import React, { useState, useEffect } from 'react';
import { Card, Tabs, Tree, Button, Modal, Form, InputNumber, Radio, Space, Table, message, Row, Col } from 'antd';
import { TrophyOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import DocumentManager from '../../components/environmental/DocumentManager';
import {
  greenMineIndicatorService,
  greenMinePlanService,
  auditService,
  assessmentService,
  documentService
} from '../../services/environmentalMockService';
import type { GreenMineIndicator, GovernmentAudit, Document } from '../../types/environmental';

const GreenMinePage: React.FC = () => {
  const [indicators, setIndicators] = useState<GreenMineIndicator[]>([]);
  const [audits, setAudits] = useState<GovernmentAudit[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [evalModalVisible, setEvalModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<GreenMineIndicator | null>(null);
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [evalForm] = Form.useForm();
  const [auditForm] = Form.useForm();

  useEffect(() => {
    setIndicators(greenMineIndicatorService.getAll());
    setAudits(auditService.getAll());
    setDocuments(documentService.getAll());
  }, []);

  const stats = assessmentService.getStats(period);

  const treeData = indicators.map(ind => ({
    title: `${ind.name} (权重: ${ind.weight}%)`,
    key: ind.id,
    children: ind.children?.map(child => ({
      title: `${child.name} (权重: ${child.weight}%)`,
      key: child.id
    }))
  }));

  const handleEvaluate = (indicator: GreenMineIndicator) => {
    setSelectedIndicator(indicator);
    evalForm.setFieldsValue(indicator.selfEvaluation || {});
    setEvalModalVisible(true);
  };

  const handleEvalSubmit = () => {
    evalForm.validateFields().then(values => {
      if (selectedIndicator) {
        greenMineIndicatorService.updateEvaluation(selectedIndicator.id, values);
        message.success('自评结果已保存');
        setEvalModalVisible(false);
      }
    });
  };

  const handleAddAudit = () => {
    auditForm.resetFields();
    setAuditModalVisible(true);
  };

  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      auditService.add(values);
      setAudits(auditService.getAll());
      message.success('核查记录已添加');
      setAuditModalVisible(false);
    });
  };

  const auditColumns = [
    { title: '核查日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '核查部门', dataIndex: 'department', key: 'department', width: 200 },
    { title: '核查结果', dataIndex: 'result', key: 'result', ellipsis: true },
    { title: '改进措施', dataIndex: 'improvementMeasures', key: 'improvementMeasures', ellipsis: true }
  ];

  const radarOption = {
    title: { text: '绿色矿山建设水平', left: 'center', textStyle: { fontSize: 14 } },
    radar: {
      indicator: [
        { name: '矿区环境', max: 100 },
        { name: '资源利用', max: 100 },
        { name: '生态修复', max: 100 },
        { name: '企业管理', max: 100 },
        { name: '企业文化', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: stats.length > 0 ? Object.values(stats[stats.length - 1].categoryScores) : [],
        name: '当前水平',
        areaStyle: { color: 'rgba(24, 144, 255, 0.3)' }
      }]
    }]
  };

  const trendOption = {
    title: { text: '考核结果趋势', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: stats.map(s => s.date) },
    yAxis: { type: 'value', name: '综合得分', max: 100 },
    series: [{
      name: '综合得分',
      type: 'line',
      data: stats.map(s => s.overallScore.toFixed(1)),
      smooth: true,
      itemStyle: { color: '#52c41a' },
      areaStyle: { color: 'rgba(82, 196, 26, 0.2)' }
    }],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        items={[
          {
            key: 'indicators',
            label: <span><TrophyOutlined /> 评价指标</span>,
            children: (
              <Card title="绿色矿山评价指标体系">
                <Tree
                  treeData={treeData}
                  defaultExpandAll
                  showLine
                  titleRender={(node) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{node.title}</span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          const indicator = indicators.find(i => i.id === node.key) || 
                                          indicators.flatMap(i => i.children || []).find(c => c.id === node.key);
                          if (indicator) handleEvaluate(indicator);
                        }}
                      >
                        自评
                      </Button>
                    </div>
                  )}
                />
              </Card>
            )
          },
          {
            key: 'plans',
            label: '实施方案',
            children: (
              <Card title="年度绿色矿山巩固建设实施方案">
                <DocumentManager
                  documents={documents}
                  onAdd={(doc) => documentService.add(doc)}
                  onDelete={(id) => documentService.delete(id)}
                />
              </Card>
            )
          },
          {
            key: 'stats',
            label: '考核统计',
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card
                  title="时间筛选"
                  extra={
                    <Radio.Group value={period} onChange={e => setPeriod(e.target.value)}>
                      <Radio.Button value="day">日</Radio.Button>
                      <Radio.Button value="month">月</Radio.Button>
                      <Radio.Button value="year">年</Radio.Button>
                    </Radio.Group>
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <ReactECharts option={radarOption} style={{ height: 350 }} />
                    </Col>
                    <Col span={12}>
                      <ReactECharts option={trendOption} style={{ height: 350 }} />
                    </Col>
                  </Row>
                </Card>
              </Space>
            )
          },
          {
            key: 'audits',
            label: '政府核查',
            children: (
              <Card
                title="政府核查记录"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAudit}>
                    新增核查记录
                  </Button>
                }
              >
                <Table
                  columns={auditColumns}
                  dataSource={audits}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />

      <Modal
        title="指标自评"
        open={evalModalVisible}
        onOk={handleEvalSubmit}
        onCancel={() => setEvalModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        {selectedIndicator && (
          <Form form={evalForm} layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <strong>指标名称：</strong>{selectedIndicator.name}<br />
              <strong>指标说明：</strong>{selectedIndicator.description}
            </div>
            <Form.Item name="score" label="自评分数（0-100）">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="compliant" label="是否达标">
              <Radio.Group>
                <Radio value={true}>达标</Radio>
                <Radio value={false}>未达标</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="notes" label="备注说明">
              <Form.Item>
                <textarea rows={3} style={{ width: '100%', padding: 8 }} placeholder="填写自评说明和改进计划" />
              </Form.Item>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="新增政府核查记录"
        open={auditModalVisible}
        onOk={handleAuditSubmit}
        onCancel={() => setAuditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={auditForm} layout="vertical">
          <Form.Item name="date" label="核查日期" rules={[{ required: true, message: '请输入核查日期' }]}>
            <input type="date" style={{ width: '100%', padding: 8 }} />
          </Form.Item>
          <Form.Item name="department" label="核查部门" rules={[{ required: true, message: '请输入核查部门' }]}>
            <input placeholder="例如：自然资源局" style={{ width: '100%', padding: 8 }} />
          </Form.Item>
          <Form.Item name="result" label="核查结果" rules={[{ required: true, message: '请输入核查结果' }]}>
            <textarea rows={3} style={{ width: '100%', padding: 8 }} placeholder="描述核查结果" />
          </Form.Item>
          <Form.Item name="improvementMeasures" label="改进措施">
            <textarea rows={3} style={{ width: '100%', padding: 8 }} placeholder="描述需要采取的改进措施" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GreenMinePage;
