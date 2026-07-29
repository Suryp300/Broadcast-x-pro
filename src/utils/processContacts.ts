import { cleanPhoneNumber } from './phoneCleaner';
import type { ContactRecord, ColumnMapping, Stats, ContactStatus } from '../types/contact';
import type { RawRow } from './fileParser';

export function buildContactRecords(rows: RawRow[], mapping: ColumnMapping): ContactRecord[] {
  const seenPhones = new Set<string>();
  const records: ContactRecord[] = [];

  rows.forEach((row, index) => {
    const rawName = mapping.name ? row[mapping.name] : '';
    const name = (rawName ?? '').toString().trim() || `Contact ${index + 1}`;
    const city = (mapping.city ? row[mapping.city] : '') ?? '';
    const address = (mapping.address ? row[mapping.address] : '') ?? '';
    const originalPhone = (mapping.phone ? row[mapping.phone] : '') ?? '';

    const cleaned = cleanPhoneNumber(originalPhone);

    // Toll-free is folded into the "landline" bucket for reporting purposes,
    // the distinct reason string is preserved in exports.
    let status: ContactStatus = cleaned.status === 'tollfree' ? 'landline' : (cleaned.status as ContactStatus);
    let reason = cleaned.reason;

    if (status === 'valid' && cleaned.e164) {
      if (seenPhones.has(cleaned.e164)) {
        status = 'duplicate';
        reason = 'Duplicate phone number (first occurrence kept)';
      } else {
        seenPhones.add(cleaned.e164);
      }
    }

    records.push({
      id: `row-${index}`,
      rowIndex: index,
      name,
      city: city.toString().trim(),
      address: address.toString().trim(),
      originalPhone: originalPhone.toString().trim(),
      cleanedPhone: cleaned.e164,
      status,
      reason,
    });
  });

  return records;
}

export function computeStats(records: ContactRecord[]): Stats {
  return {
    total: records.length,
    valid: records.filter((r) => r.status === 'valid').length,
    invalid: records.filter((r) => r.status === 'invalid').length,
    duplicate: records.filter((r) => r.status === 'duplicate').length,
    landline: records.filter((r) => r.status === 'landline').length,
    missing: records.filter((r) => r.status === 'missing').length,
  };
}
