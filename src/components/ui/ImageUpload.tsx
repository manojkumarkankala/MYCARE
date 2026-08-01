import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  shape?: 'square' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ImageUpload({ value, onChange, label = 'Upload Image', shape = 'square', size = 'md', className }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative group cursor-pointer overflow-hidden border-2 border-dashed transition-all flex items-center justify-center',
          sizeClasses[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-2xl',
          dragOver
            ? 'border-secondary-400 bg-secondary-50 dark:bg-secondary-900/30'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-secondary-400'
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-700 hover:bg-white"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(''); }}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-danger hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : loading ? (
          <Loader2 className="w-6 h-6 text-secondary-500 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            {shape === 'circle' ? <ImageIcon className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            <span className="text-[10px] font-medium">Click or drop</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  );
}
