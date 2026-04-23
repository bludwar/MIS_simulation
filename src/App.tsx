import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import RegisterPatient from './pages/RegisterPatient';
import PatientChart from './pages/chart/PatientChart';
import SummaryTab from './pages/chart/SummaryTab';
import EncountersTab from './pages/chart/EncountersTab';
import MedicationsTab from './pages/chart/MedicationsTab';
import VitalsTab from './pages/chart/VitalsTab';
import LabsTab from './pages/chart/LabsTab';
import Schedule from './pages/Schedule';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<RegisterPatient />} />
          <Route path="/patients/:patientId" element={<PatientChart />}>
            <Route index element={<SummaryTab />} />
            <Route path="encounters" element={<EncountersTab />} />
            <Route path="medications" element={<MedicationsTab />} />
            <Route path="vitals" element={<VitalsTab />} />
            <Route path="labs" element={<LabsTab />} />
          </Route>
          <Route path="/schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
