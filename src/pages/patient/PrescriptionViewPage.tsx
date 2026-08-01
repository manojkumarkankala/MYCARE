import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import {
  Download, Printer, Mail, ArrowLeft, Pill, Calendar,
  Stethoscope, Building2, FileText, QrCode,
} from 'lucide-react';

export function PrescriptionViewPage() {
  const { id } = useParams();
  const { db } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const rx = db.prescriptions.find(p => p.id === id);

  if (!rx) {
    return (
      <Card className="text-center py-12">
        <p className="text-slate-400">Prescription not found.</p>
        <Button className="mt-4" onClick={() => navigate('/patient/records')}>Back to Records</Button>
      </Card>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast('PDF download started (demo).', 'success');
  };

  const handleEmail = () => {
    toast('Prescription emailed to your registered address (demo).', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <button onClick={() => navigate('/patient/records')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-secondary-500">
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleEmail}><Mail className="w-4 h-4" /> Email</Button>
          <Button size="sm" variant="outline" onClick={handleDownload}><Download className="w-4 h-4" /> PDF</Button>
          <Button size="sm" onClick={handlePrint}><Printer className="w-4 h-4" /> Print</Button>
        </div>
      </div>

      {/* Prescription document */}
      <div ref={printRef} className="card p-8 lg:p-10 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-primary-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-extrabold text-xl text-primary-800">MYCARE</p>
              <p className="text-xs text-slate-400">Healthcare Companion</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-slate-900">{rx.hospital}</p>
            <p className="text-xs text-slate-400">{rx.date}</p>
          </div>
        </div>

        {/* Rx symbol */}
        <div className="my-6">
          <p className="font-display text-5xl font-extrabold text-primary-800 italic">℞</p>
        </div>

        {/* Patient & doctor info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5 text-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Patient</p>
            <p className="font-semibold text-slate-900 text-base">{rx.patientName}</p>
            <p className="text-slate-600">Age: {rx.patientAge} years</p>
          </div>
          <div className="space-y-1.5 text-sm sm:text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Doctor</p>
            <p className="font-semibold text-slate-900 text-base">{rx.doctorName}</p>
            <p className="text-slate-600">{rx.doctorQualification}</p>
          </div>
        </div>

        {/* Symptoms & diagnosis */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Symptoms</p>
            <p className="text-sm text-slate-700">{rx.symptoms}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Diagnosis</p>
            <p className="text-sm font-bold text-primary-800">{rx.diagnosis}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Summary</p>
            <p className="text-sm text-slate-700">{rx.summary}</p>
          </div>
        </div>

        {/* Medicines table */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Prescribed Medicines</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs text-slate-500">
                  <th className="p-3 font-semibold">Medicine</th>
                  <th className="p-3 font-semibold">Dosage</th>
                  <th className="p-3 font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rx.medicines.map((m, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="p-3 font-semibold text-slate-900">{m.name}</td>
                    <td className="p-3 text-slate-600">{m.dosage}</td>
                    <td className="p-3 text-slate-600">{m.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next visit */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Calendar className="w-4 h-4 text-secondary-500" />
          <span className="text-slate-600">Next visit: <span className="font-semibold text-slate-900">{rx.nextVisit}</span></span>
        </div>

        {/* Signature + QR */}
        <div className="flex items-end justify-between pt-6 border-t border-slate-100">
          <div>
            <div className="w-32 border-b-2 border-slate-300 mb-1" />
            <p className="text-sm font-semibold text-slate-900">{rx.doctorName}</p>
            <p className="text-xs text-slate-400">{rx.doctorQualification}</p>
            <p className="text-xs text-slate-400">Reg: {rx.hospital}</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center mb-1">
              <QrCode className="w-12 h-12 text-white" />
            </div>
            <p className="text-[10px] text-slate-400">Scan to verify</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          This is a digitally generated prescription from MYCARE. Verify with your pharmacist.
        </p>
      </div>
    </div>
  );
}
