import { create } from 'zustand';
import type { ContactRecord, ColumnMapping, Stats } from '../types/contact';
import type { RawRow } from '../utils/fileParser';
import { buildContactRecords, computeStats } from '../utils/processContacts';

type Step = 'upload' | 'mapping' | 'dashboard';

interface ContactState {
  step: Step;
  fileName: string | null;
  columns: string[];
  rawRows: RawRow[];
  mapping: ColumnMapping;
  records: ContactRecord[];
  stats: Stats;
  history: ContactRecord[][];
  future: ContactRecord[][];

  setFile: (fileName: string, columns: string[], rawRows: RawRow[]) => void;
  setMapping: (mapping: ColumnMapping) => void;
  process: () => void;
  removeRecord: (id: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const emptyMapping: ColumnMapping = { name: null, phone: null, city: null, address: null };
const emptyStats: Stats = { total: 0, valid: 0, invalid: 0, duplicate: 0, landline: 0, missing: 0 };

export const useContactStore = create<ContactState>((set, get) => ({
  step: 'upload',
  fileName: null,
  columns: [],
  rawRows: [],
  mapping: emptyMapping,
  records: [],
  stats: emptyStats,
  history: [],
  future: [],

  setFile: (fileName, columns, rawRows) => set({ fileName, columns, rawRows, step: 'mapping' }),

  setMapping: (mapping) => set({ mapping }),

  process: () => {
    const { rawRows, mapping } = get();
    const records = buildContactRecords(rawRows, mapping);
    set({ records, stats: computeStats(records), step: 'dashboard', history: [], future: [] });
  },

  removeRecord: (id) => {
    const { records, history } = get();
    const next = records.filter((r) => r.id !== id);
    set({ records: next, stats: computeStats(next), history: [...history, records], future: [] });
  },

  undo: () => {
    const { history, records, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      records: previous,
      stats: computeStats(previous),
      history: history.slice(0, -1),
      future: [records, ...future],
    });
  },

  redo: () => {
    const { future, records, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ records: next, stats: computeStats(next), future: future.slice(1), history: [...history, records] });
  },

  reset: () =>
    set({
      step: 'upload',
      fileName: null,
      columns: [],
      rawRows: [],
      mapping: emptyMapping,
      records: [],
      stats: emptyStats,
      history: [],
      future: [],
    }),
}));
