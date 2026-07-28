import { Download, MessageCircleMore, XCircle, Copy, PhoneOff, FileWarning } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useContactStore } from '../../store/contactStore';
import { useToastStore } from '../../store/toastStore';
import { exportWhatsAppCsv, exportInvalidCsv, exportDuplicateCsv, exportMissingCsv, exportLandlineCsv } from '../../utils/csvExport';

export function ExportPanel() {
  const { records, stats } = useContactStore();
  const push = useToastStore((s) => s.push);

  const actions = [
    { label: 'Download WhatsApp CSV', count: stats.valid, icon: MessageCircleMore, fn: exportWhatsAppCsv, variant: 'primary' as const },
    { label: 'Download Invalid CSV', count: stats.invalid, icon: XCircle, fn: exportInvalidCsv, variant: 'outline' as const },
    { label: 'Download Duplicate CSV', count: stats.duplicate, icon: Copy, fn: exportDuplicateCsv, variant: 'outline' as const },
    { label: 'Download Landline CSV', count: stats.landline, icon: PhoneOff, fn: exportLandlineCsv, variant: 'outline' as const },
    { label: 'Download Missing CSV', count: stats.missing, icon: FileWarning, fn: exportMissingCsv, variant: 'outline' as const },
  ];

  return (
    <Card>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-white">Export Files</h3>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {actions.map((a) => (
            <Button
              key={a.label}
              variant={a.variant}
              disabled={a.count === 0}
              onClick={() => {
                a.fn(records);
                push(`${a.label} started (${a.count} rows)`, 'success');
              }}
              className="justify-start"
            >
              <a.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{a.label}</span>
              <span className="ml-auto rounded-full bg-black/20 px-1.5 text-xs">{a.count}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
