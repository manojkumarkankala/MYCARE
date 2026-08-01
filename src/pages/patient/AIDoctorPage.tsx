import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/store/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import {
  Brain, Send, Mic, Volume2, VolumeX, AlertTriangle, Stethoscope,
  FlaskConical, Activity, HeartPulse, RotateCcw, Sparkles, User,
} from 'lucide-react';

interface Msg { role: 'ai' | 'user'; text: string; timestamp: string }

const assessmentSteps = [
  { key: 'name', question: "Hello! I'm your AI Health Assistant. I'm here to help you understand your symptoms. Let's start — what's your name?" },
  { key: 'age', question: "Nice to meet you! How old are you?" },
  { key: 'gender', question: "What's your gender? This helps me consider gender-specific health factors." },
  { key: 'symptoms', question: "What symptoms are you experiencing? Please describe them in detail." },
  { key: 'duration', question: "How long have you been experiencing these symptoms?" },
  { key: 'pain', question: "On a scale of 1-10, how would you rate any pain or discomfort?" },
  { key: 'diseases', question: "Do you have any existing medical conditions? (e.g., diabetes, hypertension, asthma)" },
  { key: 'medications', question: "Are you currently taking any medications? If so, please list them." },
  { key: 'allergies', question: "Do you have any known allergies?" },
  { key: 'lifestyle', question: "How would you describe your lifestyle? (active, moderate, sedentary)" },
  { key: 'smoking', question: "Do you smoke or consume alcohol? If yes, how frequently?" },
  { key: 'history', question: "Any significant family medical history? (e.g., heart disease, cancer in family)" },
];

const disclaimer = "I am an AI assistant, not a licensed medical professional. My suggestions are informational and should not replace professional medical advice. For emergencies, call your local emergency number immediately.";

