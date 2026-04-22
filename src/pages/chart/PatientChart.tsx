import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

const tabs = [
  { label: 'Summary', path: '' },
  { label: 'Encounters', path: 'encounters' },
  { label: 'Medications', path: 'medications' },
  { label: 'Vitals', path: 'vitals' },
  { label: 'Labs', path: 'labs' },
];

export default function PatientChart() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients } = useEMRStore();

  const patient: Patient | undefined = patients.find((p) => p.id === patientId);
  if (!patient) {
    return (
      <div className="text-center py-20 text-gray-400">
        Patient not found. <button onClick={() => navigate('/patients')} className="text-blue-600 hover:underline">Back to roster</button>
      </div>
    );
  }

  const today = new Date();
  const birth = new Date(patient.dob);
  const age = today.getFullYear() - birth.getFullYear() -
    (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Patient banner */}
      <div className="bg-blue-700 text-white rounded-xl px-5 py-4 flex flex-wrap gap-6 items-center">
        <div>
          <div className="text-xl font-bold">{patient.lastName}, {patient.firstName}</div>
          <div className="text-blue-200 text-sm">{patient.dob} &bull; {age} y/o {patient.gender} &bull; {patient.mrn}</div>
        </div>
        <div className="text-sm text-blue-100">
          📞 {patient.phone} &bull; {patient.insurance}
        </div>
        {patient.allergies.length > 0 && (
          <div className="ml-auto bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            ⚠️ ALLERGIES: {patient.allergies.map((a) => a.substance).join(', ')}
          </div>
        )}
        {patient.allergies.length === 0 && (
          <div className="ml-auto bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            ✓ NKDA
          </div>
        )}
      </div>

      {/* Chart tabs */}
      <div className="border-b flex gap-1">
        {tabs.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === ''}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Outlet context={{ patient }} />
    </div>
  );
}
