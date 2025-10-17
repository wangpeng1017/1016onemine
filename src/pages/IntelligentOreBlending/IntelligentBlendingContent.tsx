import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Table, message, Row, Col, InputNumber } from 'antd';
import { ThunderboltOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface OreSourceRow {
  key: string;
  oreName: string;
  originalGrade: number | null;
  quantity: number | null;
  ratio: number | null;
}

interface ResultRow {
  key: string;
  oreName: string;
  originalGrade: number;
  quantity: number;
  ratio: number;
  gradeContribution: number;
}

const IntelligentBlendingContent: React.FC = () => {
  const [form] = Form.useForm();
  const [oreList, setOreList] = useState<OreSourceRow[]>([
    { key: '1', oreName: '', originalGrade: null, quantity: null, ratio: null },
  ]);
  const [resultData, setResultData] = useState<ResultRow[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [calculatedGrade, setCalculatedGrade] = useState<number>(0);

  // 矿石来源表格列
  const oreColumns: ColumnsType<OreSourceRow> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '矿石名称',
      dataIndex: 'oreName',
      key: 'oreName',
      width: 200,
      render: (value, record, index) => (
        <Input
          value={value}
          placeholder="请输入矿石名称"
          onChange={(e) => handleOreListChange(index, 'oreName', e.target.value)}
        />
      ),
    },
    {
      title: '原矿品位(%)',
      dataIndex: 'originalGrade',
      key: 'originalGrade',
      width: 150,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          placeholder="请输入"
          style={{ width: '100%' }}
          min={0}
          max={100}
          precision={2}
          onChange={(val) => handleOreListChange(index, 'originalGrade', val)}
        />
      ),
    },
    {
      title: '配矿量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          placeholder="请输入"
          style={{ width: '100%' }}
          min={0}
          precision={0}
          onChange={(val) => handleOreListChange(index, 'quantity', val)}
        />
      ),
    },
    {
      title: '配矿比例(%)',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 150,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          placeholder="请输入"
          style={{ width: '100%' }}
          min={0}
          max={100}
          precision={2}
          onChange={(val) => handleOreListChange(index, 'ratio', val)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, __, index) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(index)}
          disabled={oreList.length === 1}
        >
          删除
        </Button>
      ),
    },
  ];

  // 计算结果表格列
  const resultColumns: ColumnsType<ResultRow> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '矿石名称',
      dataIndex: 'oreName',
      key: 'oreName',
      width: 200,
    },
    {
      title: '原矿品位(%)',
      dataIndex: 'originalGrade',
      key: 'originalGrade',
      width: 150,
    },
    {
      title: '配矿量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '配矿比例(%)',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 150,
    },
    {
      title: '品位贡献(%)',
      dataIndex: 'gradeContribution',
      key: 'gradeContribution',
      width: 150,
      render: (value: number) => value.toFixed(2),
    },
  ];

  const handleOreListChange = (index: number, field: string, value: any) => {
    const newList = [...oreList];
    newList[index] = { ...newList[index], [field]: value };
    setOreList(newList);
  };

  const handleAddRow = () => {
    const newRow: OreSourceRow = {
      key: String(oreList.length + 1),
      oreName: '',
      originalGrade: null,
      quantity: null,
      ratio: null,
    };
    setOreList([...oreList, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    if (oreList.length === 1) {
      message.warning('至少保留一行');
      return;
    }
    const newList = oreList.filter((_, i) => i !== index);
    setOreList(newList);
  };

  const handleCalculate = () => {
    // 验证数据
    const validRows = oreList.filter(
      (row) =>
        row.oreName &&
        row.originalGrade !== null &&
        row.quantity !== null &&
        row.ratio !== null
    );

    if (validRows.length === 0) {
      message.error('请至少填写一行完整数据');
      return;
    }

    // 计算总配矿量和总比例
    const totalQuantity = validRows.reduce((sum, row) => sum + (row.quantity || 0), 0);
    const totalRatio = validRows.reduce((sum, row) => sum + (row.ratio || 0), 0);

    if (Math.abs(totalRatio - 100) > 0.1) {
      message.warning(`配矿比例总和为 ${totalRatio.toFixed(1)}%，应为100%`);
    }

    // 计算结果
    const results: ResultRow[] = validRows.map((row, index) => {
      const gradeContribution = ((row.originalGrade || 0) * (row.ratio || 0)) / 100;
      return {
        key: String(index + 1),
        oreName: row.oreName || '',
        originalGrade: row.originalGrade || 0,
        quantity: row.quantity || 0,
        ratio: row.ratio || 0,
        gradeContribution,
      };
    });

    // 计算混合品位
    const mixedGrade = results.reduce((sum, row) => sum + row.gradeContribution, 0);

    setResultData(results);
    setCalculatedGrade(mixedGrade);
    setShowResult(true);
    message.success(`计算完成！混合品位: ${mixedGrade.toFixed(2)}%`);
  };

  const handleReset = () => {
    setOreList([{ key: '1', oreName: '', originalGrade: null, quantity: null, ratio: null }]);
    setResultData([]);
    setShowResult(false);
    setCalculatedGrade(0);
    form.resetFields();
    message.info('已重置');
  };

  const handleSave = () => {
    if (!showResult) {
      message.warning('请先进行配矿计算');
      return;
    }
    message.success('配矿方案已保存');
  };

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#262626', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <ThunderboltOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          智能配矿计算
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: '14px' }}>
          通过输入矿石来源数据，智能计算最优配矿方案
        </p>
      </div>

      {/* 配矿参数输入 */}
      <Card 
        title="配矿信息输入" 
        style={{ 
          marginBottom: 16, 
          borderRadius: 8, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}
        size="small"
      >
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="targetGrade" label="目标品位(%)">
            <InputNumber placeholder="请输入" style={{ width: 200 }} min={0} max={100} precision={2} />
          </Form.Item>
          <Form.Item name="totalQuantity" label="总配矿量(吨)">
            <InputNumber placeholder="请输入" style={{ width: 200 }} min={0} precision={0} />
          </Form.Item>
        </Form>

        <Table
          columns={oreColumns}
          dataSource={oreList}
          pagination={false}
          size="middle"
          bordered
          className="custom-table"
        />

        <div style={{ marginTop: 16 }}>
          <Space>
            <Button icon={<PlusOutlined />} onClick={handleAddRow} size="middle">
              添加矿石来源
            </Button>
            <Button 
              type="primary" 
              icon={<ThunderboltOutlined />} 
              onClick={handleCalculate}
              size="middle"
              style={{ 
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
              }}
            >
              开始计算
            </Button>
            <Button onClick={handleReset} size="middle">
              重置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 计算结果 */}
      {showResult && (
        <Card
          title="配矿计算结果"
          style={{ 
            borderRadius: 8, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}
          extra={
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSave}
              style={{ 
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(82, 196, 26, 0.3)'
              }}
            >
              保存方案
            </Button>
          }
        >
          <Table
            columns={resultColumns}
            dataSource={resultData}
            pagination={false}
            size="middle"
            bordered
            className="custom-table"
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3}>
                    <strong>
                      {resultData.reduce((sum, row) => sum + row.quantity, 0).toLocaleString()} 吨
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>
                      {resultData.reduce((sum, row) => sum + row.ratio, 0).toFixed(2)}%
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <strong style={{ color: '#1890ff', fontSize: 16 }}>
                      混合品位: {calculatedGrade.toFixed(2)}%
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          {/* 关键指标统计 */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={8}>
              <Card 
                size="small"
                style={{ 
                  borderRadius: 8, 
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none'
                }}
              >
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>混合品位</div>
                  <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                    {calculatedGrade.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>计算结果</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                size="small"
                style={{ 
                  borderRadius: 8, 
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none'
                }}
              >
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>总配矿量</div>
                  <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                    {resultData.reduce((sum, row) => sum + row.quantity, 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>吨</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                size="small"
                style={{ 
                  borderRadius: 8, 
                  background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                  border: 'none'
                }}
              >
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>矿源数量</div>
                  <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                    {resultData.length}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>个</div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default IntelligentBlendingContent;
