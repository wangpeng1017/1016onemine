import React from 'react';
import { Card, Form, Select, Input, Tag, Button, Row, Col, Divider, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AlarmSettings: React.FC = () => {
  const [form] = Form.useForm();

  const onSave = async () => {
    const values = await form.validateFields();
    console.log('保存告警设置:', values);
    message.success('告警设置已保存');
  };

  return (
    <Card className="custom-card" title="告警设置">
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="notifyType" label="告警方式" rules={[{ required: true }]} initialValue="短信通知和短信息通知">
              <Input placeholder="短信通知/邮件通知/短信+电话等" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="template" label="告警模板">
              <TextArea rows={2} placeholder="输入消息模板，支持变量替换" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>分级配置</Divider>

        {[
          { key: 'blue', label: '蓝色告警', color: 'blue' },
          { key: 'yellow', label: '黄色告警', color: 'gold' },
          { key: 'orange', label: '橙色告警', color: 'orange' },
          { key: 'red', label: '红色告警', color: 'red' },
        ].map(level => (
          <Card key={level.key} size="small" style={{ marginBottom: 16 }} title={<span>告警级别·<Tag color={level.color}>{level.label}</Tag></span>}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={[level.key, 'handlers']} label="告警人员">
                  <Select mode="multiple" placeholder="选择人员">
                    <Select.Option value="张晓凯">张晓凯</Select.Option>
                    <Select.Option value="李工程师">李工程师</Select.Option>
                    <Select.Option value="王安全">王安全</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name={[level.key, 'devices']} label="应用设备">
                  <Select mode="multiple" placeholder="选择应用的设备">
                    {['GP-37','GP-23','GP-80','GP-95','GP-90','GP-14','GP-4'].map(d => (
                      <Select.Option key={d} value={d}>{d}(表面位移监测)</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        ))}

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>保存</Button>
      </Form>
    </Card>
  );
};

export default AlarmSettings;
