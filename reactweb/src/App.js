import './App.css';
import './tailwindcss.css';
import { useState } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/views/LoginPage/LoginPage';
import UserDashBoardPage from './components/views/UserPage/UserDashBoardPage/UserDashBoardPage';
import UserBandSelectPage from './components/views/UserPage/UserBandSelectPage/UserBandSelectPage';
import UserSetParameterPage from './components/views/UserPage/UserSetParameterPage/UserSetParameterPage';
import UserSetAlarmPage from './components/views/UserPage/UserSetAlarmPage/UserSetAlarmPage';
import UserRegisterPage from './components/views/UserPage/UserRegisterPage/UserRegisterPage';
import UserViewLogsPage from './components/views/UserPage/UserViewLogsPage/UserViewLogsPage';
import AdminDTUStatusPage from './components/views/AdminPage/AdminDTUStatusPage/AdminDTUStatusPage'
import AdminMCUControlPage from './components/views/AdminPage/AdminMCUControlPage/AdminMCUControlPage'
import AdminAttenTablePage from './components/views/AdminPage/AdminAttenTablePage/AdminAttenTablePage'
import AdminTemperatureAttenTablePage from './components/views/AdminPage/AdminTemperatureAttenTablePage/AdminTemperatureAttenTablePage'
import AdminPowerAmpPowerTablePage from './components/views/AdminPage/AdminPowerAmpPowerTablePage/AdminPowerAmpPowerTablePage'
import AdminFirmwareDownloadPage from './components/views/AdminPage/AdminFirmwareDownloadPage/AdminFirmwareDownloadPage'
import AdminDataExportDownloadPage from './components/views/AdminPage/AdminDataExportDownloadPage/AdminDataExportDownloadPage'
import AdminNetworkConfigurationPage from './components/views/AdminPage/AdminNetworkConfigurationPage/AdminNetworkConfigurationPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <LoginPage /> } />
        <Route path='/user/dashboard' element={<UserDashBoardPage />} />
        <Route path='/user/bandSelect' element={<UserBandSelectPage />} />
        <Route path='/user/setParameter' element={<UserSetParameterPage />} />
        <Route path='/user/setAlarm' element={<UserSetAlarmPage />} />
        <Route path='/user/register' element={<UserRegisterPage />} />
        <Route path='/user/viewLogs' element={<UserViewLogsPage />} />
        <Route path='/admin/DTUStatus' element={<AdminDTUStatusPage />} />
        <Route path='/admin/MCUControl' element={<AdminMCUControlPage />} />
        <Route path='/admin/attenTable' element={<AdminAttenTablePage />} />
        <Route path='/admin/temperatureAttenTable' element={<AdminTemperatureAttenTablePage />} />
        <Route path='/admin/powerAmpPowerTable' element={<AdminPowerAmpPowerTablePage />} />
        <Route path='/admin/firmwareDownload' element={<AdminFirmwareDownloadPage />} />
        <Route path='/admin/dataExportDownload' element={<AdminDataExportDownloadPage />} />
        <Route path='/admin/networkConfiguration' element={<AdminNetworkConfigurationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
