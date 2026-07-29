export type ContactStatus = 'valid' | 'invalid' | 'landline' | 'duplicate' | 'missing';

export interface ContactRecord {
  id: string;
  rowIndex: number;
  name: string;
  city: string;
  address: string;
  originalPhone: string;
  cleanedPhone: string | null; // E.164-style +91XXXXXXXXXX, only set when valid
  status: ContactStatus;
  reason: string | null;
}

export interface ColumnMapping {
  name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
}

export interface Stats {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
  landline: number;
  missing: number;
}

