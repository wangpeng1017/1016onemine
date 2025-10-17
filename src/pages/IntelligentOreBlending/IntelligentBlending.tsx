import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Select, Button, Space, Table, message, Divider, Slider } from 'antd';
import { ThunderboltOutlined, ReloadOutlined, SaveOutlined, CalculatorOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface OreSource {
  key: string;
  name: string;
  grade: number;
  stock: number;
  ratio: number;
}

interface BlendingResult {
  key: string;
  oreName: string;
  ratio: number;
  quantity: number;
  grade: number;
}

const IntelligentBlending: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState<BlendingResult[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 矿石来源数据
  const oreSources: OreSource[] = [
    { key: '1', name: '一号矿区铁矿石', grade: 38.5, stock: 15000, ratio: 0 },
    { key: '2', name: '二号矿区铁矿石', grade: 32.0, stock: 12000, ratio: 0 },
    { key: '3', name: '三号矿区铁矿石', grade: 35.8, stock: 8000, ratio: 0 },
    { key: '4', name: '外购铁矿石A', grade: 42.0, stock: 5000, ratio: 0 },
  ];

  const [oreList, setOreList] = useState<OreSource[]>(oreSources);

  // 矿石来源表格列
  const oreSourceColumns: ColumnsType<OreSource> = [
    {
      title: '矿石来源',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '品位(%)',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '库存量(吨)',
      dataIndex: 'stock',
      key: 'stock',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '配矿比例(%)',
      key: 'ratio',
      render: (_, record, index) => (
        <Slider
          min={0}
          max={100}
          value={record.ratio}
          onChange={(value) => handleRatioChange(index, value)}
          style={{ width: 200 }}
        />
      ),
    },
  ];

  // 计算结果表格列
  const resultColumns: ColumnsType<BlendingResult> = [
    {
      title: '矿石名称',
      dataIndex: 'oreName',
      key: 'oreName',
    },
    {
      title: '配比(%)',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '配矿量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '品位贡献(%)',
      dataIndex: 'grade',
      key: 'grade',
      render: (value: number) => value.toFixed(2),
    },
  ];

  const handleRatioChange = (index: number, value: number) => {
    const newList = [...oreList];
    newList[index].ratio = value;
    setOreList(newList);
  };

  const handleCalculate = () => {
    const values = form.getFieldsValue();
    const totalQuantity = Number(values.totalQuantity) || 0;
    const targetGrade = Number(values.targetGrade) || 0;

    if (totalQuantity <= 0) {
      message.error('请输入总配矿量');
      return;
    }

    if (targetGrade <= 0) {
      message.error('请输入目标品位');
      return;
    }

    // 检查配比总和
    const totalRatio = oreList.reduce((sum, ore) => sum + ore.ratio, 0);
    if (Math.abs(totalRatio - 100) > 0.1) {
      message.warning(`配比总和为 ${totalRatio.toFixed(1)}%，请调整为100%`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 计算结果
      const results: BlendingResult[] = oreList
        .filter(ore => ore.ratio > 0)
        .map(ore => ({
          key: ore.key,
          oreName: ore.name,
          ratio: ore.ratio,
          quantity: (totalQuantity * ore.ratio) / 100,
          grade: (ore.grade * ore.ratio) / 100,
        }));

      // 计算实际品位
      const actualGrade = results.reduce((sum, r) => sum + r.grade, 0);
      
      setCalculationResult(results);
      setShowResult(true);
      setLoading(false);

      if (Math.abs(actualGrade - targetGrade) > 1) {
        message.warning(`实际品位 ${actualGrade.toFixed(2)}%，与目标品位 ${targetGrade}% 偏差较大`);
      } else {
        message.success(`计算完成！实际品位: ${actualGrade.toFixed(2)}%`);
      }
    }, 1000);
  };

  const handleAutoOptimize = () => {
    const values = form.getFieldsValue();
    const targetGrade = Number(values.targetGrade) || 0;

    if (targetGrade <= 0) {
      message.error('请输入目标品位');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 简单的优化算法：根据品位接近度分配比例
      const newList = oreList.map(ore => {
        const diff = Math.abs(ore.grade - targetGrade);
        return { ...ore, ratio: 0 };
      });

      // 找到最接近目标品位的两个矿源
      const sorted = [...newList].sort((a, b) => 
        Math.abs(a.grade - targetGrade) - Math.abs(b.grade - targetGrade)
      );

      if (sorted.length >= 2) {
        sorted[0].ratio = 60;
        sorted[1].ratio = 40;
      } else if (sorted.length === 1) {
        sorted[0].ratio = 100;
      }

      setOreList(sorted);
      setLoading(false);
      message.success('智能优化完成！');
    }, 800);
  };

  const handleReset = () => {
    form.resetFields();
    setOreList(oreSources);
    setCalculationResult([]);
    setShowResult(false);
    message.info('已重置');
  };

  const handleSave = () => {
    if (calculationResult.length === 0) {
      message.warning('请先进行配矿计算');
      return;
    }

    message.success('配矿方案已保存');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#262626' }}>
          智能配矿计算
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8c8c8c' }}>
          基于品位优化的智能配矿方案生成与计算
        </p>
      </div>

      <Row gutter={16}>
        {/* 左侧：配矿参数设置 */}
        <Col span={24}>
          <Card title="配矿参数设置" style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline">
              <Form.Item name="totalQuantity" label="总配矿量(吨)" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入总配矿量" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="targetGrade" label="目标品位(%)" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入目标品位" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="oreType" label="矿石类型">
                <Select placeholder="请选择" style={{ width: 150 }}>
                  <Option value="iron">铁矿石</Option>
                  <Option value="copper">铜矿石</Option>
                  <Option value="manganese">锰矿石</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ThunderboltOutlined />} 
                    onClick={handleAutoOptimize}
                    loading={loading}
                  >
                    智能优化
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 矿石来源配比 */}
        <Col span={24}>
          <Card 
            title="矿石来源与配比" 
            extra={
              <Space>
                <span>
                  配比总和: <strong>{oreList.reduce((sum, ore) => sum + ore.ratio, 0).toFixed(1)}%</strong>
                </span>
                <Button 
                  type="primary" 
                  icon={<CalculatorOutlined />}
                  onClick={handleCalculate}
                  loading={loading}
                >
                  开始计算
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={oreSourceColumns}
              dataSource={oreList}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* 计算结果 */}
        {showResult && (
          <Col span={24}>
            <Card 
              title="配矿计算结果" 
              extra={
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  保存方案
                </Button>
              }
            >
              <Table
                columns={resultColumns}
                dataSource={calculationResult}
                pagination={false}
                size="middle"
                summary={(data) => {
                  const totalQuantity = data.reduce((sum, r) => sum + r.quantity, 0);
                  const actualGrade = data.reduce((sum, r) => sum + r.grade, 0);
                  
                  return (
                    <Table.Summary>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <strong>100%</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <strong>{totalQuantity.toLocaleString()} 吨</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <strong style={{ color: '#1890ff' }}>{actualGrade.toFixed(2)}%</strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  );
                }}
              />

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>实际品位</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>
                        {calculationResult.reduce((sum, r) => sum + r.grade, 0).toFixed(2)}%
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>总配矿量</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>
                        {calculationResult.reduce((sum, r) => sum + r.quantity, 0).toLocaleString()} 吨
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>矿源数量</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#722ed1' }}>
                        {calculationResult.length} 个
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default IntelligentBlending;
