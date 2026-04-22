import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

const visitTypes = ['Office Visit', 'Urgent Care', 'Telehealth', 'Annual Wellness', 'Follow-up', 'Procedure'];

export default function EncountersTab() {
  const { patient } = useOutletContext<{ patient: Patient }>();
  const { encounters, addEncounter, updateEncounter, setToast, role } = useEMRStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newReason, setNewReason] = useState('');
  const [newType, setNewType] = useState('Office Visit');

  const patientEncounters = encounters
    .filter((e) => e.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const enc = patientEncounters.find((e) => e.id === selected);

  function handleCreate() {
    if (!newReason.trim()) return;
    const id = `e${Date.now()}`;
    addEncounter({
      id, patientId: patient.id,
      date: new Date().toISOString().slice(0, 10),
      provider: 'Dr. Provider', visitType: newType,
      reasonForVisit: newReason,
      subjective: '', objective: '', assessment: '', plan: '',
      status: 'Open', icd10Codes: [], cptCodes: [],
    });
    setShowNew(false);
    setNewReason('');
    setSelected(id);
    setToast('New encounter created.');
  }

  function handleSign(id: string) {
    updateEncounter(id, { status: 'Signed' });
    setToast('Encounter signed and locked.');
  }

  return (
    <div className="flex gap-4">
      {/* Encounter list */}
      <div className="w-64 shrink-0 space-y-2">
        <button
          onClick={() => setShowNew(true)}
          disabled={role === 'receptionist'}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + New Encounter
        </button>
        {patientEncounters.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e.id)}
            className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${selected === e.id ? 'border-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="font-medium text-gray-800">{e.date}</div>
            <div className="text-gray-500 text-xs">{e.visitType}</div>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${e.status === 'Signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {e.status}
            </span>
          </button>
        ))}
        {patientEncounters.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No encounters.</p>
        )}
      </div>

      {/* Encounter detail / editor */}
      <div className="flex-1">
        {showNew && (
          <div className="bg-white border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">New Encounter</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Visit Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className="border rounded px-3 py-1.5 text-sm w-full">
                {visitTypes.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Reason for Visit <span className="text-red-500">*</span></label>
              <input value={newReason} onChange={(e) => setNewReason(e.target.value)} className="border rounded px-3 py-1.5 text-sm w-full" placeholder="Chief complaint..." />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={!newReason.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Create</button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        {enc && !showNew && (
          <div className="bg-white border rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{enc.date} — {enc.visitType}</h3>
                <p className="text-sm text-gray-500">Chief complaint: {enc.reasonForVisit}</p>
              </div>
              {enc.status === 'Open' && role === 'doctor' && (
                <button onClick={() => handleSign(enc.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  ✓ Sign & Lock
                </button>
              )}
              {enc.status === 'Signed' && (
                <span className="text-green-600 text-sm font-medium bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                  🔒 Signed
                </span>
              )}
            </div>

            {(['subjective', 'objective', 'assessment', 'plan'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field}</label>
                <textarea
                  rows={3}
                  disabled={enc.status === 'Signed' || role !== 'doctor'}
                  value={enc[field]}
                  onChange={(e) => updateEncounter(enc.id, { [field]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder={enc.status === 'Signed' ? '' : `Enter ${field}...`}
                />
              </div>
            ))}

            {enc.icd10Codes.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">ICD-10: </span>
                {enc.icd10Codes.map((c) => (
                  <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded mr-1">{c}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {!enc && !showNew && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Select an encounter or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}
