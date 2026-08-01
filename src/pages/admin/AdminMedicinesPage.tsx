import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Medicine } from '@/types';
import { Pill, Plus, Edit3, Trash2, X, Save, DollarSign } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export function AdminMedicinesPage() {
  const { db, updateDB } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState<Partial<Medicine>>({
    name: '', brand: '', composition: '', uses: '', sideEffects: '', warnings: '',
    dosage: '', price: 0, manufacturer: '', prescriptionRequired: false, category: 'General',
    image: 'https://images.unsplash.com/photo-1584308666744-24d8c2c2c1c2?w=400',
  });

  const openNew = () => { setEditing(null); setForm({ name: '', brand: '', composition: '', uses: '', sideEffects: '', warnings: '', dosage: '', price: 0, manufacturer: '', prescriptionRequired: false, category: 'General', image: 'https://images.unsplash.com/photo-1584308666744-24d8c2c2c1c2?w=400' }); setShowForm(true); };
  const openEdit = (m: Medicine) => { setEditing(m); setForm(m); setShowForm(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast('Medicine name is required.', 'warning'); return; }
    if (editing) {
      updateDB(d => { const i = d.medicines.findIndex(x => x.id === editing.id); if (i >= 0) d.medicines[i] = { ...editing, ...form } as Medicine; });
      toast('Medicine updated.', 'success');
    } else {
      const newM: Medicine = { id: `med-${Date.now()}`, ...form as Medicine };
      updateDB(d => { d.medicines.push(newM); });
      toast('Medicine added.', 'success');
    }
    setShowForm(false); setEditing(null);
  };

  const handleDelete = (id: string) => { updateDB(d => { d.medicines = d.medicines.filter(m => m.id !== id); }); toast('Medicine removed.', 'info'); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Manage Medicines</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add, edit, and remove medicines from the database.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Add Medicine</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.medicines.map(m => (
          <Card key={m.id} hover>
            <div className="flex items-start gap-3">
              <img src={m.image} alt={m.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-slate-900 dark:text-white truncate">{m.name}</p>
                <p className="text-sm text-secondary-500">{m.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="primary">{m.category}</Badge>
                  {m.prescriptionRequired && <Badge color="danger">Rx</Badge>}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">{m.composition}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{m.price} · {m.manufacturer}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Edit3 className="w-4 h-4" /> Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="card max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">{editing ? 'Edit Medicine' : 'Add Medicine'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Medicine name" className="input-field" required />
                <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="input-field" />
              </div>
              <input value={form.composition} onChange={e => setForm({ ...form, composition: e.target.value })} placeholder="Composition" className="input-field" />
              <textarea value={form.uses} onChange={e => setForm({ ...form, uses: e.target.value })} placeholder="Uses" rows={2} className="input-field resize-none" />
              <textarea value={form.sideEffects} onChange={e => setForm({ ...form, sideEffects: e.target.value })} placeholder="Side effects" rows={2} className="input-field resize-none" />
              <textarea value={form.warnings} onChange={e => setForm({ ...form, warnings: e.target.value })} placeholder="Warnings" rows={2} className="input-field resize-none" />
              <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="Dosage" className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price (₹)" className="input-field" />
                <input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} placeholder="Manufacturer" className="input-field" />
              </div>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
              <div className="flex justify-center">
                <ImageUpload value={form.image} onChange={(img) => setForm({ ...form, image: img })} label="Medicine Image" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.prescriptionRequired} onChange={e => setForm({ ...form, prescriptionRequired: e.target.checked })} className="rounded accent-secondary-500" />
                Prescription required
              </label>
              <Button type="submit" className="w-full"><Save className="w-5 h-5" /> {editing ? 'Save Changes' : 'Add Medicine'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
