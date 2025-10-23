import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { NavigationProvider } from './context/NavigationContext';
import GlobalLayout from './layouts/GlobalLayout';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import PortalHome from './pages/PortalHome';
import DataReporting from './pages/DataReporting';
import MonitoringData from './pages/MonitoringData';
import PointAlarms from './pages/alarm/PointAlarms';
import RadarAlarms from './pages/alarm/RadarAlarms';
import DeviceManagement from './pages/DeviceManagement';
import ThresholdSettingsSimple from './pages/ThresholdSettingsSimple';
import SurfaceDisplacement from './pages/monitoring/SurfaceDisplacement';
import CrackGauge from './pages/monitoring/CrackGauge';
import EarthPressure from './pages/monitoring/EarthPressure';
import Groundwater from './pages/monitoring/Groundwater';
import BlastVibration from './pages/monitoring/BlastVibration';
import RainGauge from './pages/monitoring/RainGauge';
import Radar from './pages/monitoring/Radar';
import AerospaceRisk from './pages/monitoring/AerospaceRisk';
import Console from './pages/reporting/Console';
import HistoryQuery from './pages/reporting/HistoryQuery';
import UploadSystemConfig from './pages/reporting/UploadSystemConfig';
import MineTopology from './pages/reporting/MineTopology';
import BasicInfoManagement from './pages/BasicInfoManagement';
import ModelManagement from './pages/ModelManagement';
import HuituCloud from './pages/basic-platform/HuituCloud';
import IotPlatform from './pages/basic-platform/IotPlatform';
import DataIntegration from './pages/basic-platform/DataIntegration';
import AccountManagement from './pages/AccountManagement';
import ProjectInfo from './pages/system-config/ProjectInfo';
import RegionManagement from './pages/system-config/RegionManagement';
import AlarmSettings from './pages/system-config/AlarmSettings';
import DeviceTypes from './pages/data-dictionary/DeviceTypes';
import ProductionContinuity from './pages/production-execution/ProductionContinuity';
import CoalOperationPlan from './pages/production-execution/CoalOperationPlan';
import DailyDispatch from './pages/production-execution/DailyDispatch';
import SurveyingAcceptance from './pages/production-execution/SurveyingAcceptance';
import ProductionAnalysis from './pages/production-execution/ProductionAnalysis';
import BasicInfo from './pages/production-execution/BasicInfo';
import EquipmentLedger from './pages/equipment-management/EquipmentLedger';
import Placeholder from './pages/equipment-management/Placeholder';
import FaultManagement from './pages/equipment-management/FaultManagement';
import TestingManagement from './pages/equipment-management/TestingManagement';
import RepairPlan from './pages/equipment-management/RepairPlan';
import IntelligentOreBlendingLayout from './pages/IntelligentOreBlending/IntelligentOreBlendingLayout';
import SettingsLayout from './layouts/SettingsLayout';
import Personnel from './pages/master-data/Personnel';
import Equipment from './pages/master-data/Equipment';
import Ore from './pages/master-data/Ore';
import OreBody from './pages/master-data/OreBody';
import Environment from './pages/master-data/Environment';
import SettingsHome from './pages/settings/SettingsHome';
import PersonnelTracking from './pages/personnel-safety/PersonnelTracking';
import SafetyAlert from './pages/personnel-safety/SafetyAlert';
import AttendanceManagement from './pages/personnel-safety/AttendanceManagement';
import EnvironmentalMonitoring from './pages/environmental-monitoring/EnvironmentalMonitoring';
import ComprehensiveEnvMonitoring from './pages/comprehensive-env/ComprehensiveEnvMonitoring';
import ProductionSalesCenter from './pages/production-sales/ProductionSalesCenter';
import SmartProdOpsSales from './pages/SmartProdOpsSales';
import IocPlanning from './pages/ioc/IocPlanning';
import IocProduction from './pages/ioc/IocProduction';
import IocSafety from './pages/ioc/IocSafety';
import IocOperation from './pages/ioc/IocOperation';
import SafetyManagementHome from './pages/safety-management/SafetyManagementHome';
import StandardArchives from './pages/safety-management/StandardArchives';
import DualPreventionMechanism from './pages/safety-management/DualPreventionMechanism';
import SafetyStandardization from './pages/safety-management/SafetyStandardization';
import WorkPermit from './pages/safety-management/WorkPermit';
import SafetyTraining from './pages/safety-management/SafetyTraining';
import TeamBuilding from './pages/safety-management/TeamBuilding';
import ContractorManagement from './pages/safety-management/ContractorManagement';
import OccupationalHealth from './pages/safety-management/OccupationalHealth';
import MonitoringControl from './pages/safety-management/MonitoringControl';
import SafetyCost from './pages/safety-management/SafetyCost';
import EmergencyManagement from './pages/safety-management/EmergencyManagement';
import GeologicalAssurance from './pages/technical-management/GeologicalAssurance'; // 导入地质保障组件
import GeologicalReports from './pages/technical-management/GeologicalReports'; // 导入地质报表组件
import MiningDesign from './pages/technical-management/MiningDesign'; // 导入采矿设计组件
import MiningEngineeringQuality from './pages/technical-management/MiningEngineeringQuality'; // 导入采矿工程质量组件
import IntelligentDrillingBlasting from './pages/technical-management/IntelligentDrillingBlasting'; // 导入智能穿爆组件
import TechnicalDataManagement from './pages/technical-management/TechnicalDataManagement'; // 导入技术资料管理组件
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <NavigationProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<GlobalLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<PortalHome />} />
              
              {/* 边坡监测管理路由 */}
              <Route path="slope-monitoring/slope-home" element={<Home />} />
              <Route path="slope-monitoring/slope-device-management" element={<DeviceManagement />} />
              <Route path="slope-monitoring/slope-model-management" element={<ModelManagement />} />
              <Route path="slope-monitoring/slope-threshold-settings" element={<ThresholdSettingsSimple />} />
              <Route path="slope-monitoring/slope-monitoring-data" element={<MonitoringData />} />
              <Route path="slope-monitoring/slope-alarm-records" element={<PointAlarms />} />
              <Route path="slope-monitoring/slope-data-reporting" element={<DataReporting />} />
              <Route path="slope-monitoring/slope-basic-platform" element={<HuituCloud />} />
              <Route path="slope-monitoring/slope-data-dictionary" element={<DeviceTypes />} />
              <Route path="slope-monitoring/slope-account-management" element={<AccountManagement />} />
              <Route path="slope-monitoring/slope-system-config" element={<ProjectInfo />} />
              
              {/* 人员定位安全路由 */}
              <Route path="personnel-safety/personnel-tracking" element={<PersonnelTracking />} />
              <Route path="personnel-safety/personnel-safety-alert" element={<SafetyAlert />} />
              <Route path="personnel-safety/personnel-statistics" element={<AttendanceManagement />} />
              <Route path="personnel-safety/personnel-settings" element={<ThresholdSettingsSimple />} />
              
              {/* 环境监测路由 */}
              <Route path="env-monitoring/env-home" element={<EnvironmentalMonitoring />} />
              <Route path="env-monitoring/env-monitoring" element={<EnvironmentalMonitoring />} />
              <Route path="env-monitoring/env-sensors" element={<EnvironmentalMonitoring />} />
              
              {/* 综合环境监测路由 */}
              <Route path="comprehensive-env-monitoring" element={<ComprehensiveEnvMonitoring />} />
              
              {/* 智慧产运销路由 */}
              <Route path="smart-prod-ops-sales" element={<ProductionSalesCenter />} />
              <Route path="production-sales-center" element={<ProductionSalesCenter />} />
              
              {/* IOC中心路由 */}
              <Route path="ioc-planning" element={<IocPlanning />} />
              <Route path="ioc-production" element={<IocProduction />} />
              <Route path="ioc-safety" element={<IocSafety />} />
              <Route path="ioc-operation" element={<IocOperation />} />
              
              {/* 安全管理中心路由 */}
              <Route path="safety-management">
                <Route index element={<SafetyManagementHome />} />
                <Route path="home" element={<SafetyManagementHome />} />
                <Route path="standard-archives" element={<StandardArchives />} />
                <Route path="safety-standardization" element={<SafetyStandardization />} />
                <Route path="dual-prevention" element={<DualPreventionMechanism />} />
                <Route path="work-permit" element={<WorkPermit />} />
                <Route path="safety-training" element={<SafetyTraining />} />
                <Route path="team-building" element={<TeamBuilding />} />
                <Route path="contractor-management" element={<ContractorManagement />} />
                <Route path="occupational-health" element={<OccupationalHealth />} />
                <Route path="monitoring-control" element={<MonitoringControl />} />
                <Route path="safety-cost" element={<SafetyCost />} />
                <Route path="emergency-management" element={<EmergencyManagement />} />
              </Route>
              
              {/* 生产执行系统路由 */}
              <Route path="production-execution/production-continuity" element={<ProductionContinuity />} />
              <Route path="production-execution/coal-operation-plan" element={<CoalOperationPlan />} />
              <Route path="production-execution/daily-dispatch" element={<DailyDispatch />} />
              <Route path="production-execution/surveying-acceptance" element={<SurveyingAcceptance />} />
              <Route path="production-execution/production-analysis" element={<ProductionAnalysis />} />
              <Route path="production-execution/basic-info" element={<BasicInfo />} />
              
              {/* 设备管理系统路由 */}
              <Route path="equipment-management/equipment-ledger" element={<EquipmentLedger />} />
              <Route path="equipment-management/inspection-management" element={<Placeholder title="点检管理" />} />
              <Route path="equipment-management/maintenance-management" element={<Placeholder title="保养管理" />} />
              <Route path="equipment-management/testing-management" element={<TestingManagement />} />
              <Route path="equipment-management/fault-management" element={<FaultManagement />} />
              <Route path="equipment-management/maintenance-plan" element={<RepairPlan />} />
              
              {/* 智能配矿管理路由 */}
              <Route path="intelligent-ore-blending" element={<IntelligentOreBlendingLayout />} />
              
              <Route path="device-management" element={<DeviceManagement />} />
              <Route path="model-management" element={<ModelManagement />} />
