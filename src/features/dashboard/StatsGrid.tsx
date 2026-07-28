import { Users, CheckCircle2, XCircle, Copy, PhoneOff, FileWarning, Send } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useContactStore } from '../../store/contactStore';

export function StatsGrid() {
  const stats = useContactStore((s) => s.stats);

  const cards = [
    { label: 'Total Records', value: stats.total, icon: Users, color: 'text-slate-300', bg: 'bg-slate-500/10' },
    { label: 'Valid', value: stats.valid, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Invalid', value: stats.invalid, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Duplicate', value: stats.duplicate, icon: Copy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Landline', value: stats.landline, icon: PhoneOff, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Missing', value: stats.missing, icon: FileWarning, color: 'text-slate-400', bg: 'bg-slate-500/10' },
    { label: 'Ready To Export', value: stats.valid, icon: Send, color: 'text-primary', bg: 'bg-primary/10', highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {cards.map((c) => (
        <Card key={c.label} className={c.highlight ? 'border-primary/40' : ''}>
          <div className="flex flex-col gap-3 p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg}`}>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{c.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
