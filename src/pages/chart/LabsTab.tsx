import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEMRStore } from '../../store/emrStore';
import type { Patient } from '../../types';

const commonTests = [
  'CBC', 'BMP', 'CMP', 'HbA1c', 'TSH', 'Lipid Panel', 'LFTs', 'INR/PT', 'eGFR',
  'Urinalysis', 'Blood Culture', 'Urine Culture', 'Chest X-Ray', 'EKG',
];

export default function LabsTab() {
  const { patient } = useOutletContext<{ patient: Patient }>();
  const { labs, addLab, setToast, role } = useEMRStore();
  const [showForm, setShowForm] = useState(false);
  const [testName, setTestName] = useState('');

  const patientLabs = labs
    .filter((l) => l.patientId === patient.id)
    .sort((a, b) => b.orderedAt.localeCompare(a.orderedAt));

  function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    addLab({
      id: `l${Date.now()}`,
      patientId: patient.id,
      orderedAt: new Date().toISOString(),
      resultAt: '',
      orderedBy: 'Dr. Provider',
      testName,
      value: '',
      unit: '',
      refLow: 0,
      refHigh: 0,
      status: 'Pending',
    });
    setToast(`${testName} ordered.`);
    setTestName('');
    setShowForm(false);
  }

  function getFlag(value: string, refLow: number, refHigh: number) {
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    if (n < refLow) return <span className="text-blue-600 font-bold ml-1">L</span>;
    if (n > refHigh) return <span className="text-red-600 font-bold ml-1">H</span>;
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">Lab Results</h2>
        {role === 'doctor' && (
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            + Order Lab
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleOrder} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Test Name <span className="text-red-500">*</span></label>
            <input list="test-list" required value={testName} onChange={(e) => setTestName(e.target.value)}
              className="w-full border rounded px-3 py-1.5 text-sm" placeholder="Search or type test name..." />
            <datalist id="test-list">
              {commonTests.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Order</button>
          <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Test</th>
              <th className="px-4 py-2 text-left">Result</th>
              <th className="px-4 py-2 text-left">Reference</th>
              <th className="px-4 py-2 text-left">Ordered</th>
              <th className="px-4 py-2 text-left">By</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {patientLabs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No labs on record.</td></tr>
            ) : (
              patientLabs.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium text-gray-800">{l.testName}</td>
                  <td className="px-4 py-2">
                    {l.value ? (
                      <span>{l.value} {l.unit}{getFlag(l.value, l.refLow, l.refHigh)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {l.refLow !== 0 || l.refHigh !== 0 ? `${l.refLow}–${l.refHigh} ${l.unit}` : '—'}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{l.orderedAt.slice(0, 10)}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{l.orderedBy}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === 'Final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
