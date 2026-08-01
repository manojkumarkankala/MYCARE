import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import {
  FileText, Upload, Loader2, CheckCircle2, AlertCircle, FileSearch,
  Stethoscope, Building2, Calendar, FlaskConical, Sparkles,
} from 'lucide-react';

const mockReports = [
  {
    patientName: 'John Mathews', doctorName: 'Dr. Sarah Chen', hospital: 'MYCARE Heart Institute',
    type: 'Blood Test' as const, date: '2026-07-10',
    summary: 'Complete blood count and lipid panel. LDL cholesterol is elevated above normal range. Blood pressure and glucose levels are within normal limits. Recommend dietary modifications and follow-up in 6 weeks.',
    findings: [
      { test: 'Total Cholesterol', value: '215 mg/dL', range: '< 200 mg/dL', status: 'borderline' as const },
      { test: 'HDL Cholesterol', value: '45 mg/dL', range: '> 40 mg/dL', status: 'normal' as const },
      { test: 'LDL Cholesterol', value: '145 mg/dL', range: '< 100 mg/dL', status: 'abnormal' as const },
      { test: 'Triglycerides', value: '150 mg/dL', range: '< 150 mg/dL', status: 'normal' as const },
      { test: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5 g/dL', status: 'normal' as const },
      { test: 'Fasting Glucose', value: '92 mg/dL', range: '70-99 mg/dL', status: 'normal' as const },
      { test: 'WBC Count', value: '6.8 K/uL', range: '4.5-11.0 K/uL', status: 'normal' as const },
      { test: 'Platelets', value: '250 K/uL', range: '150-450 K/uL', status: 'normal' as const },
    ],
  },
  {
    patientName: 'John Mathews', doctorName: 'Dr. Vikram Singh', hospital: 'MYCARE Bone & Joint Center',
    type: 'Lab Report' as const, date: '2026-06-15',
    summary: 'X-ray of right knee shows mild osteoarthritic changes with reduced joint space. No acute fractures. Recommend physical therapy and weight management.',
    findings: [
      { test: 'Joint Space Width', value: '3.2mm', range: '> 4mm', status: 'borderline' as const },
      { test: 'Osteophytes', value: 'Present (mild)', range: 'Absent', status: 'abnormal' as const },
      { test: 'Bone Alignment', value: 'Normal', range: 'Normal', status: 'normal' as const },
      { test: 'Soft Tissue', value: 'Normal', range: 'Normal', status: 'normal' as const },
    ],
  },
];

export function MedicalReportScannerPage() {
  const { user, updateDB } = useAuth();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof mockReports[0] | null>(null);
  const [reportType, setReportType] = useState<'Blood Test' | 'Prescription' | 'Lab Report'>('Blood Test');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleScan = () => {
    if (!imagePreview) {
      toast('Please upload a report image first', 'error');
      return;
    }
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const report = mockReports[0]; // blood test by default
      setResult(report);
      setScanning(false);
      toast('Report analyzed successfully!', 'success');

      if (user) {
        updateDB(db => {
          db.notifications.unshift({
            id: `n-${Date.now()}`, userId: user.id, type: 'lab_report',
            title: 'Report Analysis Ready', message: `Your ${report.type} has been analyzed by AI.`,
            date: new Date().toISOString().slice(0, 10), read: false,
          });
        });
      }
    }, 2500);
  };

  const statusColors = { normal: 'success', abnormal: 'danger', borderline: 'warning' } as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Medical Report Scanner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload blood tests, prescriptions, or lab reports. AI will extract, explain, and summarize.</p>
      </div>

      <Card>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['Blood Test', 'Prescription', 'Lab Report'] as const).map(t => (
            <button
              key={t}
              onClick={() => setReportType(t)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                reportType === t ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-secondary-400 transition-colors"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Report" className="max-h-48 mx-auto rounded-xl" />
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">Upload {reportType}</p>
              <p className="text-sm text-slate-400 mt-1">PDF, JPG, PNG supported</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleScan} disabled={scanning} className="flex-1">
            {scanning ? <><Loader2 className="w-5 h-5 animate-spin" /> Extracting & analyzing with OCR...</> : <><FileSearch className="w-5 h-5" /> Scan Report</>}
          </Button>
          <Button variant="outline" onClick={() => { setImagePreview(null); setResult(null); }}>Clear</Button>
        </div>
        {!imagePreview && (
          <p className="mt-3 text-xs text-warning text-center">Upload an image to enable scanning</p>
        )}
      </Card>

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" />
                <FileSearch className="absolute inset-0 m-auto w-10 h-10 text-accent-500" />
              </div>
              <p className="mt-4 font-semibold text-slate-900 dark:text-white">OCR in progress...</p>
              <p className="text-sm text-slate-400">Extracting text, identifying values, analyzing</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !scanning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Extracted info */}
            <Card className="border-2 border-accent-200 dark:border-accent-900">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Extracted Information</h2>
                <Badge color="success"><CheckCircle2 className="w-3 h-3 mr-1" />OCR Complete</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={FileText} label="Patient Name" value={result.patientName} />
                <InfoRow icon={Stethoscope} label="Doctor" value={result.doctorName} />
                <InfoRow icon={Building2} label="Hospital" value={result.hospital} />
                <InfoRow icon={Calendar} label="Date" value={result.date} />
              </div>
            </Card>

            {/* AI Summary */}
            <Card className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20">
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500" /> AI Health Summary (Plain Language)
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.summary}</p>
            </Card>

            {/* Findings table */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-secondary-500" /> Test Results
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-2 font-medium">Test</th>
                      <th className="pb-2 font-medium">Value</th>
                      <th className="pb-2 font-medium hidden sm:table-cell">Normal Range</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.findings.map((f, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                        <td className="py-3 font-medium text-slate-900 dark:text-white">{f.test}</td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">{f.value}</td>
                        <td className="py-3 text-slate-400 hidden sm:table-cell">{f.range}</td>
                        <td className="py-3 text-right"><Badge color={statusColors[f.status]}>{f.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40">
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                This AI analysis is for informational purposes only. Abnormal values should be discussed with your doctor. Do not make medication changes based on this analysis alone.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
