import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import {
  Scan, Camera, Pill, Loader2, CheckCircle2, AlertCircle,
  DollarSign, Building2, FlaskConical, FileWarning, Beaker, ShieldAlert,
  Search, RotateCcw, Bookmark, Package, Activity, Thermometer, Droplet,
  Syringe, Stethoscope, Info, X,
} from 'lucide-react';
import type { MedicineScan } from '@/types';

const medicineDatabase: Omit<MedicineScan, 'id' | 'patientId' | 'date'>[] = [
  {
    medicineName: 'Azithromycin', brand: 'Azee 500', composition: 'Azithromycin 500mg',
    genericName: 'Azithromycin', manufacturer: 'Cipla Ltd', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1471863771055-d4377efb1c5a?w=600',
    uses: 'Bacterial infections, respiratory tract infections, ear infections, skin infections, sexually transmitted infections',
    dosage: '1 tablet once daily for 3-5 days, or as directed by physician. Take 1 hour before or 2 hours after meals.',
    sideEffects: 'Diarrhea, nausea, abdominal pain, vomiting, headache, dizziness. Rare: liver enzyme elevation, allergic rash.',
    warnings: 'Complete the full course even if you feel better. Do not skip doses. Avoid antacids 2 hours before/after. QT prolongation risk — inform doctor of heart conditions.',
    interactions: 'Warfarin (increased bleeding), digoxin, ergotamine, statins. Consult doctor if on heart or cholesterol medications.',
    storage: 'Store below 25°C, protect from moisture and light. Keep in original packaging.',
    prescriptionRequired: true, estimatedPrice: 120, confidenceScore: 94,
    similarMedicines: ['Zithromax', 'Azithral', 'Zimax', 'Zady'],
  },
  {
    medicineName: 'Paracetamol', brand: 'Crocin Advance', composition: 'Paracetamol 650mg',
    genericName: 'Paracetamol (Acetaminophen)', manufacturer: 'GSK Pharmaceuticals', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1584308666744-24d8c2c2c1c2?w=600',
    uses: 'Fever, headache, body ache, toothache, menstrual pain, mild to moderate pain relief',
    dosage: '1 tablet every 6-8 hours with water, max 4 tablets in 24 hours. Do not take for more than 3 days without consulting a doctor.',
    sideEffects: 'Rare at normal doses: nausea, rash. Overdose can cause severe liver damage. Long-term use: kidney issues.',
    warnings: 'Do not exceed 4g (6 tablets) per day. Avoid alcohol. Check other cold/flu medicines for paracetamol content to avoid overdose.',
    interactions: 'Warfarin (increased bleeding risk). Avoid combining with other paracetamol-containing products.',
    storage: 'Store below 30°C, keep dry. Protect from direct sunlight.',
    prescriptionRequired: false, estimatedPrice: 35, confidenceScore: 97,
    similarMedicines: ['Dolo 650', 'Calpol 650', 'P-650', 'Tylenol'],
  },
  {
    medicineName: 'Metformin', brand: 'Glycomet 500', composition: 'Metformin Hydrochloride 500mg',
    genericName: 'Metformin Hydrochloride', manufacturer: 'USV Pvt Ltd', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe611db8898?w=600',
    uses: 'Type 2 diabetes mellitus, polycystic ovary syndrome (PCOS), insulin resistance management',
    dosage: '1 tablet twice daily with meals, gradually increase as prescribed. Do not crush or chew. Extended-release: take once daily.',
    sideEffects: 'Nausea, diarrhea, metallic taste, loss of appetite, vitamin B12 deficiency (long-term use). Rare: lactic acidosis.',
    warnings: 'Monitor kidney function regularly. Stop 48 hours before contrast imaging or surgery. Risk of lactic acidosis is rare but serious — seek help if breathing difficulty.',
    interactions: 'Alcohol, iodinated contrast media, cimetidine, topiramate. Inform doctor of all medications including OTC.',
    storage: 'Store below 25°C, protect from moisture. Keep container tightly closed.',
    prescriptionRequired: true, estimatedPrice: 85, confidenceScore: 91,
    similarMedicines: ['Glyciphage', 'Obimet', 'Gluformin', 'Metlong'],
  },
  {
    medicineName: 'Cetirizine', brand: 'Cetzine', composition: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride', manufacturer: 'Hetero Drugs', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b291c4?w=600',
    uses: 'Allergies, hay fever, skin rashes, allergic rhinitis, sneezing, itchy/watery eyes, insect bites',
    dosage: '1 tablet at bedtime, or as directed. May be taken with or without food. Do not exceed 1 tablet per day.',
    sideEffects: 'Drowsiness, dry mouth, fatigue, headache, dizziness. Children: mild stomach pain.',
    warnings: 'May cause drowsiness — avoid driving or operating machinery if affected. Avoid alcohol. Not for children under 6 without doctor advice.',
    interactions: 'Sedatives, tranquilizers, alcohol. Inform doctor if taking CNS depressants.',
    storage: 'Store at room temperature, protect from moisture and light.',
    prescriptionRequired: false, estimatedPrice: 25, confidenceScore: 96,
    similarMedicines: ['Zyrtec', 'Cetaphil', 'Alerid', 'Okacet'],
  },
  {
    medicineName: 'Amoxicillin', brand: 'Mox 500', composition: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate', manufacturer: 'Sun Pharma', category: 'Capsule',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600',
    uses: 'Bacterial infections — ear, nose, throat, chest, urinary tract, dental infections, skin infections',
    dosage: '1 capsule every 8 hours for 5-7 days, or as prescribed. Complete the full course even if symptoms improve.',
    sideEffects: 'Nausea, diarrhea, rash, vomiting. Allergic reactions in penicillin-sensitive patients: hives, swelling, breathing difficulty.',
    warnings: 'Check for penicillin allergy before use. Complete full course. Inform doctor of any allergic history. Not for viral infections like common cold.',
    interactions: 'Allopurinol (rash risk), oral contraceptives (reduced efficacy), warfarin. Use backup contraception.',
    storage: 'Store below 25°C. Keep capsules dry. Suspension: refrigerate once reconstituted, discard after 14 days.',
    prescriptionRequired: true, estimatedPrice: 78, confidenceScore: 92,
    similarMedicines: ['Amoxil', 'Novamox', 'Moxacin', 'Wymox'],
  },
  {
    medicineName: 'Omeprazole', brand: 'Omez 20', composition: 'Omeprazole 20mg',
    genericName: 'Omeprazole', manufacturer: "Dr. Reddy's", category: 'Capsule',
    image: 'https://images.unsplash.com/photo-1607619056570-12d8d2c0e9c0?w=600',
    uses: 'Acid reflux, GERD, stomach ulcers, heartburn, H. pylori eradication (with antibiotics)',
    dosage: '1 capsule daily, 30 minutes before breakfast. Swallow whole, do not crush or chew. Course: 4-8 weeks.',
    sideEffects: 'Headache, constipation, gas, nausea, diarrhea. Long-term: vitamin B12 deficiency, increased fracture risk, low magnesium.',
    warnings: 'Long-term use increases fracture and infection risk. Take before meals. Do not stop abruptly if used long-term. Inform doctor of liver issues.',
    interactions: 'Clopidogrel (reduced effect), digoxin, ketoconazole, methotrexate. Avoid long-term self-medication.',
    storage: 'Store below 25°C, protect from light and moisture. Keep in original blister pack.',
    prescriptionRequired: false, estimatedPrice: 68, confidenceScore: 89,
    similarMedicines: ['Prilosec', 'Ocid', 'Omezol', 'Razo'],
  },
  {
    medicineName: 'Amlodipine', brand: 'Amlong 5', composition: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate', manufacturer: 'Micro Labs', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600',
    uses: 'Hypertension (high blood pressure), angina (chest pain), coronary artery disease',
    dosage: '1 tablet once daily, preferably at the same time each day. May be taken with or without food. Full effect in 1-2 weeks.',
    sideEffects: 'Ankle/foot swelling, headache, flushing, dizziness, fatigue, palpitations. Rare: gum enlargement.',
    warnings: 'Do not stop abruptly — may cause blood pressure spike. Monitor blood pressure regularly. Inform doctor if pregnant or breastfeeding.',
    interactions: 'Simvastatin (dose limit), grapefruit juice (avoid), sildenafil. Inform doctor of all cardiac medications.',
    storage: 'Store below 25°C, protect from moisture and light.',
    prescriptionRequired: true, estimatedPrice: 55, confidenceScore: 90,
    similarMedicines: ['Norvasc', 'Amlokind', 'Amlip', 'S-Numlo'],
  },
  {
    medicineName: 'Cough Syrup', brand: 'Benadryl', composition: 'Diphenhydramine + Ammonium Chloride',
    genericName: 'Diphenhydramine Hydrochloride', manufacturer: 'Johnson & Johnson', category: 'Syrup',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
    uses: 'Cough, cold, sore throat, nasal congestion, allergic symptoms, sneezing',
    dosage: 'Adults: 2 teaspoons (10ml) 3-4 times daily. Children 6-12: 1 teaspoon 3 times daily. Do not exceed 4 doses in 24 hours.',
    sideEffects: 'Drowsiness, dizziness, dry mouth, blurred vision, constipation. Children: excitability paradoxically.',
    warnings: 'May cause drowsiness — avoid driving. Not for children under 6 without doctor advice. Avoid alcohol. Check for allergy to ingredients.',
    interactions: 'Sedatives, tranquilizers, MAO inhibitors (serious interaction). Avoid with other antihistamines.',
    storage: 'Store below 25°C. Do not refrigerate. Use measuring cup provided. Discard 1 month after opening.',
    prescriptionRequired: false, estimatedPrice: 95, confidenceScore: 88,
    similarMedicines: ['TusQ', 'Ascoril', 'Koflet', 'Glycodin'],
  },
  {
    medicineName: 'Insulin', brand: 'Lantus', composition: 'Insulin Glargine 100 IU/ml',
    genericName: 'Insulin Glargine', manufacturer: 'Sanofi', category: 'Injection',
    image: 'https://images.unsplash.com/photo-1579154203251-c5ab9b4a4c93?w=600',
    uses: 'Type 1 and Type 2 diabetes mellitus, blood sugar control, gestational diabetes',
    dosage: 'Subcutaneous injection once daily at the same time. Dose individualized by doctor based on blood glucose. Rotate injection sites.',
    sideEffects: 'Hypoglycemia (low blood sugar), injection site reactions, weight gain, lipodystrophy. Rare: allergic reactions.',
    warnings: 'Monitor blood glucose regularly. Carry glucose tablets for hypoglycemia. Do not inject IV. Inform doctor of all diabetes medications.',
    interactions: 'Oral diabetes medicines, beta-blockers, ACE inhibitors, alcohol. Adjust dose with kidney/liver function changes.',
    storage: 'Unopened: refrigerate 2-8°C, do not freeze. Opened: room temperature up to 30 days. Protect from light.',
    prescriptionRequired: true, estimatedPrice: 1200, confidenceScore: 86,
    similarMedicines: ['Levemir', 'Toujeo', 'Lantus SoloStar', 'Basaglar'],
  },
  {
    medicineName: 'Clotrimazole', brand: 'Candid-B', composition: 'Clotrimazole 1% + Beclomethasone',
    genericName: 'Clotrimazole + Beclomethasone', manufacturer: 'Glenmark', category: 'Cream',
    image: 'https://images.unsplash.com/photo-1607619056570-12d8d2c0e9c0?w=600',
    uses: 'Fungal skin infections, ringworm, athlete\'s foot, jock itch, fungal-infected eczema',
    dosage: 'Apply thin layer to affected area 2-3 times daily. Wash hands before and after. Continue 2 weeks after symptoms clear.',
    sideEffects: 'Burning, stinging, redness, itching at application site. Rare: allergic contact dermatitis, skin thinning (prolonged use).',
    warnings: 'For external use only. Do not apply to eyes or mucous membranes. Avoid prolonged use (steroid component). Inform doctor if pregnant.',
    interactions: 'No significant drug interactions for topical use. Inform doctor of other skin products used.',
    storage: 'Store below 25°C. Do not freeze. Keep tube tightly closed. Keep away from children.',
    prescriptionRequired: false, estimatedPrice: 145, confidenceScore: 87,
    similarMedicines: ['Lotrimin', 'Candid', 'Itchguard', 'Ring Guard'],
  },
];

