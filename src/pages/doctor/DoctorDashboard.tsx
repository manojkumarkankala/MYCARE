import { Link } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Card, StatCard, Badge } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/Animation';
import { Button } from '@/components/ui/Button';
import {
  Users, Calendar, PenSquare, Megaphone, Clock, Stethoscope,
  ArrowRight, TrendingUp, Star, FileText,
} from 'lucide-react';

export function DoctorDashboard() {
  const { user, db } = useAuth();
  if (!user || user.role !== 'doctor') return null;
  const doctor = user;

  const appointments = db.appointments.filter(a => a.doctorId === doctor.id);
  const todayAppts = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10) && a.status === 'upcoming');
  const patients = db.patients.filter(p => appointments.some(a => a.patientId === p.id));
  const updates = db.healthUpdates.filter(u => u.doctorId === doctor.id);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-secondary-600 p-6 lg:p-8 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm">Welcome back,</p>
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold">{doctor.name}</h1>
              <p className="text-primary-100 text-sm mt-1">{doctor.specialization} · {doctor.hospital}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/15 rounded-xl px-3 py-2">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-sm font-semibold">{doctor.rating || 'New'}</span>
              </div>
              <Link to="/doctor/prescription">
                <button className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2">
                  <PenSquare className="w-5 h-5" /> Write Prescription
                </button>
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.05}><StatCard icon={<Users className="w-6 h-6 text-primary-800" />} label="Total Patients" value={patients.length} color="bg-primary-50 dark:bg-primary-900/30" /></FadeIn>
        <FadeIn delay={0.1}><StatCard icon={<Calendar className="w-6 h-6 text-secondary-600" />} label="Appointments" value={appointments.length} color="bg-secondary-50 dark:bg-secondary-900/30" /></FadeIn>
        <FadeIn delay={0.15}><StatCard icon={<Clock className="w-6 h-6 text-accent-500" />} label="Today's Schedule" value={todayAppts.length} color="bg-accent-50 dark:bg-accent-900/30" /></FadeIn>
        <FadeIn delay={0.2}><StatCard icon={<Megaphone className="w-6 h-6 text-warning" />} label="Health Updates" value={updates.length} color="bg-amber-50 dark:bg-amber-900/30" /></FadeIn>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <FadeIn delay={0.25} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Today's Patients</h2>
              <Link to="/doctor/patients" className="text-sm text-secondary-500 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {appointments.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No appointments yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map(apt => {
                  const patient = db.patients.find(p => p.id === apt.patientId);
                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      {patient?.avatar && <img src={patient.avatar} alt={apt.patientName} className="w-12 h-12 rounded-xl object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{apt.patientName}</p>
                        <p className="text-sm text-slate-500">{apt.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{apt.date}</p>
                        <p className="text-xs text-slate-400">{apt.time}</p>
                      </div>
                      <Badge color={apt.status === 'upcoming' ? 'success' : apt.status === 'completed' ? 'primary' : 'danger'}>{apt.status}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/doctor/prescription">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center"><PenSquare className="w-5 h-5 text-secondary-600" /></div>
                  <div><p className="font-semibold text-sm text-slate-900 dark:text-white">Write Prescription</p><p className="text-xs text-slate-400">Create digital Rx</p></div>
                </div>
              </Link>
              <Link to="/doctor/updates">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center"><Megaphone className="w-5 h-5 text-accent-500" /></div>
                  <div><p className="font-semibold text-sm text-slate-900 dark:text-white">Post Health Update</p><p className="text-xs text-slate-400">Share with patients</p></div>
                </div>
              </Link>
              <Link to="/doctor/patients">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center"><FileText className="w-5 h-5 text-primary-800" /></div>
                  <div><p className="font-semibold text-sm text-slate-900 dark:text-white">Patient History</p><p className="text-xs text-slate-400">View records</p></div>
                </div>
              </Link>
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Recent updates */}
      <FadeIn delay={0.35}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Your Health Updates</h2>
            <Link to="/doctor/updates"><Button size="sm" variant="ghost">Manage <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
          </div>
          {updates.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No updates published yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {updates.slice(0, 2).map(u => (
                <div key={u.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <img src={u.coverImage} alt={u.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Badge color="secondary">{u.category}</Badge>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white mt-1 line-clamp-2">{u.title}</p>
                    <p className="text-xs text-slate-400">{u.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
