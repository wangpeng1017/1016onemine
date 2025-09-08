import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  Row,
  Col,
  Divider,
  message,
  Select,
  TimePicker,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface SystemConfigData {
  // 系统基础配置
  systemName: string;
  systemVersion: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  
  // 监测配置
  dataCollectionInterval: number;
  alarmCheckInterval: number;
  dataRetentionDays: number;
  autoBackup: boolean;
  backupTime: dayjs.Dayjs;
  
  // 告警配置
  enableEmailAlert: boolean;
  enableSmsAlert: boolean;
  alertLevel: 'low' | 'medium' | 'high';
  maxAlertCount: number;
  
  // 性能配置
  maxConcurrentUsers: number;
  sessionTimeout: number;
  enableCache: boolean;
  cacheExpireTime: number;
  
  // 安全配置
  passwordMinLength: number;
  passwordComplexity: boolean;
  loginAttemptLimit: number;
  accountLockTime: number;
}

const SystemConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 默认配置数据
  const defaultConfig: SystemConfigData = {
    systemName: '矿山安全监测系统',
    systemVersion: 'v2.1.0',
    companyName: '矿山安全科技有限公司',
    contactEmail: 'support@mining-safety.com',
    contactPhone: '400-123-4567',
    
    dataCollectionInterval: 60,
    alarmCheckInterval: 30,
    dataRetentionDays: 365,
    autoBackup: true,
    backupTime: dayjs('02:00', 'HH:mm'),
    
    enableEmailAlert: true,
    enableSmsAlert: false,
    alertLevel: 'medium',
    maxAlertCount: 100,
    
    maxConcurrentUsers: 50,
    sessionTimeout: 30,
    enableCache: true,
    cacheExpireTime: 3600,
    
    passwordMinLength: 8,
    passwordComplexity: true,
    loginAttemptLimit: 5,
    accountLockTime: 30,
  };

  React.useEffect(() => {
    // 加载配置数据
    form.setFieldsValue(defaultConfig);
  }, [form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟保存配置
      setTimeout(() => {
        console.log('保存的配置:', values);
        message.success('系统配置保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('配置保存失败:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultConfig);
    message.info('配置已重置为默认值');
  };

  return (
    <div>
      <div className="page-title">系统配置</div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        {/* 系统基础配置 */}
        <Card title="系统基础配置" className="custom-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="systemName"
                label="系统名称"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input placeholder="请输入系统名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="systemVersion"
                label="系统版本"
                rules={[{ required: true, message: '请输入系统版本' }]}
              >
                <Input placeholder="请输入系统版本" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
                rules={[
                  { required: true, message: '请输入联系邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" style={{ width: '50%' }} />
          </Form.Item>
        </Card>

        {/* 监测配置 */}
        <Card title="监测配置" className="custom-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="dataCollectionInterval"
                label="数据采集间隔 (秒)"
                rules={[{ required: true, message: '请输入数据采集间隔' }]}
              >
                <InputNumber
                  min={10}
                  max={3600}
                  placeholder="60"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="alarmCheckInterval"
                label="告警检查间隔 (秒)"
                rules={[{ required: true, message: '请输入告警检查间隔' }]}
              >
                <InputNumber
                  min={5}
                  max={300}
                  placeholder="30"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dataRetentionDays"
                label="数据保留天数"
                rules={[{ required: true, message: '请输入数据保留天数' }]}
              >
                <InputNumber
                  min={30}
                  max={3650}
                  placeholder="365"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="autoBackup"
                label="自动备份"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="backupTime"
                label="备份时间"
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="选择备份时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 告警配置 */}
        <Card title="告警配置" className="custom-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="enableEmailAlert"
                label="邮件告警"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="enableSmsAlert"
                label="短信告警"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="alertLevel"
                label="告警级别"
                rules={[{ required: true, message: '请选择告警级别' }]}
              >
                <Select placeholder="请选择告警级别">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="maxAlertCount"
                label="最大告警数量"
                rules={[{ required: true, message: '请输入最大告警数量' }]}
              >
                <InputNumber
                  min={10}
                  max={1000}
                  placeholder="100"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 性能配置 */}
        <Card title="性能配置" className="custom-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="maxConcurrentUsers"
                label="最大并发用户数"
                rules={[{ required: true, message: '请输入最大并发用户数' }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  placeholder="50"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="sessionTimeout"
                label="会话超时 (分钟)"
                rules={[{ required: true, message: '请输入会话超时时间' }]}
              >
                <InputNumber
                  min={5}
                  max={480}
                  placeholder="30"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="enableCache"
                label="启用缓存"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="cacheExpireTime"
                label="缓存过期时间 (秒)"
                rules={[{ required: true, message: '请输入缓存过期时间' }]}
              >
                <InputNumber
                  min={60}
                  max={86400}
                  placeholder="3600"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 安全配置 */}
        <Card title="安全配置" className="custom-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="passwordMinLength"
                label="密码最小长度"
                rules={[{ required: true, message: '请输入密码最小长度' }]}
              >
                <InputNumber
                  min={6}
                  max={20}
                  placeholder="8"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="passwordComplexity"
                label="密码复杂度要求"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="loginAttemptLimit"
                label="登录尝试次数限制"
                rules={[{ required: true, message: '请输入登录尝试次数限制' }]}
              >
                <InputNumber
                  min={3}
                  max={10}
                  placeholder="5"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="accountLockTime"
                label="账户锁定时间 (分钟)"
                rules={[{ required: true, message: '请输入账户锁定时间' }]}
              >
                <InputNumber
                  min={5}
                  max={1440}
                  placeholder="30"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <Card className="custom-card">
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSave}
            >
              保存配置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置为默认
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default SystemConfig;
