import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MapPin, Building2, Pill, FlaskConical, Stethoscope, Navigation,
  Phone, Clock, Star, Search,
} from 'lucide-react';

const facilities = [
  { id: 1, name: 'MYCARE Heart Institute', type: 'Hospital', distance: '1.2 km', rating: 4.9, address: '4th Avenue, Medical District', phone: '+918012345678', open: '24/7', lat: 17.385, lng: 78.4867 },
  { id: 2, name: 'City Care Clinic', type: 'Clinic', distance: '0.8 km', rating: 4.5, address: 'Park Road, Central Plaza', phone: '+918012345679', open: '9 AM - 9 PM', lat: 17.386, lng: 78.4870 },
  { id: 3, name: 'MedPlus Pharmacy', type: 'Pharmacy', distance: '0.5 km', rating: 4.7, address: 'Main Street, Block A', phone: '+918012345680', open: '8 AM - 11 PM', lat: 17.384, lng: 78.4860 },
  { id: 4, name: 'Apollo Diagnostics', type: 'Laboratory', distance: '2.1 km', rating: 4.8, address: 'Lake View, North Block', phone: '+918012345681', open: '6 AM - 10 PM', lat: 17.387, lng: 78.4880 },
  { id: 5, name: 'MYCARE Children Hospital', type: 'Hospital', distance: '3.5 km', rating: 4.8, address: 'Garden Road, East Wing', phone: '+918012345682', open: '24/7', lat: 17.390, lng: 78.4900 },
  { id: 6, name: 'HealthCare Pharmacy', type: 'Pharmacy', distance: '1.0 km', rating: 4.3, address: 'Station Road, Shop 12', phone: '+918012345683', open: '24/7', lat: 17.383, lng: 78.4855 },
];

const typeIcons = { Hospital: Building2, Clinic: Stethoscope, Pharmacy: Pill, Laboratory: FlaskConical };
const typeColors = {
  Hospital: 'bg-red-50 dark:bg-red-900/30 text-danger',
  Clinic: 'bg-primary-50 dark:bg-primary-900/30 text-primary-800',
  Pharmacy: 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600',
  Laboratory: 'bg-accent-50 dark:bg-accent-900/30 text-accent-500',
};

export function NearbyHospitalsPage() {
  const { db } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'All' | 'Hospital' | 'Clinic' | 'Pharmacy' | 'Laboratory'>('All');
  const [search, setSearch] = useState('');

  const facilities = db.hospitals;
  const filtered = facilities.filter(f =>
    (filter === 'All' || f.type === filter) && (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Nearby Healthcare Facilities</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find hospitals, clinics, pharmacies, and labs near you.</p>
      </div>

      {/* Map placeholder */}
      <Card className="!p-0 overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#0F4C8133 1px, transparent 1px), linear-gradient(90deg, #0F4C8133 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shadow-lg mb-3 animate-float">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="font-display font-bold text-slate-900 dark:text-white">Your Location</p>
            <p className="text-sm text-slate-500">17.3850° N, 78.4867° E</p>
          </div>
          {filtered.slice(0, 4).map((f, i) => {
            const Icon = typeIcons[f.type as keyof typeof typeIcons];
            return (
              <div key={f.id} className={`absolute w-8 h-8 rounded-full flex items-center justify-center shadow-md ${typeColors[f.type as keyof typeof typeColors]}`}
                style={{ top: `${20 + i * 18}%`, left: `${15 + i * 20}%` }}>
                <Icon className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search facilities..." className="input-field" style={{ paddingLeft: '2.75rem' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'Hospital', 'Clinic', 'Pharmacy', 'Laboratory'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === t ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Facility list */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(f => {
          const Icon = typeIcons[f.type as keyof typeof typeIcons];
          return (
            <Card key={f.id} hover>
              <div className="flex items-start gap-4">
                {f.image ? (
                  <img src={f.image} alt={f.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${typeColors[f.type as keyof typeof typeColors]}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display font-bold text-slate-900 dark:text-white">{f.name}</p>
                    <Badge color="neutral">{f.distance}</Badge>
                  </div>
                  <p className="text-sm text-secondary-500 font-medium">{f.type}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{f.address}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" />{f.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{f.open}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="secondary" onClick={() => toast(`Opening directions to ${f.name}`, 'info')}><Navigation className="w-4 h-4" /> Directions</Button>
                    <a href={`tel:${f.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4" /> Call</Button></a>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
