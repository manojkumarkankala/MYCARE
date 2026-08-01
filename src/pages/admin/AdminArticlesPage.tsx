import { useAuth } from '@/store/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { FileText, Calendar, Megaphone } from 'lucide-react';

export function AdminArticlesPage() {
  const { db } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Health Articles</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View all health updates published by doctors.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {db.healthUpdates.map(u => (
          <Card key={u.id} hover className="!p-0 overflow-hidden">
            <div className="h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img src={u.coverImage} alt={u.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge color="secondary">{u.category}</Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{u.date}</span>
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white line-clamp-2">{u.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{u.description}</p>
              <p className="text-xs text-secondary-500 font-semibold mt-2">{u.doctorName}</p>
            </div>
          </Card>
        ))}
      </div>

      {db.healthUpdates.length === 0 && (
        <Card className="text-center py-12">
          <Megaphone className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-slate-400">No articles published yet.</p>
        </Card>
      )}
    </div>
  );
}
