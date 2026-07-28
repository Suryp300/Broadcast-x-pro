import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { useFileUpload } from '../../hooks/useFileUpload';

const ACCEPTED = ['.xlsx', '.xls', '.csv'];

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleFile, progress, isLoading } = useFileUpload();

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        100% local &middot; nothing leaves your browser
      </div>

      <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
        Broadcast Builder Pro
      </h1>
      <p className="mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
        Convert Excel contacts into WhatsApp Broadcast CSV in one click.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`group mt-10 flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
        }`}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-105">
          <UploadCloud className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-slate-200">Drag & drop your contact file here</p>
        <p className="mt-1 text-xs text-slate-500">or click to browse from your computer</p>

        <Button
          className="mt-6"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Choose Excel File
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-600">
          {ACCEPTED.map((ext) => (
            <span key={ext} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 font-mono">
              {ext}
            </span>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 w-full">
          <Progress value={progress} />
          <p className="mt-2 text-xs text-slate-500">Reading and parsing your file…</p>
        </div>
      )}
    </div>
  );
}
