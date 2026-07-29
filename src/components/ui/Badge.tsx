import { cn } from '../../utils/cn';
import type { ContactStatus } from '../../types/contact';

const STYLES: Record<ContactStatus, string> = {
  valid: 'bg-primary/15 text-primary border-primary/30',
  invalid: 'bg-red-500/15 text-red-400 border-red-500/30',
  duplicate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  landline: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  missing: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const LABELS: Record<ContactStatus, string> = {
  valid: 'Valid',
  invalid: 'Invalid',
  duplicate: 'Duplicate',
  landline: 'Landline',
  missing: 'Missing',
};

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
