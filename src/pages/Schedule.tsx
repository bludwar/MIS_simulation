import { useState, useMemo } from 'react';
import { useEMRStore } from '../store/emrStore';
import type { Appointment } from '../types';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const VISIT_TYPES = ['Office Visit', 'Follow-up', 'Annual Wellness', 'Urgent Care', 'Telehealth', 'Lab Review'];
const PROVIDERS = ['Dr. Williams', 'Dr. Kim', 'Dr. Patel', 'Dr. Johnson', 'Dr. Singh'];
const STATUS_COLORS: Record<Appointment['status'], string> = {
  'Scheduled': 'bg-blue-100 text-blue-700',
  'Checked-In': 'bg-teal-100 text-teal-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

function getWeekDates(offset = 0) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Schedule() {
  const { appointments, patients, addAppointment, updateAppointmentStatus, setToast, role } = useEMRStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [modal, setModal] = useState<{ date: string; time: string } | null>(null);
  const [form, setForm] = useState({ patientSearch: '', patientId: '', visitType: 'Office Visit', provider: PROVIDERS[0] });

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const apptMap = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      const key = `${a.date}-${a.time}`;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return map;
  }, [appointments]);

  const filteredPatients = useMemo(
    () => patients.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.mrn}`.toLowerCase().includes(form.patientSearch.toLowerCase())
    ),
    [patients, form.patientSearch]
  );

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!modal || !form.patientId) return;
    const patient = patients.find((p) => p.id === form.patientId);
    addAppointment({
      id: `a${Date.now()}`,
      patientId: form.patientId,
      provider: form.provider,
      date: modal.date,
      time: modal.time,
      visitType: form.visitType,
      status: 'Scheduled',
    });
    setToast(`Appointment booked${patient ? ` for ${patient.firstName} ${patient.lastName}` : ''}.`);
    setModal(null);
    setForm({ patientSearch: '', patientId: '', visitType: 'Office Visit', provider: PROVIDERS[0] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <div className="flex gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">← Prev</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">Today</button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">Next →</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-3 py-2 text-left w-20 text-gray-500 text-xs uppercase">Time</th>
              {weekDates.map((date) => (
                <th key={date.toISOString()} className="px-3 py-2 text-center text-xs text-gray-600 border-l">
                  <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-gray-400">{date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour} className="border-b last:border-0">
                <td className="px-3 py-2 text-xs text-gray-400 align-top">{hour}</td>
                {weekDates.map((date) => {
                  const dateStr = date.toLocaleDateString('en-CA');
                  const key = `${dateStr}-${hour}`;
                  const slotAppts = apptMap[key] || [];
                  return (
                    <td key={key} className="border-l px-2 py-1.5 align-top min-w-[110px]">
                      {slotAppts.map((a) => {
                        const p = patients.find((pt) => pt.id === a.patientId);
                        return (
                          <div key={a.id} className={`text-xs rounded px-1.5 py-1 mb-1 ${STATUS_COLORS[a.status]}`}>
                            <div className="font-medium truncate">{p?.lastName}, {p?.firstName?.[0]}.</div>
                            <div className="opacity-75">{a.visitType}</div>
                            {(role === 'receptionist' || role === 'nurse') && a.status === 'Scheduled' && (
                              <button
                                onClick={() => { updateAppointmentStatus(a.id, 'Checked-In'); setToast('Patient checked in.'); }}
                                className="mt-0.5 text-xs underline"
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {slotAppts.length === 0 && (role === 'receptionist' || role === 'doctor') && (
                        <button
                          onClick={() => setModal({ date: dateStr, time: hour })}
                          className="w-full h-8 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded text-xs transition"
                        >
                          + Book
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Book modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleBook} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-bold text-gray-800">Book Appointment — {modal.date} at {modal.time}</h2>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Patient <span className="text-red-500">*</span></label>
              <input value={form.patientSearch} onChange={(e) => setForm((f) => ({ ...f, patientSearch: e.target.value, patientId: '' }))}
                className="w-full border rounded px-3 py-1.5 text-sm mb-1" placeholder="Search patient..." />
              {form.patientSearch && !form.patientId && (
                <ul className="border rounded-lg overflow-hidden max-h-32 overflow-y-auto">
                  {filteredPatients.slice(0, 8).map((p) => (
                    <li key={p.id}>
                      <button type="button"
                        onClick={() => setForm((f) => ({ ...f, patientId: p.id, patientSearch: `${p.firstName} ${p.lastName}` }))}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50">
                        {p.lastName}, {p.firstName} — {p.mrn}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {[
              { label: 'Visit Type', key: 'visitType', options: VISIT_TYPES },
              { label: 'Provider', key: 'provider', options: PROVIDERS },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <select value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border rounded px-3 py-1.5 text-sm">
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={!form.patientId}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                Book
              </button>
              <button type="button" onClick={() => setModal(null)} className="px-5 py-2 border rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
