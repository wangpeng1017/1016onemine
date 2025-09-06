import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import DataReporting from './pages/DataReporting';
import MonitoringData from './pages/MonitoringData';
import AlarmRecords from './pages/AlarmRecords';
import DeviceManagement from './pages/DeviceManagement';
import ModelManagement from './pages/ModelManagement';
import ThresholdSettings from './pages/ThresholdSettings';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/data-reporting" replace />} />
              <Route path="data-reporting" element={<DataReporting />} />
              <Route path="monitoring-data" element={<MonitoringData />} />
              <Route path="alarm-records" element={<AlarmRecords />} />
              <Route path="device-management" element={<DeviceManagement />} />
              <Route path="model-management" element={<ModelManagement />} />
              <Route path="threshold-settings" element={<ThresholdSettings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
