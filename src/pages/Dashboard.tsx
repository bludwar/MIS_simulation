import { useEMRStore } from '../store/emrStore';
import { useNavigate } from 'react-router-dom';

const scenarios = [
  {
    title: 'Check-in & Vitals',
    description: 'Check in a patient, record their vitals, and prepare the chart for the provider.',
    steps: ['Go to Patients', 'Open a patient chart', 'Click Vitals tab', 'Record new vitals'],
    role: 'nurse',
  },
  {
    title: 'Complete a SOAP Note',
    description: 'Open an existing encounter, complete the SOAP note, and sign it.',
    steps: ['Go to Patients', 'Open patient chart', 'Click Encounters tab', 'Open the open encounter', 'Fill in SOAP fields', 'Click Sign & Lock'],
    role: 'doctor',
  },
  {
    title: 'Prescribe a Medication',
    description: 'Review a patient\'s active medications and prescribe a new one, noting any interactions.',
    steps: ['Open a patient chart', 'Click Medications tab', 'Click Prescribe', 'Fill in details and save'],
    role: 'doctor',
  },
  {
    title: 'Register a New Patient',
    description: 'Register a brand-new patient with demographics and insurance information.',
    steps: ['Go to Patients', 'Click Register New Patient', 'Fill in all required fields', 'Save'],
    role: 'receptionist',
  },
  {
    title: 'Schedule an Appointment',
    description: 'Book a follow-up appointment for an existing patient.',
    steps: ['Go to Schedule', 'Click an open slot', 'Search for patient', 'Select visit type and save'],
    role: 'receptionist',
  },
];

const roleColors: Record<string, string> = {
  receptionist: 'bg-purple-100 text-purple-700',
  nurse: 'bg-teal-100 text-teal-700',
  doctor: 'bg-blue-100 text-blue-700',
};

export default function Dashboard() {
  const { patients, appointments, encounters, learningMode, role, setRole } = useEMRStore();
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter((a) => a.status === 'Scheduled' && a.date >= today).length;
  const openEncounters = encounters.filter((e) => e.status === 'Open').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome to HealthSim EMR — your clinical training environment.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Patients', value: patients.length, color: 'bg-blue-50 border-blue-200' },
          { label: 'Upcoming Appointments', value: todayAppts, color: 'bg-teal-50 border-teal-200' },
          { label: 'Open Encounters', value: openEncounters, color: 'bg-orange-50 border-orange-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border p-5 ${color}`}>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Learning mode scenarios */}
      {learningMode && (
        <div>
          <h2 className="text-lg font-semibold mb-3">📚 Learning Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((s) => (
              <div key={s.title} className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{s.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[s.role]}`}>
                    {s.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{s.description}</p>
                <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                  {s.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <button
                  onClick={() => {
                    setRole(s.role as typeof role);
                    navigate('/patients');
                  }}
                  className="mt-3 text-xs text-blue-600 hover:underline"
                >
                  Start as {s.role} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex gap-3">
        <button onClick={() => navigate('/patients')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Patient Roster →
        </button>
        <button onClick={() => navigate('/schedule')} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
          View Schedule →
        </button>
        <button onClick={() => navigate('/patients/new')} className="px-4 py-2 bg-gray-100 border text-gray-700 rounded-lg text-sm hover:bg-gray-200">
          + Register Patient
        </button>
      </div>
    </div>
  );
}
