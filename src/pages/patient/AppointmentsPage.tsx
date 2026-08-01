import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Appointment } from '@/types';
import {
  Calendar, Clock, Stethoscope, Search, X, Check, Phone, Mail,
  MessageCircle, Star, MapPin, DollarSign,
} from 'lucide-react';

export function AppointmentsPage() {
  const { user, db, updateDB } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'book'>('upcoming');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof db.doctors[0] | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  if (!user || user.role !== 'patient') return null;
  const appointments = db.appointments.filter(a => a.patientId === user.id);
  const filtered = appointments.filter(a => a.status === tab);
  const approvedDoctors = db.doctors.filter(d => d.approved);
  const searchedDoctors = approvedDoctors.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const slots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleBook = () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) { toast('Please select date and time.', 'warning'); return; }
    const newApt: Appointment = {
      id: `apt-${Date.now()}`, patientId: user.id, patientName: user.name,
      doctorId: selectedDoctor.id, doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization, date: bookingDate, time: bookingTime,
      status: 'upcoming', reason: 'General consultation', fee: selectedDoctor.consultationFee,
    };
    updateDB(d => { d.appointments.push(newApt); });
    toast('Appointment booked successfully!', 'success');
    setSelectedDoctor(null); setBookingDate(''); setBookingTime('');
    setTab('upcoming');
  };

  const handleCancel = (id: string) => {
    updateDB(d => { const a = d.appointments.find(x => x.id === id); if (a) a.status = 'cancelled'; });
    toast('Appointment cancelled.', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Book, manage, and track your doctor appointments.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(['upcoming', 'completed', 'cancelled', 'book'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              tab === t ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {t === 'book' ? 'Book New' : t}
          </button>
        ))}
      </div>

      {tab !== 'book' ? (
        filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-slate-400">No {tab} appointments.</p>
            <Button size="sm" className="mt-4" onClick={() => setTab('book')}>Book an appointment</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => (
              <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card hover>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-slate-900 dark:text-white">{apt.doctorName}</p>
                      <p className="text-sm text-slate-500">{apt.specialization} · {apt.reason}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />₹{apt.fee}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={apt.status === 'upcoming' ? 'success' : apt.status === 'completed' ? 'primary' : 'danger'}>{apt.status}</Badge>
                      {apt.status === 'upcoming' && (
                        <Button size="sm" variant="danger" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search doctors by name or specialization..."
              className="input-field"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Doctor list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedDoctors.map(doc => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card hover>
                  <div className="flex items-start gap-3">
                    <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-slate-900 dark:text-white truncate">{doc.name}</p>
                      <p className="text-sm text-secondary-500">{doc.specialization}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.hospital}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" />{doc.rating}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{doc.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1" onClick={() => setSelectedDoctor(doc)}>Book</Button>
                    <a href={`https://wa.me/${doc.whatsapp}`} target="_blank" rel="noopener" className="p-2 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50"><MessageCircle className="w-4 h-4" /></a>
                    <a href={`tel:${doc.phone}`} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"><Phone className="w-4 h-4" /></a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Booking modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Book Appointment</h2>
              <button onClick={() => setSelectedDoctor(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-12 h-12 rounded-xl" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedDoctor.name}</p>
                <p className="text-sm text-secondary-500">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Select Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(s => (
                    <button
                      key={s}
                      onClick={() => setBookingTime(s)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        bookingTime === s ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleBook} className="w-full" size="lg"><Check className="w-5 h-5" /> Confirm Booking</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
