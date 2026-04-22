import { NavLink, useNavigate } from 'react-router-dom';
import { useEMRStore } from '../store/emrStore';
import type { Role } from '../types';

const roles: Role[] = ['receptionist', 'nurse', 'doctor'];

const roleColors: Record<Role, string> = {
  receptionist: 'bg-purple-600',
  nurse: 'bg-teal-600',
  doctor: 'bg-blue-700',
};

export default function TopNav() {
  const { role, setRole, learningMode, toggleLearningMode, resetToSeedData } = useEMRStore();
  const navigate = useNavigate();

  function handleReset() {
    resetToSeedData();
    navigate('/');
  }

  return (
    <header className="bg-gray-900 text-white flex items-center justify-between px-4 h-14 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg tracking-tight">
          HealthSim <span className="text-xs text-gray-400 font-normal">EMR Training</span>
        </span>
        <nav className="flex gap-2 text-sm">
          {[
            { to: '/', label: 'Dashboard' },
            { to: '/patients', label: 'Patients' },
            { to: '/schedule', label: 'Schedule' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-1 rounded transition ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={toggleLearningMode}
          className={`px-3 py-1 rounded border text-xs transition ${learningMode ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-300'}`}
        >
          {learningMode ? '📚 Learning ON' : '📚 Learning Mode'}
        </button>

        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-xs">Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-gray-800 border border-gray-600 text-white text-xs rounded px-2 py-1 cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${roleColors[role]}`}>
            {role}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-red-400 transition"
          title="Reset all data to demo state"
        >
          ↺ Reset Demo
        </button>
      </div>
    </header>
  );
}
