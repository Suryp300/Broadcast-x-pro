import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { cn } from '../../utils/cn';

const ICONS = { success: CheckCircle2, error: XCircle, info: Info } as const;

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex animate-slide-in items-start gap-3 rounded-xl border bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur',
              toast.type === 'success' && 'border-primary/30',
              toast.type === 'error' && 'border-red-500/30',
              toast.type === 'info' && 'border-slate-700'
            )}
          >
            <Icon
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0',
                toast.type === 'success' && 'text-primary',
                toast.type === 'error' && 'text-red-400',
                toast.type === 'info' && 'text-slate-400'
              )}
            />
            <p className="flex-1 text-sm text-slate-200">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="text-slate-500 hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
