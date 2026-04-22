import { useOutletContext } from 'react-router-dom';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

const severityColor = {
  Mild: 'bg-yellow-100 text-yellow-700',
  Moderate: 'bg-orange-100 text-orange-700',
  Severe: 'bg-red-100 text-red-700',
};

const statusColor = {
  Active: 'bg-orange-100 text-orange-700',
  Chronic: 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export default function SummaryTab() {
  const { patient } = useOutletContext<{ patient: Patient }>();
  const { medications, appointments } = useEMRStore();

  const activeMeds = medications.filter((m) => m.patientId === patient.id && m.status === 'Active');
  const upcoming = appointments
    .filter((a) => a.patientId === patient.id && a.status === 'Scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Active Problems */}
      <section className="bg-white rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Active Problem List</h2>
        {patient.problems.length === 0 ? (
          <p className="text-sm text-gray-400">No problems on record.</p>
        ) : (
          <ul className="space-y-2">
            {patient.problems.map((p) => (
              <li key={p.id} className="flex items-start justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-800">{p.description}</span>
                  <span className="text-gray-400 ml-2 font-mono text-xs">{p.icd10}</span>
                  <div className="text-xs text-gray-400">Onset: {p.onsetDate}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${statusColor[p.status]}`}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Allergies */}
      <section className="bg-white rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Allergies</h2>
        {patient.allergies.length === 0 ? (
          <p className="text-sm text-green-600 font-medium">No Known Drug Allergies (NKDA)</p>
        ) : (
          <ul className="space-y-2">
            {patient.allergies.map((a) => (
              <li key={a.substance} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-800">{a.substance}</span>
                  <span className="text-gray-500 ml-2">→ {a.reaction}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColor[a.severity]}`}>
                  {a.severity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Current Medications snapshot */}
      <section className="bg-white rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Current Medications</h2>
        {activeMeds.length === 0 ? (
          <p className="text-sm text-gray-400">No active medications.</p>
        ) : (
          <ul className="space-y-1.5">
            {activeMeds.map((m) => (
              <li key={m.id} className="text-sm">
                <span className="font-medium text-gray-800">{m.name}</span>
                <span className="text-gray-500"> {m.dose} {m.route} — {m.frequency}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming appointments */}
      <section className="bg-white rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((a) => (
              <li key={a.id} className="text-sm flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{a.date} at {a.time}</span>
                  <span className="text-gray-500"> — {a.visitType} with {a.provider}</span>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
