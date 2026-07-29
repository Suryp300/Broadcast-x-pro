import { useCallback, useState } from 'react';
import { parseSpreadsheetFile } from '../utils/fileParser';
import { useContactStore } from '../store/contactStore';
import { useToastStore } from '../store/toastStore';

export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const setFile = useContactStore((s) => s.setFile);
  const push = useToastStore((s) => s.push);

  const handleFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setProgress(10);

      const ticker = setInterval(() => {
        setProgress((p) => (p < 85 ? p + Math.random() * 15 : p));
      }, 120);

      try {
        const parsed = await parseSpreadsheetFile(file);
        clearInterval(ticker);
        setProgress(100);

        if (parsed.rows.length === 0) {
          push('The file appears to be empty.', 'error');
          return;
        }

        setFile(parsed.fileName, parsed.columns, parsed.rows);
        push(`Loaded ${parsed.rows.length} rows from ${parsed.fileName}`, 'success');
      } catch (err) {
        clearInterval(ticker);
        push(err instanceof Error ? err.message : 'Failed to parse file', 'error');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 400);
      }
    },
    [setFile, push]
  );

  return { handleFile, progress, isLoading };
}
