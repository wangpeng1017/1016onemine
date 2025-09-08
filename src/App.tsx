import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DataReporting from './pages/DataReporting';
import MonitoringData from './pages/MonitoringData';
import AlarmRecords from './pages/AlarmRecords';
import DeviceManagement from './pages/DeviceManagement';
import ModelManagement from './pages/ModelManagement';
import ThresholdSettings from './pages/ThresholdSettings';
import SurfaceDisplacement from './pages/monitoring/SurfaceDisplacement';
import CrackGauge from './pages/monitoring/CrackGauge';
import EarthPressure from './pages/monitoring/EarthPressure';
import Groundwater from './pages/monitoring/Groundwater';
import BlastVibration from './pages/monitoring/BlastVibration';
import RainGauge from './pages/monitoring/RainGauge';
import Radar from './pages/monitoring/Radar';
import Console from './pages/reporting/Console';
import HistoryQuery from './pages/reporting/HistoryQuery';
import AccountManagement from './pages/AccountManagement';
import SystemConfig from './pages/SystemConfig';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="device-management" element={<DeviceManagement />} />
              <Route path="model-management" element={<ModelManagement />} />
              <Route path="threshold-settings" element={<ThresholdSettings />} />
              <Route path="monitoring-data" element={<MonitoringData />} />
              <Route path="monitoring-data/surface-displacement" element={<SurfaceDisplacement />} />
              <Route path="monitoring-data/crack-gauge" element={<CrackGauge />} />
              <Route path="monitoring-data/earth-pressure" element={<EarthPressure />} />
              <Route path="monitoring-data/groundwater" element={<Groundwater />} />
              <Route path="monitoring-data/blast-vibration" element={<BlastVibration />} />
              <Route path="monitoring-data/rain-gauge" element={<RainGauge />} />
              <Route path="monitoring-data/radar" element={<Radar />} />
              <Route path="alarm-records" element={<AlarmRecords />} />
              <Route path="data-reporting" element={<DataReporting />} />
              <Route path="data-reporting/console" element={<Console />} />
              <Route path="data-reporting/history-query" element={<HistoryQuery />} />
              <Route path="account-management" element={<AccountManagement />} />
              <Route path="system-config" element={<SystemConfig />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
