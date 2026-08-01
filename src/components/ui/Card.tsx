import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn('card p-6', hover && 'transition-all hover:shadow-lg hover:-translate-y-0.5', className)}>
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, color, trend }: {
  icon: ReactNode; label: string; value: string | number; color: string; trend?: string;
}) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {trend && <p className="text-xs text-success font-medium mt-1">{trend}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function Badge({ children, color = 'primary' }: { children: ReactNode; color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'neutral' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300',
    success: 'bg-green-50 text-success dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-50 text-warning dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-50 text-danger dark:bg-red-900/30 dark:text-red-400',
    secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', colors[color])}>{children}</span>;
}
