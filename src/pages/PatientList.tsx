import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEMRStore } from '../store/emrStore';

export default function PatientList() {
  const { patients, learningMode } = useEMRStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter((p) =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q)
    );
  }, [patients, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Patient Roster</h1>
        <button
          onClick={() => navigate('/patients/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + Register New Patient
        </button>
      </div>

      {learningMode && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg p-3">
          💡 <strong>Tip:</strong> Search for a patient by name or MRN, then click their row to open their chart.
        </div>
      )}

      <input
        type="text"
        placeholder="Search by name or MRN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-3 text-left">MRN</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">DOB</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Insurance</th>
              <th className="px-4 py-3 text-left">Allergies</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No patients found.</td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-b last:border-0 hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-mono text-gray-500">{p.mrn}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.lastName}, {p.firstName}</td>
                  <td className="px-4 py-3 text-gray-600">{p.dob}</td>
                  <td className="px-4 py-3 text-gray-600">{p.gender}</td>
                  <td className="px-4 py-3 text-gray-600">{p.insurance}</td>
                  <td className="px-4 py-3">
                    {p.allergies.length > 0 ? (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {p.allergies.length} allerg{p.allergies.length > 1 ? 'ies' : 'y'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">NKDA</span>
                    )}
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
