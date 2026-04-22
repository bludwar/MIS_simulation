import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

const routes = ['Oral', 'Inhaled', 'Subcutaneous', 'Intravenous', 'Topical', 'Sublingual'];
const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed', 'With meals', 'At bedtime'];

const INTERACTION_WARNINGS: Record<string, string[]> = {
  warfarin: ['NSAIDs increase bleeding risk', 'Avoid vitamin K-rich foods'],
  metformin: ['Contrast dye risk — hold before imaging'],
  insulin: ['Monitor for hypoglycemia with beta-blockers'],
};

export default function MedicationsTab() {
  const { patient } = useOutletContext<{ patient: Patient }>();
  const { medications, addMedication, discontinueMedication, setToast, role } = useEMRStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', dose: '', route: 'Oral', frequency: 'Once daily' });

  const patientMeds = medications.filter((m) => m.patientId === patient.id);
  const active = patientMeds.filter((m) => m.status === 'Active');
  const discontinued = patientMeds.filter((m) => m.status === 'Discontinued');

  function handlePrescribe(e: React.FormEvent) {
    e.preventDefault();
    const key = form.name.toLowerCase();
    const interactions = Object.entries(INTERACTION_WARNINGS)
      .filter(([drug]) => key.includes(drug))
      .flatMap(([, warns]) => warns);

    addMedication({
      id: `m${Date.now()}`,
      patientId: patient.id,
      ...form,
      prescriber: 'Dr. Provider',
      startDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
      interactions: interactions.length > 0 ? interactions : undefined,
    });
    setToast(`${form.name} prescribed.`);
    setForm({ name: '', dose: '', route: 'Oral', frequency: 'Once daily' });
    setShowForm(false);
  }

  function handleDiscontinue(id: string, name: string) {
    discontinueMedication(id);
    setToast(`${name} discontinued.`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">Medications</h2>
        {role === 'doctor' && (
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            + Prescribe
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handlePrescribe} className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <h3 className="font-medium text-gray-800">New Prescription</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Drug Name', key: 'name', required: true },
              { label: 'Dose', key: 'dose', required: true },
            ].map(({ label, key, required }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
                <input required={required} value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Route</label>
              <select value={form.route} onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))} className="w-full border rounded px-3 py-1.5 text-sm">
                {routes.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))} className="w-full border rounded px-3 py-1.5 text-sm">
                {frequencies.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Prescribe</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Active meds */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">Active Medications</div>
        {active.length === 0 ? (
          <p className="text-sm text-gray-400 p-4">None.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Drug</th>
                <th className="px-4 py-2 text-left">Dose</th>
                <th className="px-4 py-2 text-left">Route</th>
                <th className="px-4 py-2 text-left">Frequency</th>
                <th className="px-4 py-2 text-left">Prescriber</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {active.map((m) => (
                <React.Fragment key={m.id}>
                  <tr className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium text-gray-800">{m.name}</td>
                    <td className="px-4 py-2 text-gray-600">{m.dose}</td>
                    <td className="px-4 py-2 text-gray-600">{m.route}</td>
                    <td className="px-4 py-2 text-gray-600">{m.frequency}</td>
                    <td className="px-4 py-2 text-gray-500">{m.prescriber}</td>
                    <td className="px-4 py-2">
                      {role === 'doctor' && (
                        <button onClick={() => handleDiscontinue(m.id, m.name)}
                          className="text-xs text-red-500 hover:text-red-700">D/C</button>
                      )}
                    </td>
                  </tr>
                  {m.interactions && m.interactions.length > 0 && (
                    <tr className="bg-orange-50 border-b">
                      <td colSpan={6} className="px-4 py-1.5 text-xs text-orange-700">
                        ⚠️ {m.interactions.join(' | ')}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Discontinued meds */}
      {discontinued.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden opacity-60">
          <div className="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">Discontinued</div>
          <ul className="divide-y">
            {discontinued.map((m) => (
              <li key={m.id} className="px-4 py-2 text-sm text-gray-500 line-through">{m.name} — {m.dose}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
