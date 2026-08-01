import { useAuth } from '@/store/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Star, MessageSquare } from 'lucide-react';

export function AdminFeedbackPage() {
  const { db } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Patient feedback and ratings for the platform.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.feedback.map(f => (
          <Card key={f.id} hover>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center text-white font-bold">
                {f.patientName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{f.patientName}</p>
                <p className="text-xs text-slate-400">{f.date}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'fill-warning text-warning' : 'text-slate-300 dark:text-slate-700'}`} />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{f.message}</p>
          </Card>
        ))}
      </div>

      {db.feedback.length === 0 && (
        <Card className="text-center py-12">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-slate-400">No feedback yet.</p>
        </Card>
      )}
    </div>
  );
}
