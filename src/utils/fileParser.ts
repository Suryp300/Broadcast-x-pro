import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export type RawRow = Record<string, string>;

export interface ParsedFile {
  columns: string[];
  rows: RawRow[];
  fileName: string;
}

export async function parseSpreadsheetFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') return parseCsv(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);

  throw new Error('Unsupported file type. Please upload a .xlsx, .xls, or .csv file.');
}

function parseCsv(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const columns = result.meta.fields ?? [];
        resolve({ columns, rows: result.data, fileName: file.name });
      },
      error: (err) => reject(err),
    });
  });
}

async function parseExcel(file: File): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
  const columns = json.length > 0 ? Object.keys(json[0]) : [];
  return { columns, rows: json, fileName: file.name };
}
