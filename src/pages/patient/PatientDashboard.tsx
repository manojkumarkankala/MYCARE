import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { Card, StatCard, Badge } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/Animation';
import {
  Calendar, Pill, HeartPulse, Brain, Scan, FileText, Siren, MapPin,
  FlaskConical, Activity, TrendingUp, Clock, ArrowRight, Megaphone,
  Stethoscope, Thermometer, Droplet,
} from 'lucide-react';

export function PatientDashboard() {
  const { user, db } = useAuth();
  if (!user || user.role !== 'patient') return null;
  const patient = user;

  const appointments = db.appointments.filter(a => a.patientId === patient.id);
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const prescriptions = db.prescriptions.filter(p => p.patientId === patient.id);
  const reports = db.medicalReports.filter(r => r.patientId === patient.id);
  const updates = db.healthUpdates.slice(0, 3);

  const healthScore = 85;

  const quickActions = [
    { to: '/patient/ai-doctor', icon: Brain, label: 'AI Doctor', color: 'from-primary-500 to-secondary-500', desc: 'Chat with AI' },
    { to: '/patient/medicine-scanner', icon: Scan, label: 'Scan Medicine', color: 'from-secondary-500 to-accent-400', desc: 'Identify pills' },
    { to: '/patient/report-scanner', icon: FileText, label: 'Report Scanner', color: 'from-accent-400 to-primary-500', desc: 'OCR reports' },
    { to: '/patient/instruments', icon: FlaskConical, label: 'Instruments', color: 'from-primary-600 to-secondary-600', desc: 'How-to guides' },
    { to: '/patient/appointments', icon: Calendar, label: 'Appointments', color: 'from-secondary-600 to-accent-500', desc: 'Book doctors' },
    { to: '/patient/sos', icon: Siren, label: 'Emergency SOS', color: 'from-red-500 to-warning', desc: 'Get help now' },
  ];

  const todayMeds = prescriptions[0]?.medicines ?? [
    { name: 'Amlodipine 5mg', dosage: '1 tablet OD', instructions: 'Morning' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-secondary-600 p-6 lg:p-8 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm">Good day,</p>
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold">{patient.name}</h1>
              <p className="text-primary-100 text-sm mt-1">
                {patient.age} yrs · {patient.gender} · {patient.bloodGroup} · Health Score: {healthScore}/100
              </p>
            </div>
            <Link to="/patient/ai-doctor">
              <button className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2">
                <Brain className="w-5 h-5" /> Consult AI Doctor
              </button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.05}><StatCard icon={<Calendar className="w-6 h-6 text-primary-800" />} label="Appointments" value={appointments.length} color="bg-primary-50 dark:bg-primary-900/30" /></FadeIn>
        <FadeIn delay={0.1}><StatCard icon={<Pill className="w-6 h-6 text-secondary-600" />} label="Prescriptions" value={prescriptions.length} color="bg-secondary-50 dark:bg-secondary-900/30" /></FadeIn>
        <FadeIn delay={0.15}><StatCard icon={<FileText className="w-6 h-6 text-accent-500" />} label="Lab Reports" value={reports.length} color="bg-accent-50 dark:bg-accent-900/30" /></FadeIn>
        <FadeIn delay={0.2}><StatCard icon={<HeartPulse className="w-6 h-6 text-danger" />} label="Health Score" value={healthScore} color="bg-red-50 dark:bg-red-900/30" trend="+5 this month" /></FadeIn>
      </div>

      {/* Quick actions */}
      <FadeIn delay={0.25}>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.to} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to={a.to}>
                  <Card hover className="text-center !p-4 h-full">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <FadeIn delay={0.3} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="text-sm text-secondary-500 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming appointments</p>
                <Link to="/patient/appointments" className="text-sm text-secondary-500 hover:underline mt-2 inline-block">Book one now</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center text-white shrink-0">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{apt.doctorName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{apt.specialization} · {apt.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{apt.date}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Health score + vitals */}
        <FadeIn delay={0.35}>
          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Health Overview</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42 * healthScore / 100} ${2 * Math.PI * 42}`} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0F4C81" /><stop offset="100%" stopColor="#0AA6A6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">{healthScore}</span>
                  <span className="text-xs text-slate-400">of 100</span>
                </div>
              </div>
              <Badge color="success"><TrendingUp className="w-3 h-3 mr-1" />Good health</Badge>
            </div>
            <div className="space-y-3">
              <VitalRow icon={Activity} label="Blood Pressure" value="120/80" status="normal" />
              <VitalRow icon={Droplet} label="Blood Group" value={patient.bloodGroup} status="normal" />
              <VitalRow icon={Thermometer} label="BMI" value={(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)} status="borderline" />
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's medicines */}
        <FadeIn delay={0.4}>
          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Today's Medicines</h2>
            <div className="space-y-3">
              {todayMeds.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.dosage} · {m.instructions}</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded accent-secondary-500" />
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>

        {/* Doctor updates */}
        <FadeIn delay={0.45}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Doctor Updates</h2>
              <Megaphone className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {updates.map(u => (
                <div key={u.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <img src={u.coverImage} alt={u.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Badge color="secondary">{u.category}</Badge>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white mt-1 line-clamp-2">{u.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{u.doctorName} · {u.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Nearby hospitals strip */}
      <FadeIn delay={0.5}>
        <Link to="/patient/hospitals">
          <Card hover className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-slate-900 dark:text-white">Find Nearby Hospitals</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hospitals, clinics, pharmacies, and labs near you</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Card>
        </Link>
      </FadeIn>
    </div>
  );
}

function VitalRow({ icon: Icon, label, value, status }: { icon: typeof Activity; label: string; value: string; status: 'normal' | 'abnormal' | 'borderline' }) {
  const colors = { normal: 'text-success', abnormal: 'text-danger', borderline: 'text-warning' };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${colors[status]}`} />
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${colors[status]}`}>{value}</span>
    </div>
  );
}
