import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Prescription } from '@/types';
import { PenSquare, Plus, Trash2, User, Calendar, FileText, Check } from 'lucide-react';

export function WritePrescriptionPage() {
  const { user, db, updateDB } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  if (!user || user.role !== 'doctor') return null;

  const [patientId, setPatientId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [summary, setSummary] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', instructions: '' }]);

  const myPatients = db.patients.filter(p => db.appointments.some(a => a.doctorId === user.id && a.patientId === p.id));

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', instructions: '' }]);
  const removeMedicine = (i: number) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, field: string, value: string) => {
    setMedicines(medicines.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !diagnosis) { toast('Please select a patient and enter a diagnosis.', 'warning'); return; }
    const patient = db.patients.find(p => p.id === patientId);
    if (!patient) return;
    const newRx: Prescription = {
      id: `rx-${Date.now()}`, patientId, patientName: patient.name, patientAge: patient.age,
      doctorId: user.id, doctorName: user.name, doctorQualification: user.qualification,
      hospital: user.hospital, date: new Date().toISOString().slice(0, 10),
      symptoms, summary, diagnosis,
      medicines: medicines.filter(m => m.name.trim()), nextVisit,
    };
    updateDB(d => { d.prescriptions.push(newRx); });
    toast('Prescription created successfully!', 'success');
    navigate('/doctor');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PenSquare className="w-6 h-6 text-secondary-500" /> Write Prescription
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a digital prescription for your patient.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Patient</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select value={patientId} onChange={e => setPatientId(e.target.value)} className="input-field appearance-none cursor-pointer" style={{ paddingLeft: '2.75rem' }} required>
                  <option value="">Select patient...</option>
                  {myPatients.map(p => <option key={p.id} value={p.id}>{p.name} · {p.age}y · {p.bloodGroup}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Symptoms</label>
              <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Describe patient symptoms..." rows={2} className="input-field resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Diagnosis</label>
              <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Primary diagnosis" className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Summary / Notes</label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Clinical notes and recommendations..." rows={3} className="input-field resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Next Visit</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="date" value={nextVisit} onChange={e => setNextVisit(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary-500" /> Medicines
            </h2>
            <Button type="button" size="sm" variant="secondary" onClick={addMedicine}><Plus className="w-4 h-4" /> Add</Button>
          </div>
          <div className="space-y-3">
            {medicines.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input value={m.name} onChange={e => updateMedicine(i, 'name', e.target.value)} placeholder="Medicine name" className="input-field col-span-12 sm:col-span-5" />
                <input value={m.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} placeholder="Dosage" className="input-field col-span-6 sm:col-span-3" />
                <input value={m.instructions} onChange={e => updateMedicine(i, 'instructions', e.target.value)} placeholder="Instructions" className="input-field col-span-5 sm:col-span-3" />
                <button type="button" onClick={() => removeMedicine(i)} className="col-span-1 p-2.5 rounded-xl text-danger hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full"><Check className="w-5 h-5" /> Create Prescription</Button>
      </form>
    </div>
  );
}
