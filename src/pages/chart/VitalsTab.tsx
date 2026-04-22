import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

export default function VitalsTab() {
  const { patient } = useOutletContext<{ patient: Patient }>();
  const { vitals, addVital, setToast, role } = useEMRStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    systolic: '', diastolic: '', heartRate: '', respiratoryRate: '',
    temperature: '', o2Sat: '', heightCm: '', weightKg: '',
  });

  const patientVitals = vitals
    .filter((v) => v.patientId === patient.id)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addVital({
      id: `v${Date.now()}`,
      patientId: patient.id,
      recordedAt: new Date().toISOString(),
      recordedBy: 'Nurse (Student)',
      systolic: +form.systolic,
      diastolic: +form.diastolic,
      heartRate: +form.heartRate,
      respiratoryRate: +form.respiratoryRate,
      temperature: +form.temperature,
      o2Sat: +form.o2Sat,
      heightCm: +form.heightCm,
      weightKg: +form.weightKg,
    });
    setToast('Vitals recorded.');
    setForm({ systolic: '', diastolic: '', heartRate: '', respiratoryRate: '', temperature: '', o2Sat: '', heightCm: '', weightKg: '' });
    setShowForm(false);
  }

  const trendData = patientVitals.map((v) => ({
    date: v.recordedAt.slice(0, 10),
    'Systolic BP': v.systolic,
    'Heart Rate': v.heartRate,
  }));

  const fields = [
    { label: 'Systolic BP', key: 'systolic', unit: 'mmHg', min: 60, max: 300 },
    { label: 'Diastolic BP', key: 'diastolic', unit: 'mmHg', min: 30, max: 200 },
    { label: 'Heart Rate', key: 'heartRate', unit: 'bpm', min: 20, max: 300 },
    { label: 'Resp Rate', key: 'respiratoryRate', unit: '/min', min: 4, max: 60 },
    { label: 'Temperature', key: 'temperature', unit: '°C', min: 30, max: 45 },
    { label: 'O₂ Sat', key: 'o2Sat', unit: '%', min: 50, max: 100 },
    { label: 'Height', key: 'heightCm', unit: 'cm', min: 30, max: 250 },
    { label: 'Weight', key: 'weightKg', unit: 'kg', min: 1, max: 500 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">Vitals</h2>
        {(role === 'nurse' || role === 'doctor') && (
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            + Record Vitals
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-teal-50 border border-teal-200 rounded-xl p-4 grid grid-cols-4 gap-3">
          {fields.map(({ label, key, unit, min, max }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{label} ({unit})</label>
              <input required type="number" step="0.1" min={min} max={max} value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          ))}
          <div className="col-span-4 flex gap-2 mt-1">
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Save Vitals</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Vitals table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Date/Time</th>
              <th className="px-4 py-2 text-left">BP</th>
              <th className="px-4 py-2 text-left">HR</th>
              <th className="px-4 py-2 text-left">RR</th>
              <th className="px-4 py-2 text-left">Temp</th>
              <th className="px-4 py-2 text-left">O₂</th>
              <th className="px-4 py-2 text-left">BMI</th>
              <th className="px-4 py-2 text-left">By</th>
            </tr>
          </thead>
          <tbody>
            {patientVitals.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No vitals recorded.</td></tr>
            ) : (
              [...patientVitals].reverse().map((v) => {
                const bmi = (v.weightKg / ((v.heightCm / 100) ** 2)).toFixed(1);
                return (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="px-4 py-2 text-gray-600">{v.recordedAt.replace('T', ' ').slice(0, 16)}</td>
                    <td className="px-4 py-2 font-medium">{v.systolic}/{v.diastolic}</td>
                    <td className="px-4 py-2">{v.heartRate}</td>
                    <td className="px-4 py-2">{v.respiratoryRate}</td>
                    <td className="px-4 py-2">{v.temperature}°C</td>
                    <td className="px-4 py-2">{v.o2Sat}%</td>
                    <td className="px-4 py-2">{bmi}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{v.recordedBy}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Trend chart */}
      {trendData.length > 1 && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="Systolic BP" stroke="#3b82f6" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Heart Rate" stroke="#14b8a6" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