<Route path="threshold-settings" element={<ThresholdSettingsSimple />} />
              <Route path="monitoring-data" element={<MonitoringData />} />
              <Route path="monitoring-data/surface-displacement" element={<SurfaceDisplacement />} />
              <Route path="monitoring-data/crack-gauge" element={<CrackGauge />} />
              <Route path="monitoring-data/earth-pressure" element={<EarthPressure />} />
              <Route path="monitoring-data/groundwater" element={<Groundwater />} />
              <Route path="monitoring-data/blast-vibration" element={<BlastVibration />} />
              <Route path="monitoring-data/rain-gauge" element={<RainGauge />} />
              <Route path="monitoring-data/radar" element={<Radar />} />
              <Route path="monitoring-data/aerospace-risk" element={<AerospaceRisk />} />
<Route path="alarm-records" element={<Navigate to="/alarm-records/point-alarms" replace />} />
              <Route path="alarm-records/point-alarms" element={<PointAlarms />} />
              <Route path="alarm-records/radar-alarms" element={<RadarAlarms />} />
              <Route path="data-reporting" element={<DataReporting />} />
              <Route path="data-reporting/console" element={<Console />} />
              <Route path="data-reporting/history-query" element={<HistoryQuery />} />
              <Route path="data-reporting/system-config" element={<UploadSystemConfig />} />
              <Route path="data-reporting/mine-topology" element={<MineTopology />} />
              <Route path="basic-info-management" element={<BasicInfoManagement />} />
              <Route path="basic-platform/huitu-cloud" element={<HuituCloud />} />
              <Route path="basic-platform/iot-platform" element={<IotPlatform />} />
              <Route path="basic-platform/data-integration" element={<DataIntegration />} />
              <Route path="data-dictionary/device-types" element={<DeviceTypes />} />
              <Route path="account-management" element={<AccountManagement />} />
              <Route path="system-config" element={<Navigate to="/system-config/project-info" replace />} />
              <Route path="system-config/project-info" element={<ProjectInfo />} />
              <Route path="system-config/region-management" element={<RegionManagement />} />
              <Route path="system-config/alarm-settings" element={<AlarmSettings />} />
              <Route path="technical-management/geological-assurance" element={<GeologicalAssurance />} /> {/* 添加地质保障路由 */}
              <Route path="technical-management/geological-reports" element={<GeologicalReports />} /> {/* 添加地质报表路由 */}
              <Route path="technical-management/mining-design" element={<MiningDesign />} /> {/* 添加采矿设计路由 */}
              <Route path="technical-management/mining-engineering-quality" element={<MiningEngineeringQuality />} /> {/* 添加采矿工程质量路由 */}
              <Route path="technical-management/intelligent-drilling-blasting" element={<IntelligentDrillingBlasting />} /> {/* 添加智能穿爆路由 */}
              </Route>
              
              {/* 设置页面独立路由 */}
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<SettingsHome />} />
                <Route path="data-dictionary" element={<DeviceTypes />} />
                <Route path="account-management" element={<AccountManagement />} />
                <Route path="system-config" element={<ProjectInfo />} />
                <Route path="master-data/personnel" element={<Personnel />} />
                <Route path="master-data/equipment" element={<Equipment />} />
                <Route path="master-data/ore" element={<Ore />} />
                <Route path="master-data/ore-body" element={<OreBody />} />
                <Route path="master-data/environment" element={<Environment />} />
              </Route>
              
              {/* 保留原有的MainLayout路由作为备选 */}
              <Route path="/legacy" element={<MainLayout />}>
                <Route index element={<Navigate to="/legacy/home" replace />} />
                <Route path="home" element={<Home />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </NavigationProvider>
    </ConfigProvider>
  );
};

export default App;
