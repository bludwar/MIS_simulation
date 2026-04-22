import { Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Toast from '../components/Toast';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <TopNav />
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toast />
      <div className="text-center text-xs text-red-600 bg-red-50 border-t border-red-200 py-1 shrink-0">
        ⚠️ Training Simulation — Not Real Patient Data. For educational use only.
      </div>
    </div>
  );
}
