import { useMemo, useState, forwardRef } from 'react';
import { ChevronUp, ChevronDown, Search, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useContactStore } from '../../store/contactStore';
import { useDebounce } from '../../hooks/useDebounce';
import type { ContactRecord, ContactStatus } from '../../types/contact';

type SortKey = 'name' | 'cleanedPhone' | 'city' | 'status';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const FILTERS = ['all', 'valid', 'invalid', 'duplicate', 'landline', 'missing'] as const;

export const ContactsTable = forwardRef<HTMLInputElement>((_, searchRef) => {
  const { records, removeRecord } = useContactStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const debouncedQuery = useDebounce(query, 200);

  const filtered = useMemo(() => {
    let result = records;
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.originalPhone.includes(q) ||
          (r.cleanedPhone ?? '').includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const av = (a[sortKey] ?? '').toString().toLowerCase();
      const bv = (b[sortKey] ?? '').toString().toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [records, debouncedQuery, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'cleanedPhone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, city…  (Ctrl+K)"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-500">
              {columns.map((col) => (
                <th key={col.key} className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort(col.key)}>
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => (
              <Row key={r.id} record={r} onDelete={() => removeRecord(r.id)} />
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>· {filtered.length} results</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
});
ContactsTable.displayName = 'ContactsTable';

function Row({
  record,
  onDelete,
}: {
  record: ContactRecord;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-slate-700/60 hover:bg-slate-800/40">
      <td className="px-4 py-3 text-slate-200">
        {record.name}
      </td>

      <td className="px-4 py-3 font-mono text-slate-300">
        {(record.cleanedPhone ?? record.originalPhone) || "—"}
      </td>

      <td className="px-4 py-3 text-slate-400">
        {record.city || "—"}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={record.status} />
      </td>

      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          title="Remove row"
        >
          <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-400" />
        </Button>
      </td>
    </tr>
  );
}
