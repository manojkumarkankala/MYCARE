import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { MedicalInstrument } from '@/types';
import { Package, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export function AdminInstrumentsPage() {
  const { db, updateDB } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MedicalInstrument | null>(null);
  const [form, setForm] = useState<Partial<MedicalInstrument>>({
    name: '', category: '', description: '', uses: '', howToUse: [], precautions: '',
    cleaningGuide: '', maintenance: '', image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600',
  });
  const [stepsText, setStepsText] = useState('');

  const openNew = () => { setEditing(null); setForm({ name: '', category: '', description: '', uses: '', howToUse: [], precautions: '', cleaningGuide: '', maintenance: '', image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600' }); setStepsText(''); setShowForm(true); };
  const openEdit = (i: MedicalInstrument) => { setEditing(i); setForm(i); setStepsText(i.howToUse.join('\n')); setShowForm(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast('Instrument name is required.', 'warning'); return; }
    const howToUse = stepsText.split('\n').filter(s => s.trim());
    if (editing) {
      updateDB(d => { const i = d.instruments.findIndex(x => x.id === editing.id); if (i >= 0) d.instruments[i] = { ...editing, ...form, howToUse } as MedicalInstrument; });
      toast('Instrument updated.', 'success');
    } else {
      const newI: MedicalInstrument = { id: `inst-${Date.now()}`, ...form, howToUse } as MedicalInstrument;
      updateDB(d => { d.instruments.push(newI); });
      toast('Instrument added.', 'success');
    }
    setShowForm(false); setEditing(null);
  };

  const handleDelete = (id: string) => { updateDB(d => { d.instruments = d.instruments.filter(i => i.id !== id); }); toast('Instrument removed.', 'info'); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Manage Instruments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add, edit, and remove medical instruments from the catalog.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Add Instrument</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.instruments.map(inst => (
          <Card key={inst.id} hover className="!p-0 overflow-hidden">
            <div className="h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <Badge color="primary">{inst.category}</Badge>
              <p className="font-display font-bold text-slate-900 dark:text-white mt-2">{inst.name}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inst.description}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(inst)}><Edit3 className="w-4 h-4" /> Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(inst.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="card max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">{editing ? 'Edit Instrument' : 'Add Instrument'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Instrument name" className="input-field" required />
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
              </div>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="input-field resize-none" />
              <textarea value={form.uses} onChange={e => setForm({ ...form, uses: e.target.value })} placeholder="Uses" rows={2} className="input-field resize-none" />
              <textarea value={stepsText} onChange={e => setStepsText(e.target.value)} placeholder="How to use (one step per line)" rows={4} className="input-field resize-none" />
              <textarea value={form.precautions} onChange={e => setForm({ ...form, precautions: e.target.value })} placeholder="Precautions" rows={2} className="input-field resize-none" />
              <textarea value={form.cleaningGuide} onChange={e => setForm({ ...form, cleaningGuide: e.target.value })} placeholder="Cleaning guide" rows={2} className="input-field resize-none" />
              <textarea value={form.maintenance} onChange={e => setForm({ ...form, maintenance: e.target.value })} placeholder="Maintenance" rows={2} className="input-field resize-none" />
              <div className="flex justify-center">
                <ImageUpload value={form.image} onChange={(img) => setForm({ ...form, image: img })} label="Instrument Image" />
              </div>
              <Button type="submit" className="w-full"><Save className="w-5 h-5" /> {editing ? 'Save Changes' : 'Add Instrument'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
