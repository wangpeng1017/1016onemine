import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  DashboardOutlined,
  SafetyOutlined,
  ToolOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface PortalCard {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subMenus?: Array<{
    key: string;
    label: string;
  }>;
}

const PortalHome: React.FC = () => {
  const navigate = useNavigate();

  const portalCards: PortalCard[] = [
    {
      key: 'ioc-center',
      title: 'IOC中心',
      description: '综合运营管理中心，统筹规划、生产、安全、运转等多个主题',
      icon: <DashboardOutlined style={{ fontSize: 48 }} />,
      color: '#1890ff',
      subMenus: [
        { key: 'ioc-planning', label: '规划设计主题' },
        { key: 'ioc-production', label: '生产综合主题' },
        { key: 'ioc-safety', label: '安全综合主题' },
        { key: 'ioc-operation', label: '运转综合主题' },
      ],
    },
    {
      key: 'smart-mine-design',
      title: '智慧矿山设计',
      description: '矿山设计规划、建模、优化等智能化设计工具',
      icon: <ToolOutlined style={{ fontSize: 48 }} />,
      color: '#52c41a',
    },
    {
      key: 'smart-production',
      title: '智能生产协同',
      description: '生产调度、设备协同、效率优化等智能生产管理',
      icon: <RocketOutlined style={{ fontSize: 48 }} />,
      color: '#faad14',
    },
    {
      key: 'smart-safety',
      title: '智慧安全保障',
      description: '边坡监测、人员定位、安全预警等全方位安全保障体系',
      icon: <SafetyOutlined style={{ fontSize: 48 }} />,
      color: '#f5222d',
      subMenus: [
        { key: 'slope-monitoring', label: '边坡监测管理' },
        { key: 'personnel-safety', label: '人员定位安全' },
      ],
    },
    {
      key: 'env-monitoring',
      title: '综合环境监测',
      description: '空气质量、水质、噪声、粉尘等环境参数实时监测',
      icon: <EnvironmentOutlined style={{ fontSize: 48 }} />,
      color: '#13c2c2',
    },
    {
      key: 'smart-prod-ops-sales',
      title: '智慧产运销',
      description: '产量统计、运输管理、销售分析等全链条管理',
      icon: <ShoppingOutlined style={{ fontSize: 48 }} />,
      color: '#722ed1',
    },
  ];

  const handleCardClick = (card: PortalCard) => {
    if (card.subMenus && card.subMenus.length > 0) {
      // 如果有子菜单，跳转到第一个子菜单
      const firstSubMenu = card.subMenus[0];
      if (firstSubMenu.key === 'slope-monitoring') {
        navigate('/slope-monitoring/slope-device-management');
      } else if (firstSubMenu.key === 'personnel-safety') {
        navigate('/personnel-safety/personnel-home');
      } else {
        navigate('/home');
      }
    } else {
      navigate('/home');
    }
  };

  const handleSubMenuClick = (e: React.MouseEvent, subMenuKey: string) => {
    e.stopPropagation();
    if (subMenuKey === 'slope-monitoring') {
      navigate('/slope-monitoring/slope-device-management');
    } else if (subMenuKey === 'personnel-safety') {
      navigate('/personnel-safety/personnel-home');
    } else {
      navigate('/home');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2}>智慧矿山平台</Title>
        <Paragraph style={{ fontSize: 16, color: '#666' }}>
          欢迎使用智慧矿山综合管理平台，请选择您要进入的模块
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {portalCards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.key}>
            <Card
              hoverable
              onClick={() => handleCardClick(card)}
              style={{
                height: '100%',
                borderRadius: 8,
                transition: 'all 0.3s',
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: card.color,
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {card.title}
                </Title>
                <Paragraph
                  style={{
                    color: '#666',
                    fontSize: 14,
                    minHeight: 60,
                    marginBottom: card.subMenus ? 16 : 0,
                  }}
                >
                  {card.description}
                </Paragraph>
                {card.subMenus && card.subMenus.length > 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    {card.subMenus.map((subMenu) => (
                      <div
                        key={subMenu.key}
                        onClick={(e) => handleSubMenuClick(e, subMenu.key)}
                        style={{
                          padding: '8px 12px',
                          marginBottom: 8,
                          background: '#f5f5f5',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 13,
                          color: '#666',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = card.color;
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f5f5f5';
                          e.currentTarget.style.color = '#666';
                        }}
                      >
                        {subMenu.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PortalHome;
