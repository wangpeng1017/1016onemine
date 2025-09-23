import React from 'react';
import { Card, Form, Input, Row, Col, DatePicker, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ProjectInfo: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    const values = await form.validateFields();
    console.log('保存项目信息:', values);
    message.success('项目信息已保存');
  };

  return (
    <Card className="custom-card" title="项目信息">
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
              <Input placeholder="请输入项目名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="projectLocation" label="项目地址" rules={[{ required: true, message: '请输入项目地址' }]}>
              <Input placeholder="请输入项目地址" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="industry" label="所属行业" rules={[{ required: true, message: '请输入所属行业' }]}>
              <Input placeholder="矿矿/水利/市政等" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="startDate" label="开工时间" rules={[{ required: true, message: '请选择开工时间' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="投影文件" label="投影文件">
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>上传 .prj</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="lon" label="项目经度(°)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="例如：92.947381" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lat" label="项目纬度(°)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="例如：44.490319" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="xGCS" label="东(GCGS2000)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="yGCS" label="北(GCGS2000)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="remark" label="备注">
          <TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>保存</Button>
      </Form>
    </Card>
  );
};

export default ProjectInfo;
