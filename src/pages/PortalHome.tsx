import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import {
  DashboardOutlined,
  SafetyOutlined,
  ToolOutlined,
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
      icon: <DashboardOutlined style={{ fontSize: 32 }} />,
      color: '#1890ff',
      subMenus: [
        { key: 'ioc-production', label: '生产综合主题' },
        { key: 'ioc-safety', label: '安全综合主题' },
      ],
    },
    {
      key: 'smart-mine-design',
      title: '智慧矿山设计',
      description: '矿山设计规划、建模、优化等智能化设计工具',
      icon: <ToolOutlined style={{ fontSize: 32 }} />,
      color: '#52c41a',
    },
    {
      key: 'smart-production',
      title: '智能生产协同',
      description: '生产调度、设备协同、效率优化等智能生产管理',
      icon: <RocketOutlined style={{ fontSize: 32 }} />,
      color: '#faad14',
      subMenus: [
        { key: 'production-execution', label: '生产执行系统' },
        { key: 'equipment-management', label: '设备管理系统' },
      ],
    },
    {
      key: 'smart-safety',
      title: '智慧安全保障',
      description: '边坡监测、人员定位、安全预警等全方位安全保障体系',
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
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
      icon: <EnvironmentOutlined style={{ fontSize: 32 }} />,
      color: '#13c2c2',
    },
    {
      key: 'smart-prod-ops-sales',
      title: '智慧产运销',
      description: '产量统计、运输管理、销售分析等全链条管理',
      icon: <ShoppingOutlined style={{ fontSize: 32 }} />,
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
    } else if (subMenuKey === 'production-execution') {
      navigate('/production-execution/production-continuity');
    } else if (subMenuKey === 'equipment-management') {
      navigate('/equipment-management/equipment-ledger');
    } else {
      navigate('/home');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 顶部欢迎区域 */}
      <div style={{ 
        marginBottom: 24, 
        background: '#fff',
        borderRadius: 8,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Title level={1} style={{ 
          marginBottom: 8, 
          color: '#262626',
          fontWeight: 600
        }}>
          智慧矿山平台
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#8c8c8c', marginBottom: 0 }}>
          欢迎使用智慧矿山综合管理平台
        </Paragraph>
      </div>

      {/* 模块卡片网格 */}
      <Row gutter={[16, 16]}>
        {portalCards.map((card) => (
          <Col xs={24} sm={12} md={8} xl={6} key={card.key}>
            <Card
              hoverable
              onClick={() => handleCardClick(card)}
              style={{
                height: '196px',
                borderRadius: 8,
                transition: 'all 0.3s ease',
                background: '#fff',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
              bodyStyle={{ 
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* 图标和标题区域 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: 12
              }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    boxShadow: `0 4px 12px ${card.color}40`
                  }}
                >
                  <div style={{ color: '#fff' }}>{card.icon}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ marginBottom: 2, fontSize: 16, fontWeight: 600, color: '#262626' }}>
                    {card.title}
                  </Title>
                </div>
              </div>

              {/* 描述文本 */}
              <Paragraph
                style={{
                  color: '#8c8c8c',
                  fontSize: 13,
                  lineHeight: 1.5,
                  marginBottom: card.subMenus ? 12 : 0,
                  flex: card.subMenus ? 'none' : 1
                }}
              >
                {card.description}
              </Paragraph>

              {/* 子菜单区域 */}
              {card.subMenus && card.subMenus.length > 0 && (
                <div style={{ marginTop: 'auto' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8
                  }}>
                    {card.subMenus.map((subMenu) => (
                      <div
                        key={subMenu.key}
                        onClick={(e) => handleSubMenuClick(e, subMenu.key)}
                        style={{
                          padding: '8px 10px',
                          background: '#fafafa',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontSize: 12,
                          color: '#595959',
                          transition: 'all 0.2s',
                          textAlign: 'center',
                          border: `1px solid #f0f0f0`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 32
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = card.color;
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fafafa';
                          e.currentTarget.style.color = '#595959';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {subMenu.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </Card>
          </Col>
        ))}
      </Row>

      {/* 快速访问区域 */}
      <div style={{
        marginTop: 24,
        background: '#fff',
        borderRadius: 8,
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Title level={4} style={{ marginBottom: 16, color: '#262626' }}>快速访问</Title>
        <Row gutter={[12, 12]}>
          <Col><Button size="small" onClick={() => navigate('/slope-monitoring/slope-device-management')}>边坡监测</Button></Col>
          <Col><Button size="small" onClick={() => navigate('/production-execution/production-continuity')}>生产执行</Button></Col>
          <Col><Button size="small" onClick={() => navigate('/equipment-management/equipment-ledger')}>设备管理</Button></Col>
          <Col><Button size="small" onClick={() => navigate('/personnel-safety/personnel-home')}>人员安全</Button></Col>
        </Row>
      </div>
    </div>
  );
};

export default PortalHome;
