import React from 'react';
import { Form, InputNumber, Switch, Button, Card, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { ThresholdConfig } from '../../types/environmental';

interface ThresholdFormProps {
  thresholds: ThresholdConfig[];
  onUpdate: (id: string, updates: Partial<ThresholdConfig>) => void;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({ thresholds, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSave = (threshold: ThresholdConfig) => {
    form.validateFields([`min_${threshold.id}`, `max_${threshold.id}`, `warning_${threshold.id}`, `alarm_${threshold.id}`])
      .then(values => {
        onUpdate(threshold.id, {
          minValue: values[`min_${threshold.id}`],
          maxValue: values[`max_${threshold.id}`],
          warningThreshold: values[`warning_${threshold.id}`],
          alarmThreshold: values[`alarm_${threshold.id}`]
        });
        message.success('阈值设置已保存');
      })
      .catch(() => {
        message.error('请检查输入值');
      });
  };

  const handleToggle = (threshold: ThresholdConfig, enabled: boolean) => {
    onUpdate(threshold.id, { enabled });
    message.success(enabled ? '已启用' : '已禁用');
  };

  return (
    <Form form={form} layout="vertical">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {thresholds.map(threshold => (
          <Card
            key={threshold.id}
            title={threshold.metric}
            size="small"
            extra={
              <Switch
                checked={threshold.enabled}
                onChange={checked => handleToggle(threshold, checked)}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {threshold.minValue !== undefined && (
                <Form.Item
                  name={`min_${threshold.id}`}
                  label="最小值"
                  initialValue={threshold.minValue}
                  rules={[{ required: true, message: '请输入最小值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="最小值"
                    disabled={!threshold.enabled}
                  />
                </Form.Item>
              )}

              {threshold.maxValue !== undefined && (
                <Form.Item
                  name={`max_${threshold.id}`}
                  label="最大值"
                  initialValue={threshold.maxValue}
                  rules={[{ required: true, message: '请输入最大值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="最大值"
                    disabled={!threshold.enabled}
                  />
                </Form.Item>
              )}

              {threshold.warningThreshold !== undefined && (
                <Form.Item
                  name={`warning_${threshold.id}`}
                  label="预警阈值"
                  initialValue={threshold.warningThreshold}
                  rules={[{ required: true, message: '请输入预警阈值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="预警阈值"
                    disabled={!threshold.enabled}
                  />
                </Form.Item>
              )}

              {threshold.alarmThreshold !== undefined && (
                <Form.Item
                  name={`alarm_${threshold.id}`}
                  label="报警阈值"
                  initialValue={threshold.alarmThreshold}
                  rules={[{ required: true, message: '请输入报警阈值' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="报警阈值"
                    disabled={!threshold.enabled}
                  />
                </Form.Item>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave(threshold)}
                disabled={!threshold.enabled}
              >
                保存设置
              </Button>
            </div>
          </Card>
        ))}
      </Space>
    </Form>
  );
};

export default ThresholdForm;
