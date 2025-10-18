import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { DashboardOutlined, EnvironmentOutlined, SettingOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import EnvironmentMap, { SensorData, ParameterType } from './components/EnvironmentMap';
import ParameterDashboard from './components/ParameterDashboard';

const { Option } = Select;

const EnvironmentalMonitoring: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [sensorModalVisible, setSensorModalVisible] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorData | null>(null);
  const [sensorForm] = Form.useForm();

  // 根据路由确定当前Tab
  const getActiveTab = () => {
    if (location.pathname.includes('/env-monitoring/env-monitoring')) return 'map';
    if (location.pathname.includes('/env-monitoring/env-sensors')) return 'sensors';
    return 'dashboard';
  };

  const handleTabChange = (key: string) => {
    const tabRoutes: Record<string, string> = {
      dashboard: '/env-monitoring/env-home',
      map: '/env-monitoring/env-monitoring',
      sensors: '/env-monitoring/env-sensors'
    };
    navigate(tabRoutes[key]);
  };

  // 模拟传感器数据
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: 'TEMP-001',
      name: '温度传感器1',
      type: 'temperature',
      location: [87.6150, 43.7950],
      value: 25.5,
      unit: '°C',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'TEMP-002',
      name: '温度传感器2',
      type: 'temperature',
      location: [87.6180, 43.7920],
      value: 38.2,
      unit: '°C',
      status: 'warning',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'HUM-001',
      name: '湿度传感器1',
      type: 'humidity',
      location: [87.6200, 43.7980],
      value: 65.0,
      unit: '%',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'DUST-001',
      name: '粉尘传感器1',
      type: 'dust',
      location: [87.6120, 43.7900],
      value: 45.8,
      unit: 'mg/m³',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'CH4-001',
      name: '甲烷传感器1',
      type: 'ch4',
      location: [87.6220, 43.7960],
      value: 0.8,
      unit: '%',
      status: 'alarm',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'CO-001',
      name: '一氧化碳传感器1',
      type: 'co',
      location: [87.6160, 43.7930],
      value: 12.5,
      unit: 'ppm',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'H2S-001',
      name: '硫化氢传感器1',
      type: 'h2s',
      location: [87.6190, 43.7970],
      value: 3.2,
      unit: 'ppm',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'O2-001',
      name: '氧气传感器1',
      type: 'o2',
      location: [87.6140, 43.7880],
      value: 20.9,
      unit: '%',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'TEMP-003',
      name: '温度传感器3',
      type: 'temperature',
      location: [87.6230, 43.7940],
      value: 28.8,
      unit: '°C',
      status: 'normal',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'DUST-002',
      name: '粉尘传感器2',
      type: 'dust',
      location: [87.6155, 43.7985],
      value: 75.3,
      unit: 'mg/m³',
      status: 'warning',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  ]);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        const delta = (Math.random() - 0.5) * 2;
        const newValue = Math.max(0, sensor.value + delta);
        
        let newStatus: 'normal' | 'warning' | 'alarm' = 'normal';
        if (sensor.type === 'temperature' && newValue > 35) newStatus = 'warning';
        if (sensor.type === 'temperature' && newValue > 38) newStatus = 'alarm';
        if (sensor.type === 'ch4' && newValue > 0.5) newStatus = 'warning';
        if (sensor.type === 'ch4' && newValue > 0.75) newStatus = 'alarm';
        if (sensor.type === 'dust' && newValue > 70) newStatus = 'warning';
        if (sensor.type === 'dust' && newValue > 90) newStatus = 'alarm';

        return {
          ...sensor,
          value: parseFloat(newValue.toFixed(2)),
          status: newStatus,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAddSensor = () => {
    setEditingSensor(null);
    sensorForm.resetFields();
    setSensorModalVisible(true);
  };

  const handleEditSensor = (sensor: SensorData) => {
    setEditingSensor(sensor);
    sensorForm.setFieldsValue({
      name: sensor.name,
      type: sensor.type
    });
    setSensorModalVisible(true);
  };

  const handleSensorSubmit = () => {
    sensorForm.validateFields().then(values => {
      if (editingSensor) {
        setSensors(prev => prev.map(s =>
          s.id === editingSensor.id
            ? { ...s, name: values.name, type: values.type }
            : s
        ));
        message.success('传感器更新成功');
      } else {
        const newSensor: SensorData = {
          id: `${values.type.toUpperCase()}-${String(sensors.length + 1).padStart(3, '0')}`,
          name: values.name,
          type: values.type,
          location: [87.615 + Math.random() * 0.01, 43.79 + Math.random() * 0.01],
          value: 0,
          unit: getUnit(values.type),
          status: 'normal',
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        setSensors(prev => [...prev, newSensor]);
        message.success('传感器添加成功');
      }
      setSensorModalVisible(false);
      sensorForm.resetFields();
    });
  };

  const getUnit = (type: ParameterType) => {
    const unitMap: Record<ParameterType, string> = {
      temperature: '°C',
      humidity: '%',
      dust: 'mg/m³',
      ch4: '%',
      co: 'ppm',
      h2s: 'ppm',
      o2: '%'
    };
    return unitMap[type];
  };

  const getParameterName = (type: ParameterType) => {
    const nameMap: Record<ParameterType, string> = {
      temperature: '温度',
      humidity: '湿度',
      dust: '粉尘',
      ch4: '甲烷(CH4)',
      co: '一氧化碳(CO)',
      h2s: '硫化氢(H2S)',
      o2: '氧气(O2)'
    };
    return nameMap[type];
  };

  const sensorColumns = [
    {
      title: '传感器ID',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: ParameterType) => getParameterName(type)
    },
    {
      title: '当前值',
      key: 'value',
      width: 120,
      render: (_: any, record: SensorData) => `${record.value} ${record.unit}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = {
          normal: { color: 'success', text: '正常' },
          warning: { color: 'warning', text: '预警' },
          alarm: { color: 'error', text: '报警' }
        };
        const item = config[status as keyof typeof config];
        return <Tag color={item.color}>{item.text}</Tag>;
      }
    },
    {
      title: '位置',
      key: 'location',
      width: 150,
      render: (_: any, record: SensorData) => 
        `${record.location[0].toFixed(4)}, ${record.location[1].toFixed(4)}`
    },
    {
      title: '更新时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: SensorData) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditSensor(record)}
        >
          编辑
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Tabs
        activeKey={getActiveTab()}
        onChange={handleTabChange}
        items={[
          {
            key: 'dashboard',
            label: (
              <span>
                <DashboardOutlined /> 实时监控
              </span>
            ),
            children: (
              <div>
                <ParameterDashboard sensors={sensors} />
              </div>
            )
          },
          {
            key: 'map',
            label: (
              <span>
                <EnvironmentOutlined /> 监测地图
              </span>
            ),
            children: (
              <Card>
                <EnvironmentMap
                  sensors={sensors}
                  onSensorClick={setSelectedSensor}
                />
              </Card>
            )
          },
          {
            key: 'sensors',
            label: (
              <span>
                <SettingOutlined /> 传感器管理
              </span>
            ),
            children: (
              <Card
                title="传感器列表"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddSensor}
                  >
                    添加传感器
                  </Button>
                }
              >
                <Table
                  columns={sensorColumns}
                  dataSource={sensors}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </Card>
            )
          }
        ]}
      />

      {/* 传感器配置模态框 */}
      <Modal
        title={editingSensor ? '编辑传感器' : '添加传感器'}
        open={sensorModalVisible}
        onOk={handleSensorSubmit}
        onCancel={() => setSensorModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={sensorForm} layout="vertical">
          <Form.Item name="name" label="传感器名称" rules={[{ required: true, message: '请输入传感器名称' }]}>
            <Input placeholder="例如：温度传感器1" />
          </Form.Item>
          <Form.Item name="type" label="参数类型" rules={[{ required: true, message: '请选择参数类型' }]}>
            <Select placeholder="请选择">
              <Option value="temperature">温度</Option>
              <Option value="humidity">湿度</Option>
              <Option value="dust">粉尘</Option>
              <Option value="ch4">甲烷(CH4)</Option>
              <Option value="co">一氧化碳(CO)</Option>
              <Option value="h2s">硫化氢(H2S)</Option>
              <Option value="o2">氧气(O2)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnvironmentalMonitoring;
