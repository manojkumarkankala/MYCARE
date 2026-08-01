import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5 group', className)}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-800 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-800/30 group-hover:scale-105 transition-transform">
        <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
          MY<span className="text-secondary-500">CARE</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
          Healthcare Companion
        </span>
      </div>
    </Link>
  );
}
