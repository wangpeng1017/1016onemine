import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Slider, Checkbox } from 'antd';
import 'antd/dist/reset.css'; // 引入 Ant Design 样式

const ThreeDViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mineObjectsRef = useRef<THREE.Object3D[]>([]); // 用于存储所有矿山对象
  const [currentYear, setCurrentYear] = useState<number>(2000); // 初始年份设置为 2000
  const defaultCheckedList = ['geologicalLayer', 'oreBody', 'drillHole'];
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);

  const layerOptions = [
    { label: '地质层', value: 'geologicalLayer' },
    { label: '矿体', value: 'oreBody' },
    { label: '钻孔', value: 'drillHole' },
  ];

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
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10); // 调整相机位置，从更高更远的角度俯瞰

    // 渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);


    // 光源：环境光
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // 光源：方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // 存储所有可控对象
    const mineObjects: THREE.Object3D[] = [];

    // 封装矿山场景创建逻辑
    const createMineScene = (scene: THREE.Scene, objects: THREE.Object3D[]) => {
      // 辅助函数：创建地质层
      const createGeologicalLayer = (width: number, height: number, depth: number, x: number, y: number, z: number, color: number, creationYear: number, layerType: string) => {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8 });
        const layer = new THREE.Mesh(geometry, material);
        layer.position.set(x, y, z);
        layer.userData = { creationYear, layerType };
        objects.push(layer);
        return layer;
      };

      // 模拟地质层
      const layer1 = createGeologicalLayer(10, 0.5, 10, 0, -2, 0, 0x8B4513, 2000, 'geologicalLayer'); // 棕色地层
      scene.add(layer1);
      const layer2 = createGeologicalLayer(9, 0.5, 9, 0, -1.5, 0, 0xA0522D, 2002, 'geologicalLayer'); // 稍深棕色地层
      scene.add(layer2);
      const layer3 = createGeologicalLayer(8, 0.5, 8, 0, -1, 0, 0xD2B48C, 2005, 'geologicalLayer'); // 米色地层
      scene.add(layer3);

      // 辅助函数：创建矿体
      const createOreBody = (width: number, height: number, depth: number, x: number, y: number, z: number, color: number, creationYear: number, layerType: string) => {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.6, emissive: color, emissiveIntensity: 0.5 });
        const oreBody = new THREE.Mesh(geometry, material);
        oreBody.position.set(x, y, z);
        oreBody.userData = { creationYear, layerType };
        objects.push(oreBody);
        return oreBody;
      };

      // 模拟矿体
      const oreBody1 = createOreBody(3, 1, 3, 0, -1.5, 0, 0xFFD700, 2003, 'oreBody'); // 金色矿体
      scene.add(oreBody1);
      const oreBody2 = createOreBody(2, 0.8, 2, 1, -0.8, 1, 0xC0C0C0, 2006, 'oreBody'); // 银色矿体
      scene.add(oreBody2);

      // 辅助函数：创建钻孔
      const createDrillHole = (path: THREE.Vector3[], radius: number, color: number, mineralizedZones: { start: number, end: number }[], creationYear: number, layerType: string) => {
        const curve = new THREE.CatmullRomCurve3(path);
        const drillHoleGroup = new THREE.Group();

        // 创建钻孔主体
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, radius, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({ color: color });
        const drillHoleMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        drillHoleGroup.add(drillHoleMesh);

        // 标记矿化带
        mineralizedZones.forEach(zone => {
          const startPoint = curve.getPointAt(zone.start);
          const endPoint = curve.getPointAt(zone.end);
          const tempPath = [startPoint, endPoint];
          const mineralizedCurve = new THREE.CatmullRomCurve3(tempPath);
          const zoneGeometry = new THREE.TubeGeometry(mineralizedCurve, 32, radius * 1.5, 8, false);
          const zoneMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, transparent: true, opacity: 0.7 });
          const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial);
          drillHoleGroup.add(zoneMesh);
        });
        drillHoleGroup.userData = { creationYear, layerType };
        objects.push(drillHoleGroup);
        return drillHoleGroup;
      };

      // 模拟钻孔数据
      const drillPath1 = [
        new THREE.Vector3(2, 0, 2),
        new THREE.Vector3(2, -3, 2),
        new THREE.Vector3(1, -5, 1)
      ];
      const drillHole1 = createDrillHole(drillPath1, 0.1, 0x808080, [{ start: 0.3, end: 0.5 }, { start: 0.7, end: 0.8 }], 2008, 'drillHole');
      scene.add(drillHole1);

      const drillPath2 = [
        new THREE.Vector3(-2, 0, -2),
        new THREE.Vector3(-1, -4, -1)
      ];
      const drillHole2 = createDrillHole(drillPath2, 0.08, 0x696969, [{ start: 0.4, end: 0.6 }], 2010, 'drillHole');
      scene.add(drillHole2);
    };

    createMineScene(scene, mineObjectsRef.current); // 调用函数创建矿山场景

    // 根据当前年份和图层控制更新对象的可见性
    const updateVisibility = () => {
      mineObjectsRef.current.forEach(obj => {
        const isVisibleByTime = obj.userData.creationYear ? obj.userData.creationYear <= currentYear : true;
        const isVisibleByLayer = obj.userData.layerType ? checkedList.includes(obj.userData.layerType) : true;
        obj.visible = isVisibleByTime && isVisibleByLayer;
      });
    };
    updateVisibility(); // 初始设置一次

    // 视角控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -2, 0); // 将控制器目标设置为矿山模型的中心
    controls.enableDamping = true; // 启用阻尼（惯性），这将使动画更平滑
    controls.dampingFactor = 0.25; // 阻尼系数
    controls.screenSpacePanning = false; // 禁止屏幕空间平移
    controls.maxPolarAngle = Math.PI / 2; // 垂直旋转的上限

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      controls.update(); // 只有当 controls.enableDamping 设置为 true 时才需要调用

      renderer.render(scene, camera);
    };
    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentYear, checkedList]); // 添加 currentYear 和 checkedList 作为依赖项，以便在它们变化时重新评估场景

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: 500, background: 'rgba(255,255,255,0.7)', padding: '10px 20px', borderRadius: 8 }}>
        <Slider
          min={2000}
          max={2020}
          defaultValue={2000}
          value={currentYear}
          onChange={setCurrentYear}
          marks={{ 2000: '2000', 2005: '2005', 2010: '2010', 2015: '2015', 2020: '2020' }}
          step={1}
          tooltip={{ formatter: (value?: number) => value ? `${value} 年` : 'N/A' }}
        />
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: 8 }}>
        <Checkbox.Group
          options={layerOptions}
          value={checkedList}
          onChange={(list) => setCheckedList(list as string[])}
        />
      </div>
    </div>
  );
};

export default ThreeDViewer;