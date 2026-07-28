import { useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { UploadZone } from './features/upload/UploadZone';
import { ColumnMapper } from './features/mapping/ColumnMapper';
import { StatsGrid } from './features/dashboard/StatsGrid';
import { ContactsTable } from './features/table/ContactsTable';
import { ExportPanel } from './features/export/ExportPanel';
import { ToastContainer } from './components/ui/ToastContainer';
import { useContactStore } from './store/contactStore';
import { useSettingsStore } from './store/settingsStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const step = useContactStore((s) => s.step);
  const theme = useSettingsStore((s) => s.theme);
  const searchRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts(() => searchRef.current?.focus());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-slate-200">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        {step === 'upload' && <UploadZone />}
        {step === 'mapping' && <ColumnMapper />}
        {step === 'dashboard' && (
          <div className="space-y-6 py-8">
            <StatsGrid />
            <ExportPanel />
            <ContactsTable ref={searchRef} />
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}
