import React, { useState } from 'react';
import { Card, Row, Col, Table, DatePicker, Select, Button, Space, Tag, Statistic, Tabs } from 'antd';
import { ClockCircleOutlined, UserOutlined, BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AttendanceRecord {
  id: string;
  personnelId: string;
  personnelName: string;
  department: string;
  checkInTime: string;
  checkOutTime?: string;
  workHours: number;
  status: 'normal' | 'late' | 'early' | 'absent';
  zoneId: string;
  zoneName: string;
}

const AttendanceManagement: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 模拟考勤数据
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 'ATT001',
      personnelId: 'P001',
      personnelName: '张三',
      department: '采矿部',
      checkInTime: dayjs().hour(8).minute(0).format('YYYY-MM-DD HH:mm:ss'),
      checkOutTime: dayjs().hour(17).minute(30).format('YYYY-MM-DD HH:mm:ss'),
      workHours: 9.5,
      status: 'normal',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    },
    {
      id: 'ATT002',
      personnelId: 'P002',
      personnelName: '李四',
      department: '采矿部',
      checkInTime: dayjs().hour(8).minute(15).format('YYYY-MM-DD HH:mm:ss'),
      checkOutTime: dayjs().hour(17).minute(20).format('YYYY-MM-DD HH:mm:ss'),
      workHours: 9.08,
      status: 'late',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    },
    {
      id: 'ATT003',
      personnelId: 'P003',
      personnelName: '王五',
      department: '安全部',
      checkInTime: dayjs().hour(7).minute(50).format('YYYY-MM-DD HH:mm:ss'),
      checkOutTime: dayjs().hour(16).minute(30).format('YYYY-MM-DD HH:mm:ss'),
      workHours: 8.67,
      status: 'early',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    },
    {
      id: 'ATT004',
      personnelId: 'P004',
      personnelName: '赵六',
      department: '机电部',
      checkInTime: dayjs().hour(8).minute(5).format('YYYY-MM-DD HH:mm:ss'),
      checkOutTime: dayjs().hour(17).minute(25).format('YYYY-MM-DD HH:mm:ss'),
      workHours: 9.33,
      status: 'normal',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    },
    {
      id: 'ATT005',
      personnelId: 'P005',
      personnelName: '钱七',
      department: '采矿部',
      checkInTime: '-',
      checkOutTime: undefined,
      workHours: 0,
      status: 'absent',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    },
    {
      id: 'ATT006',
      personnelId: 'P006',
      personnelName: '孙八',
      department: '安全部',
      checkInTime: dayjs().hour(8).minute(0).format('YYYY-MM-DD HH:mm:ss'),
      checkOutTime: dayjs().hour(17).minute(30).format('YYYY-MM-DD HH:mm:ss'),
      workHours: 9.5,
      status: 'normal',
      zoneId: 'ATT-ZONE-001',
      zoneName: '矿区入口'
    }
  ];

  const filteredRecords = attendanceRecords.filter(record => {
    const matchDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchDepartment && matchStatus;
  });

  const departments = Array.from(new Set(attendanceRecords.map(r => r.department)));

  // 统计数据
  const totalPersonnel = attendanceRecords.length;
  const normalCount = attendanceRecords.filter(r => r.status === 'normal').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const earlyCount = attendanceRecords.filter(r => r.status === 'early').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const avgWorkHours = (attendanceRecords.reduce((sum, r) => sum + r.workHours, 0) / attendanceRecords.length).toFixed(2);
  const attendanceRate = ((totalPersonnel - absentCount) / totalPersonnel * 100).toFixed(1);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'personnelName',
      key: 'personnelName',
      width: 100
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100
    },
    {
      title: '签到时间',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      width: 160
    },
    {
      title: '签退时间',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      width: 160,
      render: (time?: string) => time || '-'
    },
    {
      title: '工时(小时)',
      dataIndex: 'workHours',
      key: 'workHours',
      width: 100,
      render: (hours: number) => hours > 0 ? hours.toFixed(2) : '-'
    },
    {
      title: '考勤状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = {
          normal: { color: 'success', text: '正常' },
          late: { color: 'warning', text: '迟到' },
          early: { color: 'orange', text: '早退' },
          absent: { color: 'error', text: '缺勤' }
        };
        const item = config[status as keyof typeof config];
        return <Tag color={item.color}>{item.text}</Tag>;
      }
    },
    {
      title: '考勤区域',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 120
    }
  ];

  // 部门工时统计图表
  const departmentWorkHoursOption = {
    title: {
      text: '各部门平均工时统计',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: departments,
      axisLabel: { rotate: 0 }
    },
    yAxis: {
      type: 'value',
      name: '工时(小时)',
      axisLabel: { formatter: '{value}h' }
    },
    series: [
      {
        name: '平均工时',
        type: 'bar',
        data: departments.map(dept => {
          const deptRecords = attendanceRecords.filter(r => r.department === dept);
          const avgHours = deptRecords.reduce((sum, r) => sum + r.workHours, 0) / deptRecords.length;
          return avgHours.toFixed(2);
        }),
        itemStyle: {
          color: '#1890ff'
        }
      }
    ]
  };

  // 考勤状态分布饼图
  const attendanceStatusOption = {
    title: {
      text: '考勤状态分布',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '考勤状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}人'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: normalCount, name: '正常', itemStyle: { color: '#52c41a' } },
          { value: lateCount, name: '迟到', itemStyle: { color: '#faad14' } },
          { value: earlyCount, name: '早退', itemStyle: { color: '#ff7a45' } },
          { value: absentCount, name: '缺勤', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总人数"
              value={totalPersonnel}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常出勤"
              value={normalCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${totalPersonnel}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="出勤率"
              value={attendanceRate}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: Number(attendanceRate) >= 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均工时"
              value={avgWorkHours}
              suffix="小时"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="records"
        items={[
          {
            key: 'records',
            label: (
              <span>
                <ClockCircleOutlined /> 考勤记录
              </span>
            ),
            children: (
              <Card
                title="考勤记录"
                extra={
                  <Space>
                    <RangePicker
                      value={dateRange}
                      onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                      format="YYYY-MM-DD"
                    />
                    <Select value={departmentFilter} onChange={setDepartmentFilter} style={{ width: 120 }}>
                      <Option value="all">全部部门</Option>
                      {departments.map(dept => (
                        <Option key={dept} value={dept}>{dept}</Option>
                      ))}
                    </Select>
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
                      <Option value="all">全部状态</Option>
                      <Option value="normal">正常</Option>
                      <Option value="late">迟到</Option>
                      <Option value="early">早退</Option>
                      <Option value="absent">缺勤</Option>
                    </Select>
                  </Space>
                }
              >
                <Table
                  columns={columns}
                  dataSource={filteredRecords}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'statistics',
            label: (
              <span>
                <BarChartOutlined /> 工时统计
              </span>
            ),
            children: (
              <Row gutter={16}>
                <Col span={12}>
                  <Card>
                    <ReactECharts option={departmentWorkHoursOption} style={{ height: 400 }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <ReactECharts option={attendanceStatusOption} style={{ height: 400 }} />
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'exceptions',
            label: (
              <span>
                <Tag color="error">{lateCount + earlyCount + absentCount}</Tag> 异常记录
              </span>
            ),
            children: (
              <Card title="异常考勤记录">
                <Table
                  columns={columns}
                  dataSource={attendanceRecords.filter(r => r.status !== 'normal')}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default AttendanceManagement;
