import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tree, 
  Slider, 
  Switch, 
  Button, 
  Space, 
  Row, 
  Col, 
  Input, 
  Select,
  Modal,
  Upload,
  message,
  Tooltip
} from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined,
  UploadOutlined,
  DeleteOutlined,
  SettingOutlined,
  FolderOutlined,
  FileOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Search } = Input;
const { Option } = Select;

interface LayerInfo {
  id: string;
  name: string;
  type: 'base' | 'vector' | 'raster' | 'model';
  visible: boolean;
  opacity: number;
  url?: string;
  description?: string;
  children?: LayerInfo[];
}

interface LayerManagementProps {
  onLayerChange?: (layers: LayerInfo[]) => void;
}

const LayerManagement: React.FC<LayerManagementProps> = ({ onLayerChange }) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  // 模拟图层数据
  useEffect(() => {
    const mockLayers: LayerInfo[] = [
      {
        id: 'base',
        name: '基础图层',
        type: 'base',
        visible: true,
        opacity: 1.0,
        children: [
          {
            id: 'satellite',
            name: '卫星影像',
            type: 'raster',
            visible: true,
            opacity: 1.0,
            url: 'https://example.com/satellite.tif',
            description: '高分辨率卫星影像底图'
          },
          {
            id: 'dem',
            name: '数字高程模型',
            type: 'raster',
            visible: false,
            opacity: 0.7,
            url: 'https://example.com/dem.tif',
            description: 'DEM地形数据'
          },
          {
            id: '3dtiles',
            name: '三维实景模型',
            type: 'model',
            visible: false,
            opacity: 1.0,
            url: 'https://example.com/model.3dtiles',
            description: '无人机倾斜摄影三维模型'
          }
        ]
      },
      {
        id: 'monitoring',
        name: '监测数据图层',
        type: 'vector',
        visible: true,
        opacity: 0.8,
        children: [
          {
            id: 'gnss_points',
            name: 'GNSS监测点',
            type: 'vector',
            visible: true,
            opacity: 1.0,
            url: 'https://example.com/gnss.geojson',
            description: 'GNSS表面位移监测点位'
          },
          {
            id: 'radar_coverage',
            name: '雷达监测范围',
            type: 'vector',
            visible: true,
            opacity: 0.6,
            url: 'https://example.com/radar.geojson',
            description: '边坡雷达监测覆盖范围'
          },
          {
            id: 'crack_gauges',
            name: '裂缝计监测点',
            type: 'vector',
            visible: false,
            opacity: 1.0,
            url: 'https://example.com/cracks.geojson',
            description: '裂缝计设备分布'
          }
        ]
      },
      {
        id: 'risk_analysis',
        name: '风险分析图层',
        type: 'vector',
        visible: true,
        opacity: 0.7,
        children: [
          {
            id: 'deformation_risk',
            name: '卫星形变风险区',
            type: 'vector',
            visible: true,
            opacity: 0.7,
            url: 'https://example.com/deformation.geojson',
            description: '基于卫星InSAR的形变风险区域'
          },
          {
            id: 'slope_stability',
            name: '边坡稳定性分析',
            type: 'vector',
            visible: false,
            opacity: 0.8,
            url: 'https://example.com/stability.geojson',
            description: '边坡稳定性评估结果'
          }
        ]
      },
      {
        id: 'infrastructure',
        name: '基础设施图层',
        type: 'vector',
        visible: false,
        opacity: 1.0,
        children: [
          {
            id: 'roads',
            name: '道路网络',
            type: 'vector',
            visible: false,
            opacity: 1.0,
            url: 'https://example.com/roads.geojson',
            description: '矿区内部道路网络'
          },
          {
            id: 'buildings',
            name: '建筑物',
            type: 'vector',
            visible: false,
            opacity: 1.0,
            url: 'https://example.com/buildings.geojson',
            description: '矿区建筑物分布'
          }
        ]
      }
    ];

    setLayers(mockLayers);
    setExpandedKeys(['base', 'monitoring', 'risk_analysis']);
  }, []);

  // 转换为Tree组件需要的数据格式
  const convertToTreeData = (layers: LayerInfo[]): DataNode[] => {
    return layers.map(layer => ({
      key: layer.id,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {layer.children ? <FolderOutlined /> : <FileOutlined />}
            <span style={{ marginLeft: 8 }}>{layer.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tooltip title={layer.visible ? '隐藏图层' : '显示图层'}>
              <Button
                type="text"
                size="small"
                icon={layer.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerVisibility(layer.id);
                }}
              />
            </Tooltip>
            {!layer.children && (
              <Tooltip title="图层设置">
                <Button
                  type="text"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedKeys([layer.id]);
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      ),
      children: layer.children ? convertToTreeData(layer.children) : undefined,
      isLeaf: !layer.children
    }));
  };

  // 切换图层可见性
  const toggleLayerVisibility = (layerId: string) => {
    const updateLayerVisibility = (layers: LayerInfo[]): LayerInfo[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerVisibility(layer.children) };
        }
        return layer;
      });
    };

    const updatedLayers = updateLayerVisibility(layers);
    setLayers(updatedLayers);
    onLayerChange?.(updatedLayers);
  };

  // 更新图层透明度
  const updateLayerOpacity = (layerId: string, opacity: number) => {
    const updateOpacity = (layers: LayerInfo[]): LayerInfo[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, opacity };
        }
        if (layer.children) {
          return { ...layer, children: updateOpacity(layer.children) };
        }
        return layer;
      });
    };

    const updatedLayers = updateOpacity(layers);
    setLayers(updatedLayers);
    onLayerChange?.(updatedLayers);
  };

  // 获取选中的图层信息
  const getSelectedLayer = (): LayerInfo | null => {
    if (selectedKeys.length === 0) return null;
    
    const findLayer = (layers: LayerInfo[], id: string): LayerInfo | null => {
      for (const layer of layers) {
        if (layer.id === id) return layer;
        if (layer.children) {
          const found = findLayer(layer.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return findLayer(layers, selectedKeys[0] as string);
  };

  const selectedLayer = getSelectedLayer();

  // 搜索过滤
  const filterTreeData = (data: DataNode[], searchValue: string): DataNode[] => {
    if (!searchValue) return data;
    
    return data.filter(node => {
      const title = typeof node.title === 'string' ? node.title : '';
      const matchesSearch = title.toLowerCase().includes(searchValue.toLowerCase());
      const hasMatchingChildren = node.children ? filterTreeData(node.children, searchValue).length > 0 : false;
      
      if (matchesSearch || hasMatchingChildren) {
        return {
          ...node,
          children: node.children ? filterTreeData(node.children, searchValue) : undefined
        };
      }
      return false;
    });
  };

  const treeData = filterTreeData(convertToTreeData(layers), searchValue);

  return (
    <div style={{ padding: '24px' }}>
      <div className="page-title">地理空间图层管理</div>
      
      <Row gutter={16}>
        {/* 图层树 */}
        <Col xs={24} lg={12}>
          <Card 
            title="图层列表" 
            extra={
              <Space>
                <Button 
                  size="small" 
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModalVisible(true)}
                >
                  上传图层
                </Button>
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    // 刷新图层列表
                    message.success('图层列表已刷新');
                  }}
                >
                  刷新
                </Button>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="搜索图层..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <Tree
              treeData={treeData}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onSelect={setSelectedKeys}
              onExpand={setExpandedKeys}
              showLine
              showIcon
              height={500}
              style={{ 
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
          </Card>
        </Col>

        {/* 图层属性面板 */}
        <Col xs={24} lg={12}>
          <Card title="图层属性">
            {selectedLayer ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <h4>{selectedLayer.name}</h4>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    {selectedLayer.description || '暂无描述'}
                  </p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: '80px' }}>可见性:</span>
                    <Switch
                      checked={selectedLayer.visible}
                      onChange={() => toggleLayerVisibility(selectedLayer.id)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span>透明度: {Math.round(selectedLayer.opacity * 100)}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={selectedLayer.opacity}
                    onChange={(value) => updateLayerOpacity(selectedLayer.id, value)}
                  />
                </div>

                {selectedLayer.url && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span>数据源:</span>
                    </div>
                    <Input.TextArea
                      value={selectedLayer.url}
                      rows={3}
                      readOnly
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span>图层类型:</span>
                  </div>
                  <Select value={selectedLayer.type} style={{ width: '100%' }} disabled>
                    <Option value="base">基础图层</Option>
                    <Option value="vector">矢量图层</Option>
                    <Option value="raster">栅格图层</Option>
                    <Option value="model">三维模型</Option>
                  </Select>
                </div>

                <Space>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      message.success('图层属性已保存');
                    }}
                  >
                    保存设置
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: '确认删除',
                        content: `确定要删除图层 "${selectedLayer.name}" 吗？`,
                        onOk: () => {
                          message.success('图层已删除');
                          setSelectedKeys([]);
                        }
                      });
                    }}
                  >
                    删除图层
                  </Button>
                </Space>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                <FileOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <p>请选择一个图层查看详细信息</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 上传图层模态框 */}
      <Modal
        title="上传图层数据"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <h4>支持的文件格式：</h4>
          <ul>
            <li>矢量数据：.geojson, .shp, .kml</li>
            <li>栅格数据：.tif, .tiff, .png, .jpg</li>
            <li>三维模型：.3dtiles, .gltf, .glb</li>
          </ul>
        </div>

        <Upload.Dragger
          name="file"
          multiple
          action="/api/upload/layer"
          onChange={(info) => {
            const { status } = info.file;
            if (status === 'done') {
              message.success(`${info.file.name} 文件上传成功`);
              setUploadModalVisible(false);
            } else if (status === 'error') {
              message.error(`${info.file.name} 文件上传失败`);
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传地理空间数据文件
          </p>
        </Upload.Dragger>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={() => setUploadModalVisible(false)}>
            取消
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LayerManagement;