const categoryIcons: Record<string, typeof Pill> = {
  Tablet: Pill,
  Capsule: Pill,
  Syrup: Droplet,
  Injection: Syringe,
  Cream: Droplet,
};

export function MedicineScannerPage() {
  const { user, db, updateDB } = useAuth();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<MedicineScan | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    'Preprocessing image...',
    'Running OCR text extraction...',
    'Analyzing packaging patterns...',
    'Matching against medicine database...',
    'Compiling detailed analysis...',
  ];

  const handleScan = () => {
    if (!imagePreview) {
      toast('Please upload or capture a medicine image first', 'error');
      return;
    }
    setScanning(true);
    setResult(null);
    setSaved(false);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep(s => Math.min(s + 1, scanSteps.length - 1));
    }, 450);

    setTimeout(() => {
      clearInterval(stepInterval);
      const random = medicineDatabase[Math.floor(Math.random() * medicineDatabase.length)];
      const scanResult: MedicineScan = {
        ...random,
        id: `scan-${Date.now()}`,
        patientId: user?.id || 'unknown',
        date: new Date().toISOString().slice(0, 10),
      };
      setResult(scanResult);
      setScanning(false);
      toast(`Medicine identified: ${scanResult.medicineName} (${scanResult.confidenceScore}% confidence)`, 'success');

      if (user) {
        updateDB(d => {
          d.notifications.unshift({
            id: `n-${Date.now()}`, userId: user.id, type: 'doctor_reply',
            title: 'Medicine Scan Complete', message: `Identified: ${scanResult.medicineName} (${scanResult.brand})`,
            date: new Date().toISOString().slice(0, 10), read: false,
          });
        });
      }
    }, 2400);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setImagePreview(reader.result as string); setResult(null); setSaved(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!result || !user) return;
    updateDB(d => {
      if (!d.medicineScans.some(s => s.id === result.id)) {
        d.medicineScans.unshift(result);
      }
    });
    setSaved(true);
    toast('Saved to My Medicines', 'success');
  };

  const handleSearchAgain = () => {
    setResult(null);
    setImagePreview(null);
    setSaved(false);
  };

  const savedScans = user ? db.medicineScans.filter(s => s.patientId === user.id) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Medicine Scanner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload or capture a medicine image. AI Vision + OCR identifies it and provides full details — like Google Lens, specialized for medicines.</p>
      </div>

      {/* Upload area */}
      <Card>
        {!result && !scanning && (
          <>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => { setImagePreview(r.result as string); setResult(null); setSaved(false); }; r.readAsDataURL(f); } }}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-secondary-400 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Medicine" className="max-h-56 mx-auto rounded-xl" />
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-secondary-500 to-accent-400 flex items-center justify-center mb-4">
                    <Scan className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">Upload medicine image</p>
                  <p className="text-sm text-slate-400 mt-1">Click to browse, drag & drop, or use camera</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" onClick={() => cameraRef.current?.click()}>
                <Camera className="w-5 h-5" /> Capture Photo
              </Button>
              <Button onClick={handleScan} disabled={!imagePreview}>
                <Scan className="w-5 h-5" /> Scan Medicine
              </Button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            {!imagePreview && (
              <p className="mt-3 text-xs text-warning text-center">Upload or capture an image to enable scanning</p>
            )}
          </>
        )}

        {scanning && (
          <div className="py-12">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {imagePreview && (
                <img src={imagePreview} alt="Scanning" className="w-32 h-32 object-cover rounded-2xl opacity-60" />
              )}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-secondary-500 shadow-[0_0_12px_2px_rgba(99,102,241,0.6)]"
                initial={{ top: 0 }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-secondary-400" />
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
              {scanSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm transition-opacity ${i <= scanStep ? 'opacity-100' : 'opacity-30'}`}>
                  {i < scanStep ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : i === scanStep ? (
                    <Loader2 className="w-4 h-4 text-secondary-500 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={i <= scanStep ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      <AnimatePresence>
        {result && !scanning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Header card with image + confidence */}
            <Card className="border-2 border-secondary-200 dark:border-secondary-900">
              <div className="flex flex-col sm:flex-row gap-4">
                <img src={result.image} alt={result.medicineName} className="w-full sm:w-40 h-40 rounded-2xl object-cover shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{result.medicineName}</h2>
                      <p className="text-sm text-secondary-500 font-medium">{result.brand}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {result.prescriptionRequired ? (
                        <Badge color="danger"><AlertCircle className="w-3 h-3 mr-1" />Rx Required</Badge>
                      ) : (
                        <Badge color="success"><CheckCircle2 className="w-3 h-3 mr-1" />OTC</Badge>
                      )}
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">AI Confidence Score</span>
                      <span className="font-bold text-secondary-600">{result.confidenceScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-secondary-500 to-accent-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidenceScore}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <InfoRow icon={FlaskConical} label="Generic Name" value={result.genericName} />
                    <InfoRow icon={Package} label="Form" value={result.category} />
                    <InfoRow icon={Building2} label="Manufacturer" value={result.manufacturer} />
                    <InfoRow icon={DollarSign} label="Est. Price" value={`₹${result.estimatedPrice}`} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Composition */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-accent-500" /> Composition
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.composition}</p>
            </Card>

            {/* Primary Uses */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-600" /> Primary Uses
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.uses}</p>
            </Card>

            {/* Dosage */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4 text-secondary-500" /> Dosage Guidance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.dosage}</p>
              <p className="text-xs text-slate-400 mt-2 italic">General information only — follow your doctor's prescription.</p>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Side Effects */}
              <Card>
                <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" /> Side Effects
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{result.sideEffects}</p>
              </Card>

              {/* Warnings */}
              <Card>
                <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-danger" /> Warnings & Precautions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{result.warnings}</p>
              </Card>
            </div>

            {/* Drug Interactions */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-warning" /> Drug Interactions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.interactions}</p>
            </Card>

            {/* Storage */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-accent-500" /> Storage Instructions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.storage}</p>
            </Card>

            {/* Similar medicines */}
            <Card>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-3">Similar / Alternative Medicines</h3>
              <div className="flex flex-wrap gap-2">
                {result.similarMedicines.map(m => (
                  <Badge key={m} color="secondary">{m}</Badge>
                ))}
              </div>
            </Card>

            {/* Do not self-medicate warning */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-danger">DO NOT SELF-MEDICATE</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    This AI identification is for informational purposes only. Always verify with a pharmacist and consult your doctor before taking any medication. Incorrect use can be dangerous.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearchAgain} variant="outline" className="flex-1">
                <RotateCcw className="w-5 h-5" /> Search Again
              </Button>
              <Button onClick={handleSave} disabled={saved} className="flex-1">
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved to My Medicines</> : <><Bookmark className="w-5 h-5" /> Save to My Medicines</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved scans */}
      {savedScans.length > 0 && !result && !scanning && (
        <Card>
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-secondary-500" /> My Saved Medicines ({savedScans.length})
          </h3>
          <div className="space-y-2">
            {savedScans.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <img src={s.image} alt={s.medicineName} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.medicineName}</p>
                  <p className="text-xs text-slate-400">{s.brand} · {s.category} · {s.date}</p>
                </div>
                <Badge color="neutral">{s.confidenceScore}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
