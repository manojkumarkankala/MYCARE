import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Siren, Phone, MapPin, AlertTriangle, Ambulance, HeartPulse,
  CheckCircle2, Loader2, Navigation, ShieldAlert,
} from 'lucide-react';

export function EmergencySOSPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.role !== 'patient') return null;

  const triggerSOS = () => {
    setSosActive(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          sendSOS();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const sendSOS = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast('Emergency alert sent! Help is on the way.', 'success');
    }, 2000);
  };

  const cancelSOS = () => { setSosActive(false); setSent(false); setCountdown(3); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Emergency SOS</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">One tap to alert emergency contacts, share your location, and call for help.</p>
      </div>

      {/* SOS button */}
      <Card className="text-center py-12">
        <AnimatePresence mode="wait">
          {!sosActive && !sent && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                onClick={triggerSOS}
                className="relative w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-2xl shadow-red-500/40 hover:scale-105 transition-transform active:scale-95"
              >
                <span className="pulse-ring absolute inset-0 rounded-full text-red-500" />
                <div className="relative flex flex-col items-center justify-center">
                  <Siren className="w-16 h-16 mb-2" />
                  <span className="font-display font-extrabold text-2xl">SOS</span>
                  <span className="text-xs opacity-80">Tap to activate</span>
                </div>
              </button>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Press and hold to send an emergency alert with your live location to your emergency contacts and nearest hospital.
              </p>
            </motion.div>
          )}

          {sosActive && countdown > 0 && (
            <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-48 h-48 mx-auto rounded-full bg-warning text-white flex flex-col items-center justify-center">
                <span className="text-6xl font-display font-extrabold">{countdown}</span>
                <span className="text-sm mt-2">Sending alert in...</span>
              </div>
              <Button variant="danger" className="mt-6" onClick={cancelSOS}>Cancel</Button>
            </motion.div>
          )}

          {sending && (
            <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-48 h-48 mx-auto rounded-full bg-primary-800 text-white flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin mb-2" />
                <span className="text-sm">Sending alert...</span>
              </div>
            </motion.div>
          )}

          {sent && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="w-48 h-48 mx-auto rounded-full bg-success text-white flex flex-col items-center justify-center">
                <CheckCircle2 className="w-16 h-16 mb-2" />
                <span className="font-display font-bold text-lg">Alert Sent</span>
              </div>
              <p className="mt-6 text-sm text-success font-semibold">Emergency services and contacts have been notified.</p>
              <Button variant="outline" className="mt-4" onClick={cancelSOS}>Reset</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <a href="tel:102">
          <Card hover className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Ambulance className="w-6 h-6 text-danger" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">Call Ambulance</p>
            <p className="text-xs text-slate-400 mt-1">Dial 102 / 108</p>
          </Card>
        </a>
        <a href={`tel:${user.emergencyContact}`}>
          <Card hover className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-warning" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">Emergency Contact</p>
            <p className="text-xs text-slate-400 mt-1">{user.emergencyContact || 'Not set'}</p>
          </Card>
        </a>
        <Card hover className="text-center cursor-pointer" onClick={() => toast('Sharing live location (demo).', 'info')}>
          <div className="w-12 h-12 mx-auto rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mb-3">
            <Navigation className="w-6 h-6 text-accent-500" />
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">Share Location</p>
          <p className="text-xs text-slate-400 mt-1">Send live GPS</p>
        </Card>
      </div>

      {/* Emergency instructions */}
      <Card>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-danger" /> Emergency Instructions
        </h2>
        <div className="space-y-3">
          {[
            { title: 'Chest Pain / Heart Attack', desc: 'Call emergency immediately. Chew an aspirin if not allergic. Sit down and stay calm.' },
            { title: 'Severe Bleeding', desc: 'Apply firm pressure with a clean cloth. Elevate the wound if possible. Keep the person warm.' },
            { title: 'Difficulty Breathing', desc: 'Sit upright. Loosen tight clothing. Use an inhaler if available. Seek immediate help.' },
            { title: 'Unconsciousness', desc: 'Check breathing. If not breathing, start CPR. Call emergency services immediately.' },
            { title: 'Severe Allergic Reaction', desc: 'Use an EpiPen if available. Call emergency. Lay the person flat unless breathing is difficult.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
        <p className="text-sm text-danger flex items-center gap-2">
          <HeartPulse className="w-4 h-4 shrink-0" />
          In a life-threatening emergency, always call your local emergency number (102/108/911) directly. This SOS feature supplements but does not replace emergency services.
        </p>
      </div>
    </div>
  );
}
