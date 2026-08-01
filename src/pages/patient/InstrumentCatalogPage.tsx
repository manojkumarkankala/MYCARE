import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FlaskConical, Search, X, PlayCircle, CheckCircle2, AlertTriangle,
  Sparkles, Wrench, Droplets, ShieldCheck,
} from 'lucide-react';

const categories = ['All', 'Thermometer', 'BP Monitor', 'Pulse Oximeter', 'Nebulizer', 'Stethoscope', 'Glucometer'];

export function InstrumentCatalogPage() {
  const { db } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<typeof db.instruments[0] | null>(null);

  const filtered = db.instruments.filter(inst => {
    const matchCat = category === 'All' || inst.category === category;
    const matchSearch = !search || inst.name.toLowerCase().includes(search.toLowerCase()) || inst.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Medical Instrument Catalog</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Learn how to use medical devices with step-by-step guides and safety precautions.</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search instruments..."
            className="input-field"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === c ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((inst, i) => (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          >
            <Card hover className="!p-0 overflow-hidden cursor-pointer h-full flex flex-col" >
              <div onClick={() => setSelected(inst)} className="flex-1">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3"><Badge color="primary">{inst.category}</Badge></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-slate-900 dark:text-white">{inst.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{inst.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-secondary-500 font-semibold">
                    <FlaskConical className="w-4 h-4" /> View guide
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <FlaskConical className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-slate-400">No instruments found. Try a different search.</p>
        </Card>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="card max-w-2xl w-full max-h-[85vh] overflow-y-auto !p-0"
            >
              <div className="relative h-56 bg-slate-100 dark:bg-slate-800">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3"><Badge color="primary">{selected.category}</Badge></div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{selected.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selected.description}</p>
                </div>

                <Section icon={Sparkles} title="Uses" color="text-secondary-500">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selected.uses}</p>
                </Section>

                <Section icon={CheckCircle2} title="How to Use — Step by Step" color="text-success">
                  <ol className="space-y-2">
                    {selected.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 font-bold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Section>

                <Section icon={AlertTriangle} title="Precautions" color="text-warning">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selected.precautions}</p>
                </Section>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Section icon={Droplets} title="Cleaning Guide" color="text-accent-500">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selected.cleaningGuide}</p>
                  </Section>
                  <Section icon={Wrench} title="Maintenance" color="text-primary-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selected.maintenance}</p>
                  </Section>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center gap-3">
                  <PlayCircle className="w-8 h-8 text-secondary-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Demonstration Video</p>
                    <p className="text-xs text-slate-400">Watch a video guide on how to use this device</p>
                  </div>
                  <Button size="sm" variant="secondary" className="ml-auto">Watch</Button>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <ShieldCheck className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-600 dark:text-amber-400">Always consult a healthcare professional before using any medical device. This guide is for educational purposes only.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ icon: Icon, title, color, children }: { icon: typeof Sparkles; title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} /> {title}
      </h3>
      {children}
    </div>
  );
}
