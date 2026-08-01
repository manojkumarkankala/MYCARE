import { useAuth } from '@/store/AuthContext';
import { Card, StatCard, Badge } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/Animation';
import {
  Users, Stethoscope, Calendar, Pill, Package, FileText, MessageSquare,
  TrendingUp, DollarSign, Activity, Clock, Star,
} from 'lucide-react';

export function AdminDashboard() {
  const { db } = useAuth();
  const totalPatients = db.patients.length;
  const totalDoctors = db.doctors.length;
  const approvedDoctors = db.doctors.filter(d => d.approved).length;
  const pendingDoctors = db.doctors.filter(d => !d.approved).length;
  const todayAppts = db.appointments.filter(a => a.date === new Date().toISOString().slice(0, 10)).length;
  const totalAppts = db.appointments.length;
  const reports = db.medicalReports.length;
  const medicines = db.medicines.length;
  const instruments = db.instruments.length;
  const updates = db.healthUpdates.length;
  const feedback = db.feedback.length;
  const revenue = db.appointments.filter(a => a.status === 'completed').reduce((s, a) => s + a.fee, 0);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-secondary-600 p-6 lg:p-8 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative">
            <p className="text-primary-100 text-sm">Administrator Portal</p>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold">Platform Overview</h1>
            <p className="text-primary-100 text-sm mt-1">Monitor and manage the entire MYCARE ecosystem.</p>
          </div>
        </div>
      </FadeIn>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.05}><StatCard icon={<Users className="w-6 h-6 text-primary-800" />} label="Total Patients" value={totalPatients} color="bg-primary-50 dark:bg-primary-900/30" /></FadeIn>
        <FadeIn delay={0.1}><StatCard icon={<Stethoscope className="w-6 h-6 text-secondary-600" />} label="Total Doctors" value={totalDoctors} color="bg-secondary-50 dark:bg-secondary-900/30" /></FadeIn>
        <FadeIn delay={0.15}><StatCard icon={<Calendar className="w-6 h-6 text-accent-500" />} label="Today's Appointments" value={todayAppts} color="bg-accent-50 dark:bg-accent-900/30" /></FadeIn>
        <FadeIn delay={0.2}><StatCard icon={<DollarSign className="w-6 h-6 text-success" />} label="Revenue" value={`₹${revenue.toLocaleString()}`} color="bg-green-50 dark:bg-green-900/30" trend="+12% this month" /></FadeIn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.25}><StatCard icon={<Pill className="w-6 h-6 text-primary-800" />} label="Medicines" value={medicines} color="bg-primary-50 dark:bg-primary-900/30" /></FadeIn>
        <FadeIn delay={0.3}><StatCard icon={<Package className="w-6 h-6 text-secondary-600" />} label="Instruments" value={instruments} color="bg-secondary-50 dark:bg-secondary-900/30" /></FadeIn>
        <FadeIn delay={0.35}><StatCard icon={<FileText className="w-6 h-6 text-accent-500" />} label="Reports Uploaded" value={reports} color="bg-accent-50 dark:bg-accent-900/30" /></FadeIn>
        <FadeIn delay={0.4}><StatCard icon={<MessageSquare className="w-6 h-6 text-warning" />} label="Feedback" value={feedback} color="bg-amber-50 dark:bg-amber-900/30" /></FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <FadeIn delay={0.45}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Pending Doctor Approvals</h2>
              <Badge color="warning">{pendingDoctors} pending</Badge>
            </div>
            {pendingDoctors === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No pending approvals.</p>
            ) : (
              <div className="space-y-3">
                {db.doctors.filter(d => !d.approved).map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                    <img src={d.avatar} alt={d.name} className="w-10 h-10 rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.specialization} · {d.experience}y exp</p>
                    </div>
                    <Badge color="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Revenue analytics */}
        <FadeIn delay={0.5}>
          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" /> Revenue Analytics
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Completed Consultations', value: db.appointments.filter(a => a.status === 'completed').length, total: totalAppts },
                { label: 'Upcoming Appointments', value: db.appointments.filter(a => a.status === 'upcoming').length, total: totalAppts },
                { label: 'Approved Doctors', value: approvedDoctors, total: totalDoctors },
                { label: 'Health Updates Published', value: updates, total: updates + 5 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.value}/{item.total}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-800 to-secondary-500 rounded-full" style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Recent activity */}
      <FadeIn delay={0.55}>
        <Card>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary-500" /> Recent Appointments
          </h2>
          <div className="space-y-2">
            {db.appointments.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{a.patientName} → {a.doctorName}</p>
                  <p className="text-xs text-slate-400">{a.date} · {a.time}</p>
                </div>
                <Badge color={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
