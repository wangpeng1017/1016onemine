import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Descriptions,
  message,
  Row,
  Col,
  Statistic,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface HistoryData {
  id: string;
  slopeCode: string;
  slopeName: string;
  dataType: string;
  pushStatus: 'success' | 'failed';
  fileSize: string;
  pushTime: string;
}

const HistoryQuery: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HistoryData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryData | null>(null);

  // 模拟历史查询数据
  const mockData: HistoryData[] = [
    {
      id: '1',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '矿山运营-GNSS预警阈值',
      pushStatus: 'success',
      fileSize: '1461 KB',
      pushTime: '2025-09-07 12:25:29',
    },
    {
      id: '2',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '矿山运营-边坡雷达预警阈值',
      pushStatus: 'success',
      fileSize: '2110 KB',
      pushTime: '2025-09-07 12:25:17',
    },
    {
      id: '3',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '矿山运营-设计境界图',
      pushStatus: 'success',
      fileSize: '53178 KB',
      pushTime: '2025-09-07 12:25:00',
    },
    {
      id: '4',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '矿山运营-开采现状图',
      pushStatus: 'success',
      fileSize: '3870243 KB',
      pushTime: '2025-09-07 12:24:50',
    },
    {
      id: '5',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '矿山运营-采矿许可证',
      pushStatus: 'success',
      fileSize: '1036560 KB',
      pushTime: '2025-09-07 12:24:28',
    },
    {
      id: '6',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '空天地综合监测预警报告',
      pushStatus: 'success',
      fileSize: '64404 KB',
      pushTime: '2025-09-07 12:24:12',
    },
    {
      id: '7',
      slopeCode: '652222053708',
      slopeName: '新疆能源（集团）有限责任公司新疆哈密三塘湖矿区石头梅一号露天煤矿',
      dataType: '边坡形态超限信息',
      pushStatus: 'success',
      fileSize: '2880 KB',
      pushTime: '2025-09-07 12:23:48',
    },
  ];

  const columns: ColumnsType<HistoryData> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '边坡编号',
      dataIndex: 'slopeCode',
      key: 'slopeCode',
      width: 150,
    },
    {
      title: '边坡名称',
      dataIndex: 'slopeName',
      key: 'slopeName',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 200,
      filters: [
        { text: '矿山运营-GNSS预警阈值', value: '矿山运营-GNSS预警阈值' },
        { text: '矿山运营-边坡雷达预警阈值', value: '矿山运营-边坡雷达预警阈值' },
        { text: '矿山运营-设计境界图', value: '矿山运营-设计境界图' },
        { text: '矿山运营-开采现状图', value: '矿山运营-开采现状图' },
        { text: '矿山运营-采矿许可证', value: '矿山运营-采矿许可证' },
        { text: '空天地综合监测预警报告', value: '空天地综合监测预警报告' },
        { text: '边坡形态超限信息', value: '边坡形态超限信息' },
      ],
      onFilter: (value, record) => record.dataType === value,
    },
    {
      title: '推送状态',
      dataIndex: 'pushStatus',
      key: 'pushStatus',
      width: 100,
      filters: [
        { text: '成功', value: 'success' },
        { text: '失败', value: 'failed' },
      ],
      onFilter: (value, record) => record.pushStatus === value,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      key: 'pushTime',
      width: 180,
      sorter: (a, b) => dayjs(a.pushTime).unix() - dayjs(b.pushTime).unix(),
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleRetry(record.id)}
            disabled={record.pushStatus === 'success'}
          >
            重新推送
          </Button>
        </Space>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetail = (record: HistoryData) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleRetry = (id: string) => {
    message.success('重新推送功能开发中...');
  };

  const handleExport = () => {
    message.success('数据导出功能开发中...');
  };

  const filteredData = data.filter((item) => {
    const statusMatch = selectedStatus === 'all' || item.pushStatus === selectedStatus;
    const typeMatch = selectedType === 'all' || item.dataType.includes(selectedType);
    const dateMatch = !dateRange || 
      (dayjs(item.pushTime).isAfter(dateRange[0]) && dayjs(item.pushTime).isBefore(dateRange[1]));
    
    return statusMatch && typeMatch && dateMatch;
  });

  return (
    <div>
      <div className="page-title">数据上报 - 历史查询</div>
      
      <Card className="custom-card">
        {/* 查询条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择推送状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="all">全部状态</Option>
              <Option value="success">成功</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择数据类型"
              value={selectedType}
              onChange={setSelectedType}
            >
              <Option value="all">全部类型</Option>
              <Option value="GNSS">GNSS预警阈值</Option>
              <Option value="雷达">边坡雷达预警阈值</Option>
              <Option value="设计境界图">设计境界图</Option>
              <Option value="开采现状图">开采现状图</Option>
              <Option value="采矿许可证">采矿许可证</Option>
              <Option value="监测预警报告">空天地综合监测预警报告</Option>
              <Option value="边坡形态">边坡形态超限信息</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={dateRange}
              onChange={setDateRange}
              placeholder={['开始时间', '结束时间']}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={loadData}
                loading={loading}
              >
                查询
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="上报详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="边坡编号">
              {selectedRecord.slopeCode}
            </Descriptions.Item>
            <Descriptions.Item label="推送时间">
              {selectedRecord.pushTime}
            </Descriptions.Item>
            <Descriptions.Item label="边坡名称" span={2}>
              {selectedRecord.slopeName}
            </Descriptions.Item>
            <Descriptions.Item label="数据类型" span={2}>
              {selectedRecord.dataType}
            </Descriptions.Item>
            <Descriptions.Item label="文件大小">
              {selectedRecord.fileSize}
            </Descriptions.Item>
            <Descriptions.Item label="推送状态">
              <Tag color={selectedRecord.pushStatus === 'success' ? 'green' : 'red'}>
                {selectedRecord.pushStatus === 'success' ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default HistoryQuery;
