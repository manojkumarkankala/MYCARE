import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Eye, Trash2, Ban, X, User } from 'lucide-react';

export function AdminPatientsPage() {
  const { db, updateDB } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof db.patients[0] | null>(null);

  const filtered = db.patients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    updateDB(d => { d.patients = d.patients.filter(p => p.id !== id); });
    toast('Patient removed.', 'info');
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Manage Patients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View, edit, suspend, or remove patient accounts.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients by name or email..." className="input-field" style={{ paddingLeft: '2.75rem' }} />
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-left text-xs text-slate-500">
                <th className="p-4 font-semibold">Patient</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Age / Gender</th>
                <th className="p-4 font-semibold hidden md:table-cell">Blood</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Mobile</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg" />
                      <div><p className="font-semibold text-slate-900 dark:text-white">{p.name}</p><p className="text-xs text-slate-400">{p.email}</p></div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">{p.age}y · {p.gender}</td>
                  <td className="p-4 hidden md:table-cell"><Badge color="primary">{p.bloodGroup}</Badge></td>
                  <td className="p-4 hidden lg:table-cell text-slate-600 dark:text-slate-300">{p.mobile}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelected(p)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-secondary-500"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => toast('Patient suspended (demo).', 'info')} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-warning"><Ban className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-danger"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length === 0 && <Card className="text-center py-12"><p className="text-slate-400">No patients found.</p></Card>}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Patient Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-2xl" />
              <div><p className="font-display font-bold text-xl text-slate-900 dark:text-white">{selected.name}</p><p className="text-sm text-slate-500">{selected.email}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Age / Gender" value={`${selected.age}y · ${selected.gender}`} />
              <Row label="Blood Group" value={selected.bloodGroup} />
              <Row label="Height / Weight" value={`${selected.height}cm / ${selected.weight}kg`} />
              <Row label="Mobile" value={selected.mobile} />
              <Row label="Emergency Contact" value={selected.emergencyContact} />
              <Row label="Address" value={selected.address} />
              <Row label="Allergies" value={selected.allergies} />
              <Row label="Medical History" value={selected.medicalHistory} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="text-slate-400">{label}</span><span className="text-slate-700 dark:text-slate-200 text-right font-medium">{value}</span></div>;
}
