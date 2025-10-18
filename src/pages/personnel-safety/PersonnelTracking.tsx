import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Select, Button, Space, Tag, Modal, DatePicker } from 'antd';
import { SearchOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PersonnelMap, { PersonnelLocation, DangerZone } from './components/PersonnelMap';
import TrajectoryPlayer, { PersonnelTrajectory, TrajectoryPoint } from './components/TrajectoryPlayer';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PersonnelTracking: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelLocation | null>(null);
  const [trajectoryModalVisible, setTrajectoryModalVisible] = useState(false);
  const [currentTrajectory, setCurrentTrajectory] = useState<PersonnelTrajectory | null>(null);

  // 模拟人员定位数据
  const [personnelData, setPersonnelData] = useState<PersonnelLocation[]>([
    {
      id: 'P001',
      name: '张三',
      department: '采矿部',
      position: [87.6150, 43.7950],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-001'
    },
    {
      id: 'P002',
      name: '李四',
      department: '采矿部',
      position: [87.6180, 43.7920],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-002'
    },
    {
      id: 'P003',
      name: '王五',
      department: '安全部',
      position: [87.6200, 43.7980],
      status: 'sos',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-003'
    },
    {
      id: 'P004',
      name: '赵六',
      department: '机电部',
      position: [87.6120, 43.7900],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-004'
    },
    {
      id: 'P005',
      name: '钱七',
      department: '采矿部',
      position: [87.6220, 43.7960],
      status: 'offline',
      lastUpdate: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-005'
    },
    {
      id: 'P006',
      name: '孙八',
      department: '安全部',
      position: [87.6160, 43.7930],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-006'
    },
    {
      id: 'P007',
      name: '周九',
      department: '运输部',
      position: [87.6135, 43.7945],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-007'
    },
    {
      id: 'P008',
      name: '吴十',
      department: '运输部',
      position: [87.6195, 43.7915],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-008'
    },
    {
      id: 'P009',
      name: '郑十一',
      department: '机电部',
      position: [87.6175, 43.7965],
      status: 'offline',
      lastUpdate: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-009'
    },
    {
      id: 'P010',
      name: '陈十二',
      department: '安全部',
      position: [87.6210, 43.7940],
      status: 'online',
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagId: 'TAG-010'
    }
  ]);

  // 模拟危险区域数据
  const dangerZones: DangerZone[] = [
    {
      id: 'DZ001',
      name: '爆破作业区',
      type: 'forbidden',
      level: 3,
      coordinates: [
        [87.6190, 43.7970],
        [87.6210, 43.7970],
        [87.6210, 43.7990],
        [87.6190, 43.7990]
      ],
      alertRule: {
        enterAlert: true
      }
    },
    {
      id: 'DZ002',
      name: '边坡监测区',
      type: 'restricted',
      level: 2,
      coordinates: [
        [87.6110, 43.7890],
        [87.6140, 43.7890],
        [87.6140, 43.7920],
        [87.6110, 43.7920]
      ],
      alertRule: {
        enterAlert: true,
        stayDuration: 30
      }
    },
    {
      id: 'DZ003',
      name: '高压线路区',
      type: 'forbidden',
      level: 3,
      coordinates: [
        [87.6125, 43.7955],
        [87.6145, 43.7955],
        [87.6145, 43.7975],
        [87.6125, 43.7975]
      ],
      alertRule: {
        enterAlert: true
      }
    }
  ];

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setPersonnelData(prev => prev.map(person => {
        if (person.status === 'online') {
          // 随机微调位置（模拟10米精度的位移）
          const deltaLng = (Math.random() - 0.5) * 0.0001; // 约10米
          const deltaLat = (Math.random() - 0.5) * 0.0001;
          return {
            ...person,
            position: [
              person.position[0] + deltaLng,
              person.position[1] + deltaLat
            ] as [number, number],
            lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        return person;
      }));
    }, 3000); // 每3秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 生成模拟历史轨迹数据
  const generateTrajectory = (personnel: PersonnelLocation): PersonnelTrajectory => {
    const trajectoryPoints: TrajectoryPoint[] = [];
    const now = dayjs();
    
    for (let i = 30; i >= 0; i--) {
      const time = now.subtract(i * 2, 'minute');
      const angle = (i * Math.PI) / 15;
      const offset = 0.001;
      
      trajectoryPoints.push({
        timestamp: time.format('YYYY-MM-DD HH:mm:ss'),
        position: [
          personnel.position[0] + Math.cos(angle) * offset,
          personnel.position[1] + Math.sin(angle) * offset
        ],
        status: 'online'
      });
    }

    return {
      personnelId: personnel.id,
      personnelName: personnel.name,
      trajectoryData: trajectoryPoints
    };
  };

  const handleViewTrajectory = (personnel: PersonnelLocation) => {
    const trajectory = generateTrajectory(personnel);
    setCurrentTrajectory(trajectory);
    setTrajectoryModalVisible(true);
  };

  const filteredData = personnelData.filter(person => {
    const matchSearch = person.name.includes(searchText) || person.tagId.includes(searchText);
    const matchDepartment = departmentFilter === 'all' || person.department === departmentFilter;
    return matchSearch && matchDepartment;
  });

  const departments = Array.from(new Set(personnelData.map(p => p.department)));

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100
    },
    {
      title: '标签ID',
      dataIndex: 'tagId',
      key: 'tagId',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const config = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'default', text: '离线' },
          sos: { color: 'error', text: 'SOS' }
        };
        return <Tag color={config[status as keyof typeof config].color}>{config[status as keyof typeof config].text}</Tag>;
      }
    },
    {
      title: '位置',
      key: 'position',
      width: 150,
      render: (_: any, record: PersonnelLocation) => (
        <span style={{ fontSize: 12 }}>
          {record.position[0].toFixed(4)}, {record.position[1].toFixed(4)}
        </span>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: PersonnelLocation) => (
        <Button
          type="link"
          size="small"
          icon={<HistoryOutlined />}
          onClick={() => handleViewTrajectory(record)}
        >
          轨迹
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={16}>
        {/* 左侧人员列表 */}
        <Col span={8}>
          <Card
            title={
              <Space>
                <UserOutlined />
                人员列表
              </Space>
            }
            extra={
              <Space>
                <Tag color="processing">在线: {personnelData.filter(p => p.status === 'online').length}</Tag>
                <Tag color="default">离线: {personnelData.filter(p => p.status === 'offline').length}</Tag>
                <Tag color="error">SOS: {personnelData.filter(p => p.status === 'sos').length}</Tag>
              </Space>
            }
            bodyStyle={{ padding: 16 }}
          >
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
              <Input
                placeholder="搜索姓名或标签ID"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Select
                style={{ width: '100%' }}
                placeholder="筛选部门"
                value={departmentFilter}
                onChange={setDepartmentFilter}
              >
                <Option value="all">全部部门</Option>
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Space>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 10, showSizeChanger: false }}
              scroll={{ y: 500 }}
              onRow={(record) => ({
                onClick: () => setSelectedPersonnel(record),
                style: { cursor: 'pointer', background: selectedPersonnel?.id === record.id ? '#e6f7ff' : 'transparent' }
              })}
            />
          </Card>
        </Col>

        {/* 右侧地图 */}
        <Col span={16}>
          <Card bodyStyle={{ padding: 16 }}>
            <PersonnelMap
              personnelData={personnelData}
              dangerZones={dangerZones}
              onPersonnelClick={setSelectedPersonnel}
              showDangerZones={true}
            />
          </Card>
        </Col>
      </Row>

      {/* 轨迹回放模态框 */}
      <Modal
        title="历史轨迹回放"
        open={trajectoryModalVisible}
        onCancel={() => setTrajectoryModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {currentTrajectory && (
          <TrajectoryPlayer
            trajectory={currentTrajectory}
            dangerZones={dangerZones}
          />
        )}
      </Modal>
    </div>
  );
};

export default PersonnelTracking;
