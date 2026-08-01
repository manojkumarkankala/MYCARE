import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import type { UserRole } from '@/types';
import {
  User, Stethoscope, Shield, Eye, EyeOff, ArrowLeft, Mail, Lock, Phone,
  MapPin, Droplet, Ruler, Weight, AlertCircle, Languages, HeartPulse,
  GraduationCap, Building2, BadgeCheck, Clock, DollarSign,
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

type Mode = 'login' | 'register' | 'forgot';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [role, setRole] = useState<UserRole>('patient');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, registerPatient, registerDoctor } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  // Patient registration
  const [pForm, setPForm] = useState({
    name: '', age: '', gender: 'Male', bloodGroup: 'O+', height: '', weight: '',
    mobile: '', email: '', password: '', confirm: '', emergency: '', address: '',
    language: 'English', history: '', allergies: '', avatar: '',
  });

  // Doctor registration
  const [dForm, setDForm] = useState({
    name: '', qualification: '', specialization: '', hospital: '', experience: '',
    regNumber: '', address: '', phone: '', email: '', password: '', fee: '', timings: '', avatar: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result.ok) {
      toast(`Welcome back!`, 'success');
      navigate(role === 'patient' ? '/patient' : role === 'doctor' ? '/doctor' : '/admin');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pForm.password !== pForm.confirm) { setError('Passwords do not match.'); return; }
    if (pForm.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await registerPatient({
      name: pForm.name, email: pForm.email, password: pForm.password, avatar: pForm.avatar || undefined,
      age: parseInt(pForm.age) || 0, gender: pForm.gender as 'Male' | 'Female' | 'Other',
      bloodGroup: pForm.bloodGroup, height: parseInt(pForm.height) || 0,
      weight: parseInt(pForm.weight) || 0, mobile: pForm.mobile, emergencyContact: pForm.emergency,
      address: pForm.address, preferredLanguage: pForm.language as 'English' | 'Hindi' | 'Telugu',
      medicalHistory: pForm.history, allergies: pForm.allergies,
    });
    setLoading(false);
    if (result.ok) { toast('Account created successfully!', 'success'); navigate('/patient'); }
    else setError(result.error || 'Registration failed');
  };

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (dForm.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await registerDoctor({
      name: dForm.name, email: dForm.email, password: dForm.password, avatar: dForm.avatar || undefined,
      qualification: dForm.qualification, specialization: dForm.specialization,
      hospital: dForm.hospital, experience: parseInt(dForm.experience) || 0,
      registrationNumber: dForm.regNumber, clinicAddress: dForm.address,
      phone: dForm.phone, consultationFee: parseInt(dForm.fee) || 500, timings: dForm.timings,
    });
    setLoading(false);
    if (result.ok) {
      toast('Application submitted! Pending admin approval.', 'info');
      setMode('login');
      setEmail(dForm.email);
    } else setError(result.error || 'Registration failed');
  };

  const roleTabs: { key: UserRole; label: string; icon: typeof User }[] = [
    { key: 'patient', label: 'Patient', icon: User },
    { key: 'doctor', label: 'Doctor', icon: Stethoscope },
    { key: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-medicalbg dark:bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-800 to-secondary-600 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Your health,<br />simplified by AI.
          </h2>
          <p className="mt-4 text-primary-100 text-lg max-w-md">
            Join thousands who use MYCARE for AI-powered consultations, medicine scanning, and seamless doctor appointments.
          </p>
          <div className="mt-8 space-y-3">
            {['AI Doctor available 24/7', 'Scan medicines & reports instantly', 'Book verified doctors in minutes'].map(t => (
              <div key={t} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-primary-100 text-sm">© 2026 MYCARE. AI suggestions are informational only.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>

          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-secondary-500 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <AnimatePresence mode="wait">
            {mode === 'forgot' ? (
              <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Enter your email to receive an OTP.</p>
                <form onSubmit={(e) => { e.preventDefault(); toast('OTP sent to your email (demo).', 'info'); setMode('login'); }} className="mt-6 space-y-4">
                  <Field icon={Mail} type="email" placeholder="Email address" required />
                  <Button type="submit" className="w-full" size="lg">Send OTP</Button>
                </form>
                <button onClick={() => setMode('login')} className="mt-4 text-sm text-secondary-500 hover:underline">Back to login</button>
              </motion.div>
            ) : mode === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to your MYCARE account.</p>

                {/* Role tabs */}
                <div className="mt-6 grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {roleTabs.map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.key}
                        onClick={() => { setRole(t.key); setError(''); }}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          role === t.key ? 'bg-white dark:bg-slate-900 text-secondary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
                  <div className="relative">
                    <Field icon={Lock} type={showPwd ? 'text' : 'password'} placeholder="Password" value={password} onChange={setPassword} required />
                    <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded accent-secondary-500" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-secondary-500 hover:underline">Forgot password?</button>
                  </div>

                  {error && <ErrorBanner message={error} />}

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                  </Button>

                  {role === 'admin' && (
                    <p className="text-xs text-center text-slate-400">Admin password: MYCARE@123</p>
                  )}
                  {role !== 'admin' && (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                      New here?{' '}
                      <button type="button" onClick={() => setMode('register')} className="text-secondary-500 font-semibold hover:underline">
                        Create account
                      </button>
                    </p>
                  )}

                  <div className="text-xs text-center text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    Demo: patient@ john@example.com / patient123 · doctor@ dr.sarah@mycare.health / doctor123
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Join MYCARE as a patient or doctor.</p>

                {/* Role tabs for register */}
                <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {roleTabs.slice(0, 2).map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.key}
                        onClick={() => { setRole(t.key); setError(''); }}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          role === t.key ? 'bg-white dark:bg-slate-900 text-secondary-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {role === 'patient' ? (
                  <form onSubmit={handlePatientRegister} className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                    <div className="flex justify-center">
                      <ImageUpload value={pForm.avatar} onChange={(img) => setPForm({ ...pForm, avatar: img })} label="Profile Photo" shape="circle" />
                    </div>
                    <Field icon={User} placeholder="Full Name" value={pForm.name} onChange={v => setPForm({ ...pForm, name: v })} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={User} type="number" placeholder="Age" value={pForm.age} onChange={v => setPForm({ ...pForm, age: v })} required />
                      <SelectField value={pForm.gender} onChange={v => setPForm({ ...pForm, gender: v })} options={['Male', 'Female', 'Other']} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <SelectField icon={Droplet} value={pForm.bloodGroup} onChange={v => setPForm({ ...pForm, bloodGroup: v })} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                      <Field icon={Ruler} type="number" placeholder="Height (cm)" value={pForm.height} onChange={v => setPForm({ ...pForm, height: v })} />
                      <Field icon={Weight} type="number" placeholder="Weight (kg)" value={pForm.weight} onChange={v => setPForm({ ...pForm, weight: v })} />
                    </div>
                    <Field icon={Phone} type="tel" placeholder="Mobile Number" value={pForm.mobile} onChange={v => setPForm({ ...pForm, mobile: v })} required />
                    <Field icon={Mail} type="email" placeholder="Email" value={pForm.email} onChange={v => setPForm({ ...pForm, email: v })} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={Lock} type="password" placeholder="Password" value={pForm.password} onChange={v => setPForm({ ...pForm, password: v })} required />
                      <Field icon={Lock} type="password" placeholder="Confirm" value={pForm.confirm} onChange={v => setPForm({ ...pForm, confirm: v })} required />
                    </div>
                    <Field icon={Phone} type="tel" placeholder="Emergency Contact" value={pForm.emergency} onChange={v => setPForm({ ...pForm, emergency: v })} />
                    <Field icon={MapPin} placeholder="Address" value={pForm.address} onChange={v => setPForm({ ...pForm, address: v })} />
                    <SelectField icon={Languages} value={pForm.language} onChange={v => setPForm({ ...pForm, language: v })} options={['English', 'Hindi', 'Telugu']} />
                    <Field icon={HeartPulse} placeholder="Medical History" value={pForm.history} onChange={v => setPForm({ ...pForm, history: v })} />
                    <Field icon={AlertCircle} placeholder="Allergies" value={pForm.allergies} onChange={v => setPForm({ ...pForm, allergies: v })} />

                    {error && <ErrorBanner message={error} />}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Register as Patient'}
                    </Button>
                    <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-secondary-500 hover:underline text-center">
                      Already have an account? Sign in
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleDoctorRegister} className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                    <div className="flex justify-center">
                      <ImageUpload value={dForm.avatar} onChange={(img) => setDForm({ ...dForm, avatar: img })} label="Profile Photo" shape="circle" />
                    </div>
                    <Field icon={User} placeholder="Doctor Name" value={dForm.name} onChange={v => setDForm({ ...dForm, name: v })} required />
                    <Field icon={GraduationCap} placeholder="Qualification (e.g. MD, Internal Medicine)" value={dForm.qualification} onChange={v => setDForm({ ...dForm, qualification: v })} required />
                    <Field icon={Stethoscope} placeholder="Specialization" value={dForm.specialization} onChange={v => setDForm({ ...dForm, specialization: v })} required />
                    <Field icon={Building2} placeholder="Hospital Name" value={dForm.hospital} onChange={v => setDForm({ ...dForm, hospital: v })} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={User} type="number" placeholder="Experience (years)" value={dForm.experience} onChange={v => setDForm({ ...dForm, experience: v })} required />
                      <Field icon={BadgeCheck} placeholder="Registration No." value={dForm.regNumber} onChange={v => setDForm({ ...dForm, regNumber: v })} required />
                    </div>
                    <Field icon={MapPin} placeholder="Clinic Address" value={dForm.address} onChange={v => setDForm({ ...dForm, address: v })} />
                    <Field icon={Phone} type="tel" placeholder="Phone" value={dForm.phone} onChange={v => setDForm({ ...dForm, phone: v })} required />
                    <Field icon={Mail} type="email" placeholder="Email" value={dForm.email} onChange={v => setDForm({ ...dForm, email: v })} required />
                    <Field icon={Lock} type="password" placeholder="Password" value={dForm.password} onChange={v => setDForm({ ...dForm, password: v })} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={DollarSign} type="number" placeholder="Consultation Fee" value={dForm.fee} onChange={v => setDForm({ ...dForm, fee: v })} />
                      <Field icon={Clock} placeholder="Available Timings" value={dForm.timings} onChange={v => setDForm({ ...dForm, timings: v })} />
                    </div>
                    <div className="flex justify-center">
                      <ImageUpload value={dForm.avatar} onChange={(img) => setDForm({ ...dForm, avatar: img })} label="License Upload" />
                    </div>

                    {error && <ErrorBanner message={error} />}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <p className="text-xs text-center text-slate-400">Doctor accounts require admin approval before login.</p>
                    <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-secondary-500 hover:underline text-center">
                      Already have an account? Sign in
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, required }: {
  icon?: typeof Mail; type?: string; placeholder: string; value?: string; onChange?: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => onChange?.(e.target.value)}
        className="input-field"
        style={Icon ? { paddingLeft: '2.75rem' } : undefined}
      />
    </div>
  );
}

function SelectField({ icon: Icon, value, onChange, options }: {
  icon?: typeof Droplet; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field appearance-none cursor-pointer"
        style={Icon ? { paddingLeft: '2.75rem' } : undefined}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
      <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
      <p className="text-sm text-danger">{message}</p>
    </div>
  );
}
