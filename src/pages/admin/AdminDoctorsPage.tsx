import { useEffect, useState } from 'react';
import { useToast } from '@/store/ToastContext';
import { profileToUser } from '@/store/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/types';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Check, X, Trash2, Eye, Star, Loader2 } from 'lucide-react';

export function AdminDoctorsPage() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'approved' | 'pending'>('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadDoctors = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'doctor');
    if (error) {
      toast(`Failed to load doctors: ${error.message}`, 'error');
    } else {
      setDoctors((data || []).map(profileToUser) as Doctor[]);
    }
    setLoading(false);
  };

  useEffect(() => { loadDoctors(); }, []);

  const filtered = doctors.filter(d => {
    const matchTab = tab === 'approved' ? d.approved : !d.approved;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const approve = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('profiles').update({ approved: true }).eq('id', id);
    setBusyId(null);
    if (error) { toast(`Could not approve: ${error.message}`, 'error'); return; }
    toast('Doctor approved successfully!', 'success');
    await loadDoctors();
  };

  const reject = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    setBusyId(null);
    if (error) { toast(`Could not reject: ${error.message}`, 'error'); return; }
    toast('Doctor application rejected.', 'info');
    setSelected(null);
    await loadDoctors();
  };

  const remove = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    setBusyId(null);
    if (error) { toast(`Could not remove: ${error.message}`, 'error'); return; }
    toast('Doctor removed.', 'info');
    setSelected(null);
    await loadDoctors();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Manage Doctors</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Approve, reject, edit, or remove doctor accounts.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          <button onClick={() => setTab('pending')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'pending' ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            Pending ({doctors.filter(d => !d.approved).length})
          </button>
          <button onClick={() => setTab('approved')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'approved' ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            Approved ({doctors.filter(d => d.approved).length})
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="input-field" style={{ paddingLeft: '2.75rem' }} />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading doctors…
        </div>
      )}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <Card key={d.id} hover>
              <div className="flex items-start gap-3">
                <img src={d.avatar} alt={d.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-slate-900 dark:text-white truncate">{d.name}</p>
                  <p className="text-sm text-secondary-500">{d.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {d.approved ? <Badge color="success">Approved</Badge> : <Badge color="warning">Pending</Badge>}
                    {d.rating > 0 && <span className="text-xs text-slate-400 flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" />{d.rating}</span>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">{d.qualification} · {d.experience}y exp</p>
              <p className="text-xs text-slate-400">{d.hospital}</p>
              <p className="text-xs text-slate-400">Reg: {d.registrationNumber}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setSelected(d)}><Eye className="w-4 h-4" /> View</Button>
                {!d.approved && <Button size="sm" variant="secondary" disabled={busyId === d.id} onClick={() => approve(d.id)}><Check className="w-4 h-4" /> Approve</Button>}
                {d.approved && <Button size="sm" variant="danger" disabled={busyId === d.id} onClick={() => remove(d.id)}><Trash2 className="w-4 h-4" /> Remove</Button>}
                {!d.approved && <Button size="sm" variant="danger" disabled={busyId === d.id} onClick={() => reject(d.id)}><X className="w-4 h-4" /> Reject</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && <Card className="text-center py-12"><p className="text-slate-400">No {tab} doctors.</p></Card>}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="card max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Doctor Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-2xl" />
              <div>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{selected.name}</p>
                <p className="text-sm text-secondary-500">{selected.specialization}</p>
                <Badge color={selected.approved ? 'success' : 'warning'}>{selected.approved ? 'Approved' : 'Pending'}</Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Qualification" value={selected.qualification} />
              <Row label="Hospital" value={selected.hospital} />
              <Row label="Experience" value={`${selected.experience} years`} />
              <Row label="Reg. Number" value={selected.registrationNumber} />
              <Row label="Clinic Address" value={selected.clinicAddress} />
              <Row label="Phone" value={selected.phone} />
              <Row label="Email" value={selected.email} />
              <Row label="Consultation Fee" value={`₹${selected.consultationFee}`} />
              <Row label="Timings" value={selected.timings} />
            </div>
            <div className="flex gap-2 mt-4">
              {!selected.approved && <Button className="flex-1" disabled={busyId === selected.id} onClick={() => approve(selected.id)}><Check className="w-4 h-4" /> Approve</Button>}
              <Button variant="danger" disabled={busyId === selected.id} onClick={() => selected.approved ? remove(selected.id) : reject(selected.id)}><Trash2 className="w-4 h-4" /> {selected.approved ? 'Remove' : 'Reject'}</Button>
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