export function AIDoctorPage() {
  const { user, updateDB } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: assessmentSteps[0].question, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [collecting, setCollecting] = useState(true);
  const [assessment, setAssessment] = useState<null | {
    possibleConditions: string[]; riskLevel: 'Low' | 'Moderate' | 'High';
    recommendedSpecialist: string; testsToConsider: string[];
    generalCare: string[]; emergencyWarning?: string;
  }>(null);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(true);
  const answersRef = useRef<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const speak = (text: string) => {
    if (!speaking || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const stopSpeak = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };

  const generateAssessmentFallback = (symptoms: string) => {
    const s = symptoms.toLowerCase();
    const conditions: string[] = [];
    let risk: 'Low' | 'Moderate' | 'High' = 'Low';
    let specialist = 'General Physician';
    const tests: string[] = [];
    const care: string[] = [];
    let emergency: string | undefined;

    if (s.includes('fever') || s.includes('temperature')) {
      conditions.push('Viral infection', 'Common cold or flu');
      tests.push('Complete Blood Count (CBC)', 'Temperature monitoring');
      care.push('Stay hydrated with warm fluids', 'Rest adequately', 'Monitor temperature every 4 hours');
      risk = 'Moderate';
      specialist = 'General Physician';
      if (s.includes('102') || s.includes('103') || s.includes('high')) {
        emergency = 'If your fever exceeds 102°F (39°C) for more than 3 days, or is accompanied by difficulty breathing, severe headache, or chest pain, seek immediate medical attention.';
      }
    }
    if (s.includes('head') || s.includes('migraine') || s.includes('headache')) {
      conditions.push('Tension headache', 'Migraine');
      tests.push('Blood pressure check');
      care.push('Rest in a quiet, dark room', 'Stay hydrated', 'Avoid screen time');
      risk = risk === 'Low' ? 'Moderate' : risk;
      specialist = 'Neurologist';
    }
    if (s.includes('chest') || s.includes('heart') || s.includes('breath')) {
      conditions.push('Possible cardiac issue', 'Anxiety-related');
      tests.push('ECG', 'Blood pressure monitoring', 'Lipid panel');
      care.push('Avoid strenuous activity', 'Monitor blood pressure');
      risk = 'High';
      specialist = 'Cardiologist';
      emergency = 'Chest pain with shortness of breath, sweating, or pain radiating to the arm/jaw requires IMMEDIATE emergency care. Call your local emergency number.';
    }
    if (s.includes('stomach') || s.includes('nausea') || s.includes('vomit') || s.includes('diarrhea')) {
      conditions.push('Gastroenteritis', 'Food poisoning', 'Acid reflux');
      tests.push('Stool test (if persistent)', 'Abdominal ultrasound');
      care.push('Drink ORS or electrolyte solutions', 'Eat bland foods (BRAT diet)', 'Avoid spicy/oily food');
      risk = 'Moderate'; specialist = 'Gastroenterologist';
    }
    if (s.includes('knee') || s.includes('joint') || s.includes('back') || s.includes('pain')) {
      conditions.push('Musculoskeletal strain', 'Osteoarthritis');
      tests.push('X-ray of affected area');
      care.push('Apply hot/cold compress', 'Avoid heavy lifting', 'Gentle stretching exercises');
      specialist = 'Orthopedic Specialist';
    }
    if (s.includes('skin') || s.includes('rash') || s.includes('itch')) {
      conditions.push('Allergic reaction', 'Contact dermatitis');
      tests.push('Allergy panel');
      care.push('Avoid known allergens', 'Use mild moisturizer', 'Do not scratch');
      specialist = 'Dermatologist';
    }
    if (s.includes('anxious') || s.includes('stress') || s.includes('sleep') || s.includes('depress')) {
      conditions.push('Anxiety', 'Stress-related symptoms', 'Possible sleep disorder');
      tests.push('Thyroid function test (to rule out physical causes)');
      care.push('Practice deep breathing 10 min daily', 'Maintain a sleep schedule', 'Consider mindfulness meditation');
      specialist = 'Psychiatrist';
    }
    if (conditions.length === 0) {
      conditions.push('Non-specific symptoms — monitoring recommended');
      care.push('Maintain a symptom diary', 'Stay hydrated', 'Get adequate rest');
      tests.push('General health check-up');
    }

    return { possibleConditions: [...new Set(conditions)], riskLevel: risk, recommendedSpecialist: specialist, testsToConsider: [...new Set(tests)], generalCare: care, emergencyWarning: emergency };
  };

  const handleSend = () => {
    if (!input.trim() || thinking) return;
    const userMsg: Msg = { role: 'user', text: input, timestamp: new Date().toISOString() };
    const userText = input;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(async () => {
      if (collecting && stepIndex < assessmentSteps.length - 1) {
        answersRef.current[assessmentSteps[stepIndex].key] = userText;
        const next = stepIndex + 1;
        setStepIndex(next);
        const aiMsg: Msg = { role: 'ai', text: assessmentSteps[next].question, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
        speak(assessmentSteps[next].question);
        setThinking(false);
      } else if (collecting) {
        answersRef.current[assessmentSteps[stepIndex].key] = userText;
        let result: NonNullable<typeof assessment> | null = null;
        try {
          const { data, error } = await supabase.functions.invoke('ai-doctor', { body: { answers: answersRef.current } });
          if (error || !data?.assessment) throw error || new Error('No assessment returned');
          result = data.assessment;
        } catch {
          // Edge function not deployed / no API key configured yet — fall back
          // to the local rule-based estimate so the page still works.
          result = generateAssessmentFallback(answersRef.current.symptoms || userText);
        }
        setAssessment(result);
        setCollecting(false);
        const summary = `Thank you for sharing that information. Based on what you've described, here's my preliminary assessment. Please remember: ${disclaimer}`;
        const aiMsg: Msg = { role: 'ai', text: summary, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
        speak(summary);
        setThinking(false);

        // Save conversation
        if (user) {
          updateDB(db => {
            db.notifications.unshift({
              id: `n-${Date.now()}`, userId: user.id, type: 'doctor_reply',
              title: 'AI Assessment Complete', message: 'Your AI Doctor consultation has been completed.',
              date: new Date().toISOString().slice(0, 10), read: false,
            });
          });
        }
      } else {
        // Free chat after assessment
        const aiMsg: Msg = { role: 'ai', text: `I understand. Based on your assessment, I'd recommend following the care advice and consulting with a ${assessment?.recommendedSpecialist ?? 'physician'}. Is there anything specific about your symptoms you'd like me to explain further?`, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
        speak(aiMsg.text);
        setThinking(false);
      }
    }, 1200);
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast('Voice recognition not supported in this browser.', 'warning'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.continuous = false;
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start(); setListening(true);
    recognitionRef.current = rec;
  };

  const restart = () => {
    setMessages([{ role: 'ai', text: assessmentSteps[0].question, timestamp: new Date().toISOString() }]);
    setStepIndex(0); setCollecting(true); setAssessment(null);
    stopSpeak();
  };

  const riskColors = { Low: 'success', Moderate: 'warning', High: 'danger' } as const;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">AI Doctor</h1>
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online · {collecting ? `Step ${stepIndex + 1}/${assessmentSteps.length}` : 'Assessment complete'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSpeaking(s => !s); if (speaking) stopSpeak(); }} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title={speaking ? 'Mute voice' : 'Enable voice'}>
            {speaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <Button variant="ghost" size="sm" onClick={restart}><RotateCcw className="w-4 h-4" /> Restart</Button>
        </div>
      </div>

      {/* Assessment result */}
      <AnimatePresence>
        {assessment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="border-2 border-secondary-200 dark:border-secondary-900">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary-500" />
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">AI Health Assessment</h2>
                <Badge color={riskColors[assessment.riskLevel]}>{assessment.riskLevel} Risk</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <AssessmentSection icon={Activity} title="Possible Conditions" items={assessment.possibleConditions} color="text-primary-800" />
                <AssessmentSection icon={Stethoscope} title="Recommended Specialist" items={[assessment.recommendedSpecialist]} color="text-secondary-600" />
                <AssessmentSection icon={FlaskConical} title="Tests to Consider" items={assessment.testsToConsider} color="text-accent-500" />
                <AssessmentSection icon={HeartPulse} title="General Care Advice" items={assessment.generalCare} color="text-success" />
              </div>
              {assessment.emergencyWarning && (
                <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-danger text-sm">Emergency Warning</p>
                    <p className="text-sm text-danger/80 mt-0.5">{assessment.emergencyWarning}</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <Card className="!p-0 overflow-hidden flex flex-col" >
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[400px] max-h-[500px]">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'ai' ? 'bg-gradient-to-br from-primary-800 to-secondary-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {m.role === 'ai' ? <Brain className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'ai'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                  : 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white rounded-tr-sm'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-4 sm:px-6 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/40">
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            AI suggestions are informational only — not a substitute for professional medical care.
          </p>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={startListening}
            className={`p-3 rounded-xl transition-colors shrink-0 ${listening ? 'bg-danger text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={listening ? 'Listening...' : 'Type your response...'}
            className="input-field flex-1"
            disabled={thinking}
          />
          <Button onClick={handleSend} disabled={!input.trim() || thinking} className="shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function AssessmentSection({ icon: Icon, title, items, color }: {
  icon: typeof Activity; title: string; items: string[]; color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
