import { useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import { useSettingsStore } from '../store/settingsStore';

export function useKeyboardShortcuts(onFocusSearch?: () => void) {
  const undo = useContactStore((s) => s.undo);
  const redo = useContactStore((s) => s.redo);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      const key = e.key.toLowerCase();

      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      } else if (key === 'k') {
        e.preventDefault();
        onFocusSearch?.();
      } else if (key === 'j') {
        e.preventDefault();
        toggleTheme();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, toggleTheme, onFocusSearch]);
}
