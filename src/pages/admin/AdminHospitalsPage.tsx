import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import {
  Building2, Plus, Edit3, Trash2, X, Save, MapPin, Phone, Star, Clock,
  Stethoscope, Pill, FlaskConical, Navigation,
} from 'lucide-react';
import type { Hospital } from '@/types';

const typeIcons = { Hospital: Building2, Clinic: Stethoscope, Pharmacy: Pill, Laboratory: FlaskConical };
const typeColors = {
  Hospital: 'bg-red-50 dark:bg-red-900/30 text-danger',
  Clinic: 'bg-primary-50 dark:bg-primary-900/30 text-primary-800',
  Pharmacy: 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600',
  Laboratory: 'bg-accent-50 dark:bg-accent-900/30 text-accent-500',
};

const emptyForm = {
  name: '', type: 'Hospital' as Hospital['type'], image: '',
  address: '', phone: '', distance: '', rating: 4.5, openHours: '', lat: 17.385, lng: 78.4867,
};

export function AdminHospitalsPage() {
  const { db, updateDB } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const hospitals = db.hospitals;

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      toast('Please fill name, location, and mobile number', 'error');
      return;
    }
    if (editingId) {
      updateDB(d => {
        const idx = d.hospitals.findIndex(h => h.id === editingId);
        if (idx >= 0) d.hospitals[idx] = { ...d.hospitals[idx], ...form };
      });
      toast('Hospital updated successfully', 'success');
    } else {
      updateDB(d => {
        d.hospitals.unshift({ id: `hosp-${Date.now()}`, ...form });
      });
      toast('Hospital added successfully', 'success');
    }
    resetForm();
  };

  const handleEdit = (h: Hospital) => {
    setEditingId(h.id);
    setForm({ name: h.name, type: h.type, image: h.image, address: h.address, phone: h.phone, distance: h.distance, rating: h.rating, openHours: h.openHours, lat: h.lat, lng: h.lng });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    updateDB(d => { d.hospitals = d.hospitals.filter(h => h.id !== id); });
    toast('Hospital removed', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Nearby Healthcare Facilities</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add and manage hospitals, clinics, pharmacies, and labs.</p>
        </div>
        <Button onClick={() => { if (showForm) resetForm(); else { setForm(emptyForm); setEditingId(null); setShowForm(true); } }}>
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Facility'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            {editingId ? 'Edit Facility' : 'Add New Facility'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <ImageUpload value={form.image} onChange={(img) => setForm({ ...form, image: img })} label="Facility Image" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Facility Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. MYCARE Heart Institute" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Hospital['type'] })} className="input-field">
                  <option>Hospital</option>
                  <option>Clinic</option>
                  <option>Pharmacy</option>
                  <option>Laboratory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Location / Address *</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, district, city" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Number *</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91..." className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Distance</label>
                <input value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="e.g. 1.2 km" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Open Hours</label>
                <input value={form.openHours} onChange={e => setForm({ ...form, openHours: e.target.value })} placeholder="e.g. 24/7 or 9 AM - 9 PM" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} className="input-field" />
              </div>
            </div>
            <Button type="submit" className="w-full"><Save className="w-5 h-5" />{editingId ? 'Update Facility' : 'Add Facility'}</Button>
          </form>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {hospitals.map(h => {
          const Icon = typeIcons[h.type];
          return (
            <Card key={h.id} hover>
              <div className="flex items-start gap-4">
                {h.image ? (
                  <img src={h.image} alt={h.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${typeColors[h.type]}`}>
                    <Icon className="w-9 h-9" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display font-bold text-slate-900 dark:text-white">{h.name}</p>
                    <Badge color="neutral">{h.distance}</Badge>
                  </div>
                  <p className="text-sm text-secondary-500 font-medium">{h.type}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{h.address}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" />{h.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{h.openHours}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{h.phone}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(h)}><Edit3 className="w-4 h-4" /> Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(h.id)}><Trash2 className="w-4 h-4" /> Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {hospitals.length === 0 && (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-400">No facilities yet. Click "Add Facility" to create one.</p>
        </Card>
      )}
    </div>
  );
}
