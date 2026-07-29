import Papa from 'papaparse';
import type { ContactRecord } from '../types/contact';

function downloadCsv(csvContent: string, filename: string) {
  // BOM prefix ensures Excel opens UTF-8 CSVs correctly.
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportWhatsAppCsv(records: ContactRecord[]) {
  const rows = records
    .filter((r) => r.status === 'valid')
    .map((r) => ({ Name: r.name, Phone: r.cleanedPhone }));
  downloadCsv(Papa.unparse(rows), 'whatsapp-broadcast-list.csv');
}

export function exportInvalidCsv(records: ContactRecord[]) {
  const rows = records
    .filter((r) => r.status === 'invalid')
    .map((r) => ({ Name: r.name, 'Original Phone': r.originalPhone, Reason: r.reason ?? '' }));
  downloadCsv(Papa.unparse(rows), 'invalid-numbers.csv');
}

export function exportDuplicateCsv(records: ContactRecord[]) {
  const rows = records
    .filter((r) => r.status === 'duplicate')
    .map((r) => ({ Name: r.name, Phone: r.cleanedPhone ?? r.originalPhone, Reason: r.reason ?? '' }));
  downloadCsv(Papa.unparse(rows), 'duplicate-numbers.csv');
}

export function exportMissingCsv(records: ContactRecord[]) {
  const rows = records
    .filter((r) => r.status === 'missing')
    .map((r) => ({ Name: r.name, City: r.city, Address: r.address }));
  downloadCsv(Papa.unparse(rows), 'missing-numbers.csv');
}

export function exportLandlineCsv(records: ContactRecord[]) {
  const rows = records
    .filter((r) => r.status === 'landline')
    .map((r) => ({ Name: r.name, 'Original Phone': r.originalPhone, Reason: r.reason ?? '' }));
  downloadCsv(Papa.unparse(rows), 'landline-numbers.csv');
}
