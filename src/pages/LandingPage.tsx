import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/store/ThemeContext';
import {
  Activity, Brain, Pill, FileText, Siren, MapPin, Stethoscope, Calendar,
  HeartPulse, Shield, ArrowRight, CheckCircle2, Star, MessageSquare, Scan,
  FlaskConical, Moon, Sun, Sparkles,
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Doctor', desc: 'Conversational AI that assesses symptoms, suggests conditions, and recommends specialists — with voice support.', color: 'from-primary-500 to-secondary-500' },
  { icon: Scan, title: 'Medicine Scanner', desc: 'Snap a photo of any medicine. AI identifies it, explains uses, dosage, side effects, and alternatives.', color: 'from-secondary-500 to-accent-400' },
  { icon: FileText, title: 'Medical Report OCR', desc: 'Upload blood tests and lab reports. AI extracts data, explains in plain language, and flags abnormal values.', color: 'from-accent-400 to-primary-500' },
  { icon: FlaskConical, title: 'Instrument Guide', desc: 'A beautiful catalog of medical instruments with step-by-step usage guides and safety precautions.', color: 'from-primary-600 to-secondary-600' },
  { icon: Calendar, title: 'Appointments', desc: 'Book, reschedule, and manage appointments with verified doctors. Calendar, slots, and reminders.', color: 'from-secondary-600 to-accent-500' },
  { icon: Siren, title: 'Emergency SOS', desc: 'One-tap SOS that calls ambulance, notifies emergency contacts, and shares your live location.', color: 'from-red-500 to-warning' },
  { icon: MapPin, title: 'Nearby Hospitals', desc: 'Find hospitals, clinics, pharmacies, and labs near you with directions and contact info.', color: 'from-accent-500 to-primary-600' },
  { icon: Shield, title: 'Secure & Private', desc: 'Role-based access, encrypted data, and HIPAA-conscious design keep your health information safe.', color: 'from-primary-700 to-secondary-700' },
];

const stats = [
  { value: '50K+', label: 'Patients Served' },
  { value: '1,200+', label: 'Verified Doctors' },
  { value: '15K+', label: 'AI Consultations' },
  { value: '99.9%', label: 'Uptime' },
];

export function LandingPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-medicalbg dark:bg-slate-950 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-secondary-500 transition-colors">Features</a>
            <a href="#how" className="hover:text-secondary-500 transition-colors">How it Works</a>
            <a href="#roles" className="hover:text-secondary-500 transition-colors">For You</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/auth"><Button size="sm" variant="ghost">Sign In</Button></Link>
            <Link to="/auth?mode=register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Healthcare Platform
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1]">
                Your Smart{' '}
                <span className="bg-gradient-to-r from-primary-800 to-secondary-500 bg-clip-text text-transparent">
                  Healthcare
                </span>{' '}
                Companion
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                MYCARE connects patients, doctors, and administrators with AI-driven symptom assessment,
                medicine scanning, report analysis, and seamless appointment booking — all in one beautiful platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth?mode=register">
                  <Button size="lg" className="group">
                    Start Free Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline">Explore Features</Button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA-conscious</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 24/7 AI Support</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Multi-language</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/40 to-secondary-200/40 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-[2.5rem] blur-2xl" />
                <div className="relative card p-6 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-slate-900 dark:text-white">AI Doctor</p>
                      <p className="text-xs text-success flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 dark:text-slate-200 max-w-[85%]">
                      Hello! I'm your AI health assistant. What symptoms are you experiencing today?
                    </div>
                    <div className="bg-gradient-to-r from-primary-800 to-secondary-500 text-white rounded-2xl rounded-tr-sm p-3 text-sm max-w-[80%] ml-auto">
                      I've had a headache and mild fever for 2 days.
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 dark:text-slate-200 max-w-[85%]">
                      Based on your symptoms, this could be a viral infection. Rest, hydrate, and monitor your temperature. If fever exceeds 102°F, please consult a physician.
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 text-sm text-slate-400">Ask about symptoms...</div>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center text-white">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 card p-4 w-48 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <HeartPulse className="w-5 h-5 text-danger" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Health Score</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">85<span className="text-sm text-slate-400">/100</span></p>
                  <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success to-secondary-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <p className="text-3xl lg:text-4xl font-display font-extrabold bg-gradient-to-r from-primary-800 to-secondary-500 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need for better health
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              From AI-powered consultations to emergency support, MYCARE brings the entire healthcare ecosystem to your fingertips.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.1 }}
                  className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">How MYCARE Works</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Three simple steps to a healthier you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Create Your Account', desc: 'Register as a patient or doctor in minutes. Add your health profile and preferences.' },
              { icon: Brain, title: 'Consult with AI', desc: 'Chat with our AI Doctor, scan medicines, upload reports, and get instant insights.' },
              { icon: HeartPulse, title: 'Connect with Doctors', desc: 'Book appointments, get digital prescriptions, and manage your health journey.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-800/30">
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border-2 border-secondary-400 flex items-center justify-center text-sm font-bold text-secondary-600">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display font-bold text-xl text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">Built for Everyone</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Whether you're seeking care, providing it, or managing the platform — MYCARE has you covered.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: HeartPulse, title: 'For Patients', color: 'from-primary-500 to-secondary-500', points: ['AI symptom assessment', 'Medicine & report scanning', 'Book & track appointments', 'Emergency SOS', 'Digital prescriptions'] },
              { icon: Stethoscope, title: 'For Doctors', color: 'from-secondary-500 to-accent-400', points: ['Manage patient list', 'Write digital prescriptions', 'Publish health articles', 'Schedule appointments', 'View medical reports'] },
              { icon: Shield, title: 'For Administrators', color: 'from-accent-400 to-primary-600', points: ['Approve doctor accounts', 'Manage medicines & instruments', 'View platform analytics', 'Handle feedback', 'Publish announcements'] },
            ].map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="card p-8"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{role.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {role.points.map(p => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">Loved by Patients & Doctors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'John Mathews', role: 'Patient', avatar: 'https://i.pravatar.cc/100?img=33', text: 'The AI Doctor helped me understand my symptoms before my appointment. The medicine scanner is incredibly accurate!' },
              { name: 'Dr. Sarah Chen', role: 'Cardiologist', avatar: 'https://i.pravatar.cc/100?img=47', text: 'MYCARE streamlined my practice. Digital prescriptions and patient management in one beautiful interface.' },
              { name: 'Priya Sharma', role: 'Patient', avatar: 'https://i.pravatar.cc/100?img=49', text: 'Booking appointments and getting my lab reports explained in simple language changed how I manage my health.' },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-secondary-600 p-10 lg:p-16 text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white">Ready to take control of your health?</h2>
              <p className="mt-4 text-primary-100 max-w-xl mx-auto">Join thousands of patients and doctors using MYCARE for smarter, more accessible healthcare.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/auth?mode=register">
                  <Button size="lg" className="bg-white text-primary-800 hover:bg-primary-50 shadow-xl">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Your Smart Healthcare Companion. AI-powered platform connecting patients, doctors, and administrators for better health outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#features" className="hover:text-secondary-500">Features</a></li>
                <li><Link to="/auth" className="hover:text-secondary-500">Sign In</Link></li>
                <li><Link to="/auth?mode=register" className="hover:text-secondary-500">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-secondary-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-secondary-500">Terms of Service</a></li>
                <li><a href="#" className="hover:text-secondary-500">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">© 2026 MYCARE. All rights reserved.</p>
            <p className="text-xs text-slate-400 max-w-2xl text-center sm:text-right">
              MYCARE provides informational AI suggestions only and is not a substitute for professional medical care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
