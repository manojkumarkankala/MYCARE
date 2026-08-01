import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Search, FileText, Calendar, Phone, X } from 'lucide-react';

export function DoctorPatientsPage() {
  const { user, db } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof db.patients[0] | null>(null);

  if (!user || user.role !== 'doctor') return null;
  const appointments = db.appointments.filter(a => a.doctorId === user.id);
  const patientIds = [...new Set(appointments.map(a => a.patientId))];
  const patients = db.patients.filter(p => patientIds.includes(p.id));
  const filtered = patients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Patients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View your patient list and their medical history.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="input-field" style={{ paddingLeft: '2.75rem' }} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const pAppts = appointments.filter(a => a.patientId === p.id);
          return (
            <Card key={p.id} hover>
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.age} yrs · {p.gender} · {p.bloodGroup}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{pAppts.length} visits</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{p.mobile}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => setSelected(p)}>
                <FileText className="w-4 h-4" /> View History
              </Button>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-slate-400">No patients found.</p>
        </Card>
      )}

      {/* Patient detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="card max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Patient Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-2xl" />
              <div>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{selected.name}</p>
                <p className="text-sm text-slate-500">{selected.age} yrs · {selected.gender}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Blood Group" value={selected.bloodGroup} />
              <Row label="Height / Weight" value={`${selected.height}cm / ${selected.weight}kg`} />
              <Row label="Allergies" value={selected.allergies} />
              <Row label="Medical History" value={selected.medicalHistory} />
              <Row label="Emergency Contact" value={selected.emergencyContact} />
              <Row label="Address" value={selected.address} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Appointment History</p>
              {appointments.filter(a => a.patientId === selected.id).map(a => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-1">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{a.reason}</span>
                  <Badge color={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.date}</Badge>
                </div>
              ))}
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
