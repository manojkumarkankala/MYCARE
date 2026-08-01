import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { HealthUpdate } from '@/types';
import {
  Megaphone, Plus, Edit3, Trash2, X, Save, Calendar, Tag,
} from 'lucide-react';

export function DoctorUpdatesPage() {
  const { user, db, updateDB } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState<HealthUpdate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', whySuggested: '', category: 'General', coverImage: '' });

  if (!user || user.role !== 'doctor') return null;
  const myUpdates = db.healthUpdates.filter(u => u.doctorId === user.id);

  const openNew = () => {
    setForm({ title: '', description: '', whySuggested: '', category: 'General', coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (u: HealthUpdate) => {
    setForm({ title: u.title, description: u.description, whySuggested: u.whySuggested, category: u.category, coverImage: u.coverImage });
    setEditing(u);
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast('Title and description are required.', 'warning'); return; }
    if (editing) {
      updateDB(d => { const u = d.healthUpdates.find(x => x.id === editing.id); if (u) { u.title = form.title; u.description = form.description; u.whySuggested = form.whySuggested; u.category = form.category; u.coverImage = form.coverImage; } });
      toast('Update saved.', 'success');
    } else {
      const newU: HealthUpdate = {
        id: `hu-${Date.now()}`, doctorId: user.id, doctorName: user.name,
        title: form.title, coverImage: form.coverImage, description: form.description,
        whySuggested: form.whySuggested, category: form.category, date: new Date().toISOString().slice(0, 10),
      };
      updateDB(d => { d.healthUpdates.unshift(newU); });
      toast('Health update published to all patients!', 'success');
    }
    setShowForm(false); setEditing(null);
  };

  const handleDelete = (id: string) => {
    updateDB(d => { d.healthUpdates = d.healthUpdates.filter(u => u.id !== id); });
    toast('Update deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Health Updates</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Publish health articles visible to all patients.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> New Update</Button>
      </div>

      {myUpdates.length === 0 ? (
        <Card className="text-center py-12">
          <Megaphone className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-slate-400">No updates published yet.</p>
          <Button className="mt-4" onClick={openNew}>Publish your first update</Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myUpdates.map(u => (
            <Card key={u.id} hover className="!p-0 overflow-hidden">
              <div className="h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={u.coverImage} alt={u.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge color="secondary">{u.category}</Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{u.date}</span>
                </div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white line-clamp-2">{u.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{u.description}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(u)}><Edit3 className="w-4 h-4" /> Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="card max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">{editing ? 'Edit Update' : 'New Health Update'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field appearance-none cursor-pointer" style={{ paddingLeft: '2.75rem' }}>
                    {['General', 'Cardiology', 'Pediatrics', 'Mental Health', 'Nutrition', 'Fitness', 'Preventive Care'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Write your health article..." rows={5} className="input-field resize-none" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Why Suggested</label>
                <input value={form.whySuggested} onChange={e => setForm({ ...form, whySuggested: e.target.value })} placeholder="Who should read this and why" className="input-field" />
              </div>
              <Button type="submit" className="w-full"><Save className="w-5 h-5" /> {editing ? 'Save Changes' : 'Publish Update'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
