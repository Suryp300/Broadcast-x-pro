import { Moon, Sun, Undo2, Redo2, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSettingsStore } from '../../store/settingsStore';
import { useContactStore } from '../../store/contactStore';

export function Header() {
  const { theme, toggleTheme } = useSettingsStore();
  const { step, fileName, undo, redo, reset, history, future } = useContactStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight text-white">Broadcast Builder Pro</h1>
            {fileName && <p className="text-xs leading-tight text-slate-500">{fileName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step === 'dashboard' && (
            <>
              <Button variant="ghost" size="icon" onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Shift+Z)">
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start Over
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme (Ctrl+J)">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
