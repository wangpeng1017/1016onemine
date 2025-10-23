import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DeviceDetailPanel from './DeviceDetailPanel';

// 定义设备状态类型
type DeviceStatus = '运行中' | '故障' | '待机';

// 定义设备类型
type DeviceType = '挖掘机' | '运输车' | '钻机';

// 定义设备数据结构
interface Device {
  id: string;
  position: THREE.Vector3;
  status: DeviceStatus;
  type: DeviceType;
  currentSpeed: number;
  fuelLevel: number;
  workingHours: number;
  efficiency: number;
}

const MineMap: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const deviceRefs = useRef<Map<string, THREE.Mesh>>(new Map()); // 用于存储设备的三维对象引用
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null); // 用于存储定时器引用

  // 新增的ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // 模拟设备数据
  const [devices, setDevices] = useState<Device[]>([
    { id: 'device-1', position: new THREE.Vector3(10, 0.5, 10), status: '运行中', type: '挖掘机', currentSpeed: 10, fuelLevel: 80, workingHours: 120, efficiency: 90 },
    { id: 'device-2', position: new THREE.Vector3(-10, 0.5, -10), status: '故障', type: '运输车', currentSpeed: 0, fuelLevel: 30, workingHours: 200, efficiency: 50 },
    { id: 'device-3', position: new THREE.Vector3(0, 0.5, 20), status: '待机', type: '钻机', currentSpeed: 0, fuelLevel: 60, workingHours: 80, efficiency: 70 },
    { id: 'device-4', position: new THREE.Vector3(20, 0.5, -5), status: '运行中', type: '运输车', currentSpeed: 15, fuelLevel: 70, workingHours: 150, efficiency: 85 },
  ]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 清理旧场景，防止重复渲染
    while(mountRef.current.firstChild){
        mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // 场景
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 0); // 从上方俯瞰
    camera.lookAt(0, 0, 0); // 朝向原点

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0xcccccc); // 设置背景色为灰色

    // 光源：环境光
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // 光源：方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // 创建平面几何体作为地图底图
    const geometry = new THREE.PlaneGeometry(100, 100); // 100x100的平面
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // 默认绿色，如果纹理加载失败

    // 尝试加载纹理
    textureLoader.load(
      '/mine_map_texture.png', // 假设在 public 目录下有一个纹理文件
      (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error('Failed to load texture:', err);
        // 如果纹理加载失败，保持绿色平面
      }
    );

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // 使平面水平
    scene.add(plane);

    // 根据设备状态返回颜色
    const getDeviceColor = (status: DeviceStatus) => {
      switch (status) {
        case '运行中': return 0x00ff00; // 绿色
        case '故障': return 0xff0000;   // 红色
        case '待机': return 0xffff00;   // 黄色
        default: return 0xcccccc;
      }
    };

    // 为每个设备创建可视化对象
    devices.forEach(device => {
      const deviceGeometry = new THREE.BoxGeometry(1, 1, 1); // 简化为小方块
      const deviceMaterial = new THREE.MeshBasicMaterial({ color: getDeviceColor(device.status) });
      const deviceMesh = new THREE.Mesh(deviceGeometry, deviceMaterial);
      deviceMesh.position.copy(device.position);
      scene.add(deviceMesh);
      deviceRefs.current.set(device.id, deviceMesh); // 存储引用
    });

    // 视角控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 启用阻尼（惯性），这将使动画更平滑
    controls.dampingFactor = 0.25; // 阻尼系数
    controls.screenSpacePanning = true; // 允许屏幕空间平移
    controls.maxPolarAngle = Math.PI / 2; // 垂直旋转的上限，防止相机翻转到地下
    controls.minDistance = 1; // 最小缩放距离
    controls.maxDistance = 200; // 最大缩放距离

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // 更新设备在Three.js场景中的位置和颜色
      devices.forEach(device => {
        const deviceMesh = deviceRefs.current.get(device.id);
        if (deviceMesh) {
          deviceMesh.position.copy(device.position);
          (deviceMesh.material as THREE.MeshBasicMaterial).color.set(getDeviceColor(device.status));
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // 模拟设备数据实时更新
    updateIntervalRef.current = setInterval(() => {
      setDevices(prevDevices => prevDevices.map(device => {
        const newPosition = new THREE.Vector3(
          device.position.x + (Math.random() - 0.5) * 2, // 随机X轴移动
          0.5, // 保持Y轴不变，在平面上移动
          device.position.z + (Math.random() - 0.5) * 2  // 随机Z轴移动
        );

        // 限制设备在地图范围内
        newPosition.x = Math.max(-49, Math.min(49, newPosition.x));
        newPosition.z = Math.max(-49, Math.min(49, newPosition.z));

        const statuses: DeviceStatus[] = ['运行中', '故障', '待机'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return { ...device, position: newPosition, status: newStatus };
      }));
    }, 2000); // 每2秒更新一次

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current); // 清除定时器
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [devices]); // 添加devices依赖，确保设备数据更新时useEffect能够重新运行

  const handleDeviceClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current) return;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // 将鼠标点击位置归一化为设备坐标 (-1 到 +1)
    mouse.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / mountRef.current.clientHeight) * 2 + 1;

    // 通过相机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, cameraRef.current!); // cameraRef.current will be set in useEffect

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(sceneRef.current!.children); // sceneRef.current will be set in useEffect

    if (intersects.length > 0) {
      // 找到第一个相交的物体
      const intersectedObject = intersects[0].object;
      
      // 查找对应的设备
      let clickedDevice: Device | null = null;
      for (const device of devices) {
        const deviceMesh = deviceRefs.current.get(device.id);
        if (deviceMesh === intersectedObject) {
          clickedDevice = device;
          break;
        }
      }
      setSelectedDevice(clickedDevice);
    } else {
      setSelectedDevice(null); // 点击空白处则取消选中
    }
  }, [devices]); // 依赖devices确保能获取到最新的设备列表

  useEffect(() => {
    if (!mountRef.current) return;

    // 清理旧场景，防止重复渲染
    while(mountRef.current.firstChild){
        mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // 场景
    const scene = new THREE.Scene();
    sceneRef.current = scene; // Store scene reference

    // 相机
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 0); // 从上方俯瞰
    camera.lookAt(0, 0, 0); // 朝向原点
    cameraRef.current = camera; // Store camera reference

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer; // Store renderer reference
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0xcccccc); // 设置背景色为灰色

    // 光源：环境光
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // 光源：方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // 创建平面几何体作为地图底图
    const geometry = new THREE.PlaneGeometry(100, 100); // 100x100的平面
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // 默认绿色，如果纹理加载失败

    // 尝试加载纹理
    textureLoader.load(
      '/mine_map_texture.png', // 假设在 public 目录下有一个纹理文件
      (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error('Failed to load texture:', err);
        // 如果纹理加载失败，保持绿色平面
      }
    );

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // 使平面水平
    scene.add(plane);

    // 根据设备状态返回颜色
    const getDeviceColor = (status: DeviceStatus) => {
      switch (status) {
        case '运行中': return 0x00ff00; // 绿色
        case '故障': return 0xff0000;   // 红色
        case '待机': return 0xffff00;   // 黄色
        default: return 0xcccccc;
      }
    };

    // 为每个设备创建可视化对象
    devices.forEach(device => {
      const deviceGeometry = new THREE.BoxGeometry(1, 1, 1); // 简化为小方块
      const deviceMaterial = new THREE.MeshBasicMaterial({ color: getDeviceColor(device.status) });
      const deviceMesh = new THREE.Mesh(deviceGeometry, deviceMaterial);
      deviceMesh.position.copy(device.position);
      deviceMesh.userData = { id: device.id }; // 存储设备ID
      scene.add(deviceMesh);
      deviceRefs.current.set(device.id, deviceMesh); // 存储引用
    });

    // 视角控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 启用阻尼（惯性），这将使动画更平滑
    controls.dampingFactor = 0.25; // 阻尼系数
    controls.screenSpacePanning = true; // 允许屏幕空间平移
    controls.maxPolarAngle = Math.PI / 2; // 垂直旋转的上限，防止相机翻转到地下
    controls.minDistance = 1; // 最小缩放距离
    controls.maxDistance = 200; // 最大缩放距离

    // 添加点击事件监听
    renderer.domElement.addEventListener('mousedown', handleDeviceClick, false);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // 更新设备在Three.js场景中的位置和颜色
      devices.forEach(device => {
        const deviceMesh = deviceRefs.current.get(device.id);
        if (deviceMesh) {
          deviceMesh.position.copy(device.position);
          (deviceMesh.material as THREE.MeshBasicMaterial).color.set(getDeviceColor(device.status));
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // 模拟设备数据实时更新
    updateIntervalRef.current = setInterval(() => {
      setDevices(prevDevices => prevDevices.map(device => {
        const newPosition = new THREE.Vector3(
          device.position.x + (Math.random() - 0.5) * 2, // 随机X轴移动
          0.5, // 保持Y轴不变，在平面上移动
          device.position.z + (Math.random() - 0.5) * 2  // 随机Z轴移动
        );

        // 限制设备在地图范围内
        newPosition.x = Math.max(-49, Math.min(49, newPosition.x));
        newPosition.z = Math.max(-49, Math.min(49, newPosition.z));

        const statuses: DeviceStatus[] = ['运行中', '故障', '待机'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        // 模拟其他详情数据
        const newCurrentSpeed = parseFloat((Math.random() * 20).toFixed(1)); // 0-20 km/h
        const newFuelLevel = Math.floor(Math.random() * 100); // 0-100%
        const newWorkingHours = parseFloat((device.workingHours + Math.random()).toFixed(1)); // 累加
        const newEfficiency = Math.floor(Math.random() * 40) + 60; // 60-100%

        return {
          ...device,
          position: newPosition,
          status: newStatus,
          currentSpeed: newCurrentSpeed,
          fuelLevel: newFuelLevel,
          workingHours: newWorkingHours,
          efficiency: newEfficiency,
        };
      }));
    }, 2000); // 每2秒更新一次

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleDeviceClick);
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current); // 清除定时器
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [handleDeviceClick]); // 移除devices依赖，只在组件挂载时运行一次

  const handleClosePanel = useCallback(() => {
    setSelectedDevice(null);
  }, []);


  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {selectedDevice && (
        <DeviceDetailPanel device={selectedDevice} onClose={handleClosePanel} />
      )}
    </div>
  );
};

export default MineMap;