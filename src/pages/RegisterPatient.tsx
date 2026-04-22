import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEMRStore } from '../store/emrStore';
import type { Patient } from '../types';

export default function RegisterPatient() {
  const { addPatient, setToast } = useEMRStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Female' as Patient['gender'],
    phone: '', email: '', insurance: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `p${Date.now()}`;
    addPatient({
      id,
      mrn: `MRN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...form,
      allergies: [],
      problems: [],
    });
    setToast(`Patient ${form.firstName} ${form.lastName} registered.`);
    navigate(`/patients/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Patient</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'First Name', key: 'firstName', required: true },
            { label: 'Last Name', key: 'lastName', required: true },
            { label: 'Date of Birth', key: 'dob', type: 'date', required: true },
            { label: 'Phone', key: 'phone' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Insurance', key: 'insurance', required: true },
          ].map(({ label, key, type = 'text', required }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
              <input
                type={type}
                required={required}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gender<span className="text-red-500 ml-0.5">*</span></label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Patient['gender'] }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Register Patient
          </button>
          <button type="button" onClick={() => navigate('/patients')} className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
