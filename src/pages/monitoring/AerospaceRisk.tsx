import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Select, 
  DatePicker, 
  Input, 
  Row, 
  Col, 
  Statistic, 
  Modal,
  Alert,
  Tabs,
  Progress,
  Timeline,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  EyeOutlined,
  WarningOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  RadarChartOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import * as echarts from 'echarts';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface AerospaceRiskData {
  id: string;
  riskType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: [number, number];
  description: string;
  detectionTime: string;
  status: 'active' | 'resolved' | 'monitoring';
  confidence: number;
  impactRadius: number;
  source: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  cloudCover: number;
  precipitation: number;
}

const AerospaceRisk: React.FC = () => {
  const [data, setData] = useState<AerospaceRiskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [chartVisible, setChartVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockData: AerospaceRiskData[] = [
      {
        id: 'AR-001',
        riskType: '低空飞行器',
        riskLevel: 'high',
        location: '矿区东北空域',
        coordinates: [116.4074, 39.9042],
        description: '检测到无人机在限制空域内飞行',
        detectionTime: '2024-01-15 14:25:30',
        status: 'active',
        confidence: 95,
        impactRadius: 500,
        source: '雷达监测'
      },
      {
        id: 'AR-002',
        riskType: '气象风险',
        riskLevel: 'medium',
        location: '矿区上空',
        coordinates: [116.4074, 39.9042],
        description: '强对流天气预警，可能影响作业安全',
        detectionTime: '2024-01-15 13:45:15',
        status: 'monitoring',
        confidence: 88,
        impactRadius: 2000,
        source: '气象监测'
      },
      {
        id: 'AR-003',
        riskType: '空域入侵',
        riskLevel: 'critical',
        location: '矿区西南空域',
        coordinates: [116.4074, 39.9042],
        description: '未授权航空器进入管制空域',
        detectionTime: '2024-01-15 12:30:45',
        status: 'resolved',
        confidence: 92,
        impactRadius: 1000,
        source: '空管雷达'
      },
      {
        id: 'AR-004',
        riskType: '电磁干扰',
        riskLevel: 'low',
        location: '通信基站附近',
        coordinates: [116.4074, 39.9042],
        description: '检测到异常电磁信号，可能影响通信',
        detectionTime: '2024-01-15 11:15:20',
        status: 'monitoring',
        confidence: 76,
        impactRadius: 300,
        source: '频谱监测'
      },
      {
        id: 'AR-005',
        riskType: '卫星信号异常',
        riskLevel: 'medium',
        location: 'GNSS基准站',
        coordinates: [116.4074, 39.9042],
        description: 'GPS信号质量下降，定位精度受影响',
        detectionTime: '2024-01-15 10:20:10',
        status: 'active',
        confidence: 84,
        impactRadius: 1500,
        source: 'GNSS监测'
      }
    ];

    const mockWeather: WeatherData = {
      temperature: 18.5,
      humidity: 65,
      windSpeed: 12.3,
      windDirection: '东北风',
      visibility: 8.5,
      cloudCover: 40,
      precipitation: 0
    };

    setData(mockData);
    setWeatherData(mockWeather);
  }, []);

  const columns: ColumnsType<AerospaceRiskData> = [
    {
      title: '风险ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '风险类型',
      dataIndex: 'riskType',
      key: 'riskType',
      width: 120,
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level: string) => {
        const colors = {
          low: 'green',
          medium: 'orange',
          high: 'red',
          critical: 'purple'
        };
        const texts = {
          low: '低风险',
          medium: '中风险',
          high: '高风险',
          critical: '极高风险'
        };
        return <Tag color={colors[level as keyof typeof colors]}>{texts[level as keyof typeof texts]}</Tag>;
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '检测时间',
      dataIndex: 'detectionTime',
      key: 'detectionTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors = {
          active: 'red',
          resolved: 'green',
          monitoring: 'orange'
        };
        const texts = {
          active: '活跃',
          resolved: '已解决',
          monitoring: '监控中'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{texts[status as keyof typeof texts]}</Tag>;
      }
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 100,
      render: (confidence: number) => (
        <Progress 
          percent={confidence} 
          size="small" 
          strokeColor={confidence > 90 ? '#52c41a' : confidence > 70 ? '#faad14' : '#ff4d4f'}
        />
      )
    },
    {
      title: '影响半径(m)',
      dataIndex: 'impactRadius',
      key: 'impactRadius',
      width: 120,
      render: (radius: number) => radius.toLocaleString()
    },
    {
      title: '数据源',
      dataIndex: 'source',
      key: 'source',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<RadarChartOutlined />}
            onClick={() => handleViewChart()}
          >
            图表
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (record: AerospaceRiskData) => {
    Modal.info({
      title: `风险详情 - ${record.id}`,
      width: 600,
      content: (
        <div>
          <p><strong>风险类型：</strong>{record.riskType}</p>
          <p><strong>风险等级：</strong>{record.riskLevel}</p>
          <p><strong>位置：</strong>{record.location}</p>
          <p><strong>坐标：</strong>{record.coordinates.join(', ')}</p>
          <p><strong>描述：</strong>{record.description}</p>
          <p><strong>检测时间：</strong>{record.detectionTime}</p>
          <p><strong>状态：</strong>{record.status}</p>
          <p><strong>置信度：</strong>{record.confidence}%</p>
          <p><strong>影响半径：</strong>{record.impactRadius}米</p>
          <p><strong>数据源：</strong>{record.source}</p>
        </div>
      )
    });
  };

  const handleViewChart = () => {
    setChartVisible(true);
  };

  const generateTimeSeriesData = () => {
    const now = new Date();
    const data = [];
    const categories = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      categories.push(time.getHours().toString().padStart(2, '0') + ':00');
      data.push(Math.floor(Math.random() * 10) + 1);
    }
    
    return { categories, data };
  };

  const renderChart = () => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
      if (chartRef.current) {
        const chart = echarts.init(chartRef.current);
        const { categories, data } = generateTimeSeriesData();
        
        const option = {
          title: {
            text: '24小时空天风险趋势',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c} 次风险事件'
          },
          xAxis: {
            type: 'category',
            data: categories,
            name: '时间'
          },
          yAxis: {
            type: 'value',
            name: '风险事件数量'
          },
          series: [{
            name: '风险事件',
            type: 'line',
            data: data,
            smooth: true,
            lineStyle: {
              color: '#ff4d4f'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(255, 77, 79, 0.3)'
                }, {
                  offset: 1, color: 'rgba(255, 77, 79, 0.1)'
                }]
              }
            }
          }],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
        };
        
        chart.setOption(option);
        
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          chart.dispose();
        };
      }
    }, []);
    
    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // 实现导出功能
    console.log('导出数据');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const getRiskStats = () => {
    const stats = {
      total: data.length,
      active: data.filter(item => item.status === 'active').length,
      critical: data.filter(item => item.riskLevel === 'critical').length,
      high: data.filter(item => item.riskLevel === 'high').length
    };
    return stats;
  };

  const stats = getRiskStats();

  return (
    <div>
      <div className="page-title">空天风险监测</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总风险数"
              value={stats.total}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃风险"
              value={stats.active}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="极高风险"
              value={stats.critical}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="高风险"
              value={stats.high}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        <Tabs defaultActiveKey="1">
          <TabPane tab="风险监测" key="1">
            {/* 搜索和操作栏 */}
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col xs={24} sm={8} md={6}>
                  <Input
                    placeholder="搜索风险ID或描述"
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Select placeholder="风险类型" style={{ width: '100%' }} allowClear>
                    <Option value="低空飞行器">低空飞行器</Option>
                    <Option value="气象风险">气象风险</Option>
                    <Option value="空域入侵">空域入侵</Option>
                    <Option value="电磁干扰">电磁干扰</Option>
                    <Option value="卫星信号异常">卫星信号异常</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Select placeholder="风险等级" style={{ width: '100%' }} allowClear>
                    <Option value="low">低风险</Option>
                    <Option value="medium">中风险</Option>
                    <Option value="high">高风险</Option>
                    <Option value="critical">极高风险</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={6}>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />}
                    >
                      搜索
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={handleRefresh}
                      loading={loading}
                    >
                      刷新
                    </Button>
                    <Button 
                      icon={<ExportOutlined />} 
                      onClick={handleExport}
                    >
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* 风险提醒 */}
            {stats.critical > 0 && (
              <Alert
                message="极高风险警告"
                description={`当前有 ${stats.critical} 个极高风险事件需要立即处理`}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 数据表格 */}
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1500 }}
              pagination={{
                total: data.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
            />
          </TabPane>

          <TabPane tab="气象监测" key="2">
            {weatherData && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Card title="实时气象数据" extra={<CloudOutlined />}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="温度"
                          value={weatherData.temperature}
                          suffix="°C"
                          precision={1}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="湿度"
                          value={weatherData.humidity}
                          suffix="%"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="风速"
                          value={weatherData.windSpeed}
                          suffix="m/s"
                          precision={1}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="能见度"
                          value={weatherData.visibility}
                          suffix="km"
                          precision={1}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="天气状况">
                    <Timeline>
                      <Timeline.Item color="green">
                        <p>当前天气：晴转多云</p>
                        <p>风向：{weatherData.windDirection}</p>
                      </Timeline.Item>
                      <Timeline.Item color="blue">
                        <p>云量：{weatherData.cloudCover}%</p>
                        <p>降水：{weatherData.precipitation}mm</p>
                      </Timeline.Item>
                      <Timeline.Item>
                        <p>适宜作业时间：08:00-18:00</p>
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            )}
          </TabPane>

          <TabPane tab="风险分析" key="3">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="风险趋势分析">
                  {renderChart()}
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 图表弹窗 */}
      <Modal
        title="空天风险趋势图表"
        open={chartVisible}
        onCancel={() => setChartVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {renderChart()}
      </Modal>
    </div>
  );
};

export default AerospaceRisk;
