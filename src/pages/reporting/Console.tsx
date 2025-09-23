import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  message,
  Select,
  DatePicker,
  Modal,
  Form,
  Input,
  InputNumber,
} from 'antd';
import {
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ConsoleData {
  id: string;
  taskName: string;
  serverPath: string;
  pushFrequency: string;
  nextPushTime: string;
  remainingDays: string;
  latestPushTime: string;
  latestPushStatus: 'success' | 'failed' | 'uploading';
  taskDescription: string;
}

const Console: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConsoleData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploadType, setUploadType] = useState<string | undefined>(undefined);

  // 模拟控制台数据
  const mockData: ConsoleData[] = [
    {
      id: '1',
      taskName: '矿山基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '矿山基础信息包括露天矿山名称、露天矿山编号、露天矿山类型、露天矿山地址、矿区范围、监管主体编号等。',
    },
    {
      id: '2',
      taskName: '边坡基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '边坡基础信息包括露天矿山编号、边坡名称、边坡编号、边坡范围、边坡地质信息、边坡设计参数和现状参数等组成。',
    },
    {
      id: '3',
      taskName: '台阶基础信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/月',
      nextPushTime: '2025-10-07',
      remainingDays: '剩余26天',
      latestPushTime: '2025-09-07',
      latestPushStatus: 'success',
      taskDescription: '采场台阶基础信息包括露天矿山编号、边坡名称、采场边坡编号、台阶名称、台阶编号、台阶范围、各台阶设计参数等组成。',
    },
    {
      id: '4',
      taskName: '边坡卫星形变风险信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '边坡卫星形变信息包括边坡编号、地质信息、风险级别、风险范围、风险参数等。',
    },
    {
      id: '5',
      taskName: '越界开采风险',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '超层越界风险包括越界开采风险和超层开采风险。',
    },
    {
      id: '6',
      taskName: '超层开采风险信息',
      serverPath: 'ftp://172.41.90.16\n路径: /home/yingjiting/652222053708',
      pushFrequency: '频率/半年',
      nextPushTime: '2026-01-04',
      remainingDays: '剩余115天',
      latestPushTime: '2025-07-04',
      latestPushStatus: 'success',
      taskDescription: '超层越界风险包括越界开采风险和超层开采风险。',
    },
  ];

  const columns: ColumnsType<ConsoleData> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 150,
    },
    {
      title: '前置服务器',
      dataIndex: 'serverPath',
      key: 'serverPath',
      width: 200,
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-line', fontSize: '12px' }}>
          {text}
        </div>
      ),
    },
    {
      title: '推送频率',
      dataIndex: 'pushFrequency',
      key: 'pushFrequency',
      width: 100,
    },
    {
      title: '下次推送时间',
      dataIndex: 'nextPushTime',
      key: 'nextPushTime',
      width: 120,
    },
    {
      title: '距离下次剩余天数',
      dataIndex: 'remainingDays',
      key: 'remainingDays',
      width: 130,
      render: (text: string) => (
        <span style={{ color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: '最新推送时间',
      dataIndex: 'latestPushTime',
      key: 'latestPushTime',
      width: 120,
    },
    {
      title: '最新推送状态',
      dataIndex: 'latestPushStatus',
      key: 'latestPushStatus',
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功' },
          failed: { color: 'red', text: '失败' },
          uploading: { color: 'blue', text: '推送中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '任务简介',
      dataIndex: 'taskDescription',
      key: 'taskDescription',
      width: 300,
      render: (text: string) => (
        <div style={{ 
          maxWidth: '280px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '12px'
        }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            历史查询
          </Button>
        </Space>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
    // 模拟实时更新
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartUpload = () => {
    message.success('开始数据推送');
  };

  const handleStopUpload = () => {
    message.warning('暂停数据推送');
  };

  const handleSettings = () => {
    message.info('推送设置功能开发中...');
  };

  const handleCreateTask = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('新建任务数据:', values);
      message.success('任务创建成功！');
      setCreateModalVisible(false);
      form.resetFields();
      loadData(); // 刷新数据
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    form.resetFields();
  };

  const filteredData = data.filter(item => {
    if (selectedType !== 'all' && item.pushFrequency !== selectedType) {
      return false;
    }
    return true;
  });

  const statistics = {
    total: filteredData.length,
    success: filteredData.filter(item => item.latestPushStatus === 'success').length,
    failed: filteredData.filter(item => item.latestPushStatus === 'failed').length,
    uploading: filteredData.filter(item => item.latestPushStatus === 'uploading').length,
    monthly: filteredData.filter(item => item.pushFrequency === '频率/月').length,
  };

  return (
    <div>
      <div className="page-title">数据上报 - 控制台</div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="任务总数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="月度任务"
              value={statistics.monthly}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="推送成功"
              value={statistics.success}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="推送失败"
              value={statistics.failed}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        {/* 控制按钮和筛选 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择推送频率"
              value={selectedType}
              onChange={setSelectedType}
            >
              <Option value="all">全部频率</Option>
              <Option value="频率/月">频率/月</Option>
              <Option value="频率/半年">频率/半年</Option>
              <Option value="频率/年">频率/年</Option>
            </Select>
          </Col>
          <Col span={18}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateTask}
              >
                新建任务
              </Button>
              <Button
                icon={<PlayCircleOutlined />}
                onClick={handleStartUpload}
              >
                开始推送
              </Button>
              <Button
                icon={<PauseCircleOutlined />}
                onClick={handleStopUpload}
              >
                暂停推送
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={handleSettings}
              >
                推送设置
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新数据
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建推送任务"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={handleCreateCancel}
        width={800}
        okText="创建任务"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            frequency: '频率/月',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="taskName"
                  label="任务名称"
                  rules={[{ required: true, message: '请输入任务名称' }]}
                >
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="serverPath"
                  label="前置服务器"
                  rules={[{ required: true, message: '请输入前置服务器地址' }]}
                >
                  <Input placeholder="ftp://172.41.90.16" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="startTime"
                  label="开始时间"
                  rules={[{ required: true, message: '请选择开始时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择开始时间"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="endTime"
                  label="结束时间"
                  rules={[{ required: true, message: '请选择结束时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="选择结束时间"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="frequency"
                  label="频率"
                  rules={[{ required: true, message: '请选择推送频率' }]}
                >
                  <Select placeholder="选择推送频率">
                    <Option value="频率/月">频率/月</Option>
                    <Option value="频率/半年">频率/半年</Option>
                    <Option value="频率/年">频率/年</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="uploadType"
                  label="上传信息类型"
                  rules={[{ required: true, message: '请选择上传信息类型' }]}
                >
                  <Select
                    placeholder="请选择上传信息类型"
                    onChange={(val) => {
                      setUploadType(val);
                      // 重置监测字段区域
                      form.setFieldsValue({});
                    }}
                  >
                    <Option value="表面位移（GNSS）">表面位移（GNSS）</Option>
                    <Option value="裂缝计">裂缝计</Option>
                    <Option value="土压力">土压力</Option>
                    <Option value="地下水">地下水</Option>
                    <Option value="雷达告警">雷达告警</Option>
                    <Option value="边坡基础信息">边坡基础信息</Option>
                    <Option value="台阶基础信息">台阶基础信息</Option>
                    <Option value="矿山基础信息">矿山基础信息</Option>
                    <Option value="矿山运营-GNSS预警阈值">矿山运营-GNSS预警阈值</Option>
                    <Option value="边坡形态超限信息">边坡形态超限信息</Option>
                    <Option value="图层信息">图层信息</Option>
                    <Option value="矿山运营-边坡雷达预警阈值">矿山运营-边坡雷达预警阈值</Option>
                    <Option value="超层开采风险">超层开采风险</Option>
                    <Option value="越界开采风险">越界开采风险</Option>
                    <Option value="边坡卫星形变风险">边坡卫星形变风险</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 监测字段配置（根据上传信息类型自动带出） */}
          <Card title="监测字段配置" size="small">
            {(() => {
              const NumberItem = (name: string, label: string, unit?: string, required: boolean = true) => (
                <Col span={8} key={name}>
                  <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `请输入${label}` }] : []}> 
                    <InputNumber style={{ width: '100%' }} precision={2} placeholder="0" addonAfter={unit} />
                  </Form.Item>
                </Col>
              );
              const TextItem = (name: string, label: string, required: boolean = true) => (
                <Col span={8} key={name}>
                  <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `请输入${label}` }] : []}> 
                    <Input />
                  </Form.Item>
                </Col>
              );
              const TimeItem = (name: string, label: string, required: boolean = true) => (
                <Col span={8} key={name}>
                  <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `请选择${label}` }] : []}> 
                    <DatePicker style={{ width: '100%' }} showTime />
                  </Form.Item>
                </Col>
              );
              const TextAreaItem = (name: string, label: string, required: boolean = true) => (
                <Col span={24} key={name}>
                  <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `请输入${label}` }] : []}> 
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
              );

              const templates: Record<string, React.ReactNode[]> = {
                '表面位移（GNSS）': [
                  TextItem('点名', '测点名称'),
                  TimeItem('接收时间', '接收时间'),
                  NumberItem('累计位移量X', '累计位移量X', 'mm'),
                  NumberItem('累计位移量Y', '累计位移量Y', 'mm'),
                  NumberItem('累计位移量Z', '累计位移量Z', 'mm'),
                  NumberItem('小时位移量X', '小时位移量X', 'mm'),
                  NumberItem('小时位移量Y', '小时位移量Y', 'mm'),
                  NumberItem('小时位移量Z', '小时位移量Z', 'mm'),
                  NumberItem('小时位移加速度X', '小时位移加速度X', 'mm/h²'),
                  NumberItem('小时位移加速度Y', '小时位移加速度Y', 'mm/h²'),
                  NumberItem('小时位移加速度Z', '小时位移加速度Z', 'mm/h²'),
                ],
                '裂缝计': [
                  TextItem('测点名称', '测点名称'),
                  TimeItem('接收时间', '接收时间'),
                  NumberItem('裂缝值', '裂缝值', 'mm'),
                ],
                '土压力': [
                  TextItem('测点名称', '测点名称'),
                  TimeItem('接收时间', '接收时间'),
                  NumberItem('土压力', '土压力', 'kPa'),
                ],
                '地下水': [
                  TextItem('测点名称', '测点名称'),
                  TimeItem('接收时间', '接收时间'),
                  NumberItem('水面高程', '水面高程', 'm'),
                  NumberItem('温度', '温度', '℃'),
                  NumberItem('埋深', '埋深', 'm'),
                  NumberItem('速率', '速率', 'm/s'),
                ],
                '雷达告警': [
                  TextItem('点名', '点名'),
                  TimeItem('告警时间', '告警时间'),
                  NumberItem('高达警戒面积', '高达警戒面积', '㎡'),
                  NumberItem('离自由形变', '离自由形变', 'm'),
                  TextItem('经度', '经度(°)'),
                  TextItem('纬度', '纬度(°)'),
                  TextItem('高程', '高程'),
                ],
'边坡基础信息': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('slope_no', '边坡编号'),
                  TextItem('slope_name', '边坡名称'),
                  TextAreaItem('slope_boundary', '边坡范围坐标'),
                  NumberItem('rock_type', '岩性类型'),
                  NumberItem('design_plate_width', '设计平台宽度', 'm'),
                  NumberItem('design_slope_height', '设计坡高', 'm'),
                  NumberItem('design_slope_angle', '设计坡角', '°'),
                  NumberItem('current_slope_height', '现状坡高', 'm'),
                  NumberItem('current_slope_angel', '现状坡角', '°'),
                  TextItem('analysis_conclusion', '稳定性结论'),
                ],
                '台阶基础信息': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('slope_no', '边坡编号'),
                  TextItem('step_no', '台阶编号'),
                  TextItem('step_name', '台阶名称'),
                  TextAreaItem('step_boundary', '台阶范围坐标'),
                  NumberItem('design_plate_width', '设计平台宽度', 'm'),
                  NumberItem('design_step_height', '设计台阶高', 'm'),
                  NumberItem('design_step_angle', '设计台阶角', '°'),
                ],
                '矿山基础信息': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('open_pit_name', '露天矿山名称'),
                  NumberItem('classification', '矿山分类'),
                  TextItem('address', '地址'),
                  TextAreaItem('open_pit_boundary', '矿区范围坐标'),
                  TextItem('supervising_subject', '监管主体编号'),
                  TextItem('enterprise_legalperson', '企业法人'),
                  TextItem('legal_person_phone', '法人电话'),
                  TextItem('control_center_landline_phone', '控制中心座机'),
                  NumberItem('enterprise_state', '企业状态'),
                  TextItem('filler', '填报人'),
                  TextItem('filler_phone', '填报人电话'),
                ],
                '矿山运营-GNSS预警阈值': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('equip_no', '设备编号'),
                  NumberItem('alarm_level', '告警级别'),
                  NumberItem('horizontal_displacement', '水平位移阈值', 'mm'),
                  NumberItem('settlement_displacement', '沉降位移阈值', 'mm'),
                  NumberItem('horizontal_velocity', '水平速度阈值', 'mm/h'),
                  NumberItem('sedimentation_velocity', '沉降速度阈值', 'mm/h'),
                  NumberItem('horizontal_acceleration', '水平加速度阈值', 'mm/h²'),
                  NumberItem('sedimentation_acceleration', '沉降加速度阈值', 'mm/h²'),
                  NumberItem('duration', '持续时间(小时)', 'h'),
                ],
                '边坡形态超限信息': [
                  TextItem('slope_no', '边坡编号'),
                  TextItem('step_no', '台阶编号'),
                  NumberItem('risk_type', '风险类型'),
                  NumberItem('risk_level', '风险等级'),
                  TextAreaItem('risk_range', '风险范围', false),
                  NumberItem('red_th', '红阈值'),
                  NumberItem('orange_th', '橙阈值'),
                  NumberItem('yellow_th', '黄阈值'),
                  NumberItem('blue_th', '蓝阈值'),
                  TextAreaItem('risk_values', '风险取值', false),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                ],
                '图层信息': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TextItem('layer_no', '图层编号'),
                  TextItem('layer_name', '图层名称'),
                  TextItem('layer_type', '图层类型'),
                  TextItem('file_type', '文件类型'),
                  TextAreaItem('files', '文件列表(一行一个)'),
                  TextItem('uuid', '数据UUID'),
                ],
                '矿山运营-边坡雷达预警阈值': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('radar_no', '雷达编号'),
                  NumberItem('alarm_level', '告警级别'),
                  NumberItem('deformation', '形变量', undefined, false),
                  NumberItem('velocity', '速度阈值'),
                  NumberItem('acceleration', '加速度阈值', undefined, false),
                  NumberItem('tangent_angle', '切线角', '°', false),
                  NumberItem('area', '面积阈值', '㎡'),
                  NumberItem('duration', '持续时间(小时)', 'h', false),
                ],
                '超层开采风险': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  NumberItem('elevation', '标高'),
                  NumberItem('over_layer_area', '超层面积'),
                  TextAreaItem('over_layer_points', '超层点集', false),
                ],
                '越界开采风险': [
                  TextItem('open_pit_no', '露天矿山编号'),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                  TextItem('overborder_bry', '越界标识'),
                  NumberItem('croborder_acr', '越界面积'),
                ],
                '边坡卫星形变风险': [
                  TextItem('slope_no', '边坡编号'),
                  NumberItem('rock_type', '岩性类型'),
                  NumberItem('risk_level', '风险等级'),
                  TextItem('risk_boundary', '风险范围'),
                  NumberItem('red_th', '红阈值'),
                  NumberItem('orange_th', '橙阈值'),
                  NumberItem('yellow_th', '黄阈值'),
                  NumberItem('blue_th', '蓝阈值'),
                  TextAreaItem('risk_values', '风险取值', false),
                  TimeItem('create_time', '创建时间'),
                  TimeItem('update_time', '更新时间'),
                ],
              };

              const content = uploadType ? templates[uploadType] : undefined;
              if (!content) {
                return (
                  <div style={{ color: '#999' }}>
                    请选择“上传信息类型”，系统将自动带出对应的上传字段（示例依据提供的样例表头预设，可按需再调整）。
                  </div>
                );
              }
              return <Row gutter={16}>{content}</Row>;
            })()}
          </Card>
        </Form>
      </Modal>
    </div>
  );
};

export default Console;
