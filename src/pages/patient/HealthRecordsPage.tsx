import { Link } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText, Pill, FlaskConical, HeartPulse, Download, Calendar,
  Stethoscope, Building2, ArrowRight,
} from 'lucide-react';

export function HealthRecordsPage() {
  const { user, db } = useAuth();
  if (!user || user.role !== 'patient') return null;

  const prescriptions = db.prescriptions.filter(p => p.patientId === user.id);
  const reports = db.medicalReports.filter(r => r.patientId === user.id);
  const appointments = db.appointments.filter(a => a.patientId === user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Health Records</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your complete medical history, prescriptions, and lab reports.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prescriptions */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-secondary-500" /> Prescriptions
              </h2>
              <Badge color="primary">{prescriptions.length}</Badge>
            </div>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No prescriptions yet.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map(rx => (
                  <Link key={rx.id} to={`/patient/prescription/${rx.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-accent-400 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white">{rx.diagnosis}</p>
                        <p className="text-sm text-slate-500">{rx.doctorName} · {rx.date}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Lab Reports */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-accent-500" /> Lab Reports
              </h2>
              <Badge color="primary">{reports.length}</Badge>
            </div>
            {reports.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No lab reports yet.</p>
            ) : (
              <div className="space-y-3">
                {reports.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{r.type}</p>
                        <p className="text-sm text-slate-500">{r.doctorName} · {r.hospital}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge color="secondary">{r.date}</Badge>
                        <button className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-500 hover:text-secondary-500"><Download className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{r.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.findings.filter(f => f.status !== 'normal').map((f, i) => (
                        <Badge key={i} color={f.status === 'abnormal' ? 'danger' : 'warning'}>{f.test}: {f.value}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: medical history + appointments */}
        <div className="space-y-4">
          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-danger" /> Medical Profile
            </h2>
            <div className="space-y-3 text-sm">
              <Row label="Blood Group" value={user.bloodGroup} />
              <Row label="Height" value={`${user.height} cm`} />
              <Row label="Weight" value={`${user.weight} kg`} />
              <Row label="Allergies" value={user.allergies} />
              <Row label="Medical History" value={user.medicalHistory} />
              <Row label="Emergency Contact" value={user.emergencyContact} />
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary-800" /> Appointment History
            </h2>
            <div className="space-y-2">
              {appointments.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <Stethoscope className="w-4 h-4 text-secondary-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 dark:text-slate-200 truncate">{a.doctorName}</p>
                    <p className="text-xs text-slate-400">{a.date}</p>
                  </div>
                  <Badge color={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-700 dark:text-slate-200 text-right font-medium">{value}</span>
    </div>
  );
}
