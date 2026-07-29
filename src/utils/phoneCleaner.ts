export type PhoneStatus = 'valid' | 'invalid' | 'landline' | 'tollfree' | 'missing';

export interface PhoneCleanResult {
  status: PhoneStatus;
  core: string | null; // resolved 10-digit mobile number, if any
  e164: string | null; // +91XXXXXXXXXX
  reason: string | null;
}

// Landline STD codes to reject, mapped to city for a friendly reason message.
const STD_CODES: Record<string, string> = {
  '040': 'Hyderabad',
  '020': 'Pune',
  '022': 'Mumbai',
  '011': 'Delhi',
  '033': 'Kolkata',
  '080': 'Bangalore',
  '044': 'Chennai',
  '0471': 'Thiruvananthapuram',
  '0484': 'Kochi',
};

const TOLL_FREE_PREFIXES = ['1800', '1860', '140'];

function extractDigits(raw: string): string {
  // Strip everything except digits (spaces, -, /, ., (), + are all discarded here;
  // the leading "+" is not needed once we work purely with digit counts).
  return raw.replace(/[^\d]/g, '');
}

function matchesPrefixList(digits: string, prefixes: string[]): string | null {
  for (const prefix of prefixes) {
    if (digits.startsWith(prefix)) return prefix;
  }
  return null;
}

/**
 * Cleans and classifies a single raw phone number string.
 * Handles: spaces, hyphens, slashes, dots, parentheses, +91, 91, and leading 0.
 */
export function cleanPhoneNumber(raw: string | null | undefined): PhoneCleanResult {
  if (raw === null || raw === undefined || !raw.toString().trim()) {
    return { status: 'missing', core: null, e164: null, reason: 'No phone number provided' };
  }

  const digits = extractDigits(raw.toString());

  if (!digits) {
    return { status: 'missing', core: null, e164: null, reason: 'No digits found in value' };
  }

  // The 91-stripped view lets us catch STD/toll-free numbers written with a country code.
  const digitsSansCountry =
    digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;

  // 1. Toll-free numbers (1800 / 1860 / 140-series)
  const tollFreeMatch =
    matchesPrefixList(digits, TOLL_FREE_PREFIXES) ?? matchesPrefixList(digitsSansCountry, TOLL_FREE_PREFIXES);
  if (tollFreeMatch) {
    return { status: 'tollfree', core: null, e164: null, reason: `Toll-free number (${tollFreeMatch}...)` };
  }

  // 2. Landlines by STD code — checked before mobile parsing so an "080..." Bangalore
  //    number is never mistaken for a mobile number starting with 8.
  const stdMatch =
    matchesPrefixList(digits, Object.keys(STD_CODES)) ??
    matchesPrefixList(digitsSansCountry, Object.keys(STD_CODES));
  if (stdMatch) {
    return {
      status: 'landline',
      core: null,
      e164: null,
      reason: `Landline / STD code ${stdMatch} (${STD_CODES[stdMatch]})`,
    };
  }

  // 3. Resolve a 10-digit mobile core from common formats.
  let core: string | null = null;

  if (digits.length === 10) {
    core = digits;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    core = digits.slice(2); // +91 / 91 country code
  } else if (digits.length === 11 && digits.startsWith('0')) {
    core = digits.slice(1); // domestic trunk-prefix 0
  } else if (digits.length === 13 && digits.startsWith('091')) {
    core = digits.slice(3); // 0 + 91 combined
  }

  if (!core || core.length !== 10) {
    return { status: 'invalid', core: null, e164: null, reason: `Unexpected length (${digits.length} digits)` };
  }

  if (!/^[6-9]\d{9}$/.test(core)) {
    return {
      status: 'invalid',
      core,
      e164: null,
      reason: 'Must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9',
    };
  }

  return { status: 'valid', core, e164: `+91${core}`, reason: null };
}
