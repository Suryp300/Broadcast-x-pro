import type { ColumnMapping } from '../types/contact';

const KEYWORDS: Record<keyof ColumnMapping, string[]> = {
  name: ['business name', 'shop name', 'company', 'client name', 'name'],
  phone: ['whatsapp number', 'whatsapp', 'mobile number', 'phone number', 'contact number', 'mobile', 'phone', 'contact', 'number'],
  city: ['city', 'town', 'district'],
  address: ['address', 'location', 'street'],
};

export function detectColumnMapping(columns: string[]): ColumnMapping {
  const result: ColumnMapping = { name: null, phone: null, city: null, address: null };

  (Object.keys(KEYWORDS) as (keyof ColumnMapping)[]).forEach((key) => {
    const match = columns.find((col) => {
      const normalized = col.toLowerCase().trim();
      return KEYWORDS[key].some((kw) => normalized === kw || normalized.includes(kw));
    });
    if (match) result[key] = match;
  });

  return result;
}
