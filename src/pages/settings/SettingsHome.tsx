import React from 'react';
import { Card, Row, Col, Typography, Divider } from 'antd';
import { 
  DatabaseOutlined, 
  UserOutlined, 
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SettingsHome: React.FC = () => {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: '基础功能',
      items: [
        {
          key: 'data-dictionary',
          title: '数据字典',
          icon: <DatabaseOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
          description: '管理系统中的基础数据分类和定义',
        },
        {
          key: 'account-management',
          title: '账号管理',
          icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
          description: '用户账号、角色权限管理',
        },
        {
          key: 'system-config',
          title: '系统配置',
          icon: <SettingOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
          description: '系统参数、功能开关等配置管理',
        },
      ]
    },
    {
      title: '主数据管理',
      items: [
        {
          key: 'master-data/personnel',
          title: '人员管理',
          icon: <TeamOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
          description: '员工档案、组织架构、权限等级管理',
        },
        {
          key: 'master-data/equipment',
          title: '设备管理',
          icon: <ToolOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
          description: '设备台账、分类、基础信息管理',
        },
        {
          key: 'master-data/ore',
          title: '矿石管理',
          icon: <DatabaseOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
          description: '矿石类别、物理化学属性管理',
        },
        {
          key: 'master-data/ore-body',
          title: '矿体管理',
          icon: <DatabaseOutlined style={{ fontSize: 24, color: '#faad14' }} />,
          description: '矿山空间、地质实体信息管理',
        },
        {
          key: 'master-data/environment',
          title: '环境管理',
          icon: <SafetyOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
          description: '环境监测标准、监测点信息管理',
        },
      ]
    }
  ];

  const handleCardClick = (key: string) => {
    navigate(`/settings/${key}`);
  };

  return (
    <div>
      <Title level={2}>系统设置</Title>
      <Text type="secondary">管理系统基础功能和主数据配置</Text>
      
      {settingsCards.map((section, sectionIndex) => (
        <div key={section.title} style={{ marginTop: 32 }}>
          <Title level={3}>{section.title}</Title>
          <Divider />
          <Row gutter={[24, 24]}>
            {section.items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(item.key)}
                  style={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  bodyStyle={{ textAlign: 'center', padding: '24px 16px' }}
                >
                  <div style={{ marginBottom: 16 }}>
                    {item.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {item.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default SettingsHome;