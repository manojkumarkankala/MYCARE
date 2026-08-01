import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  const variants = {
    primary: 'btn-primary',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl shadow-md shadow-secondary-500/30 hover:shadow-lg transition-all',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors',
    danger: 'bg-danger hover:bg-red-600 text-white font-semibold rounded-xl shadow-md shadow-red-500/30 transition-all',
    outline: 'border-1.5 border-slate-200 dark:border-slate-700 hover:border-secondary-400 dark:hover:border-secondary-500 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors',
  };
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed', sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
