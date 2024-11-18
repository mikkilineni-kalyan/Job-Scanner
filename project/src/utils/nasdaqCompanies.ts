import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface NasdaqCompany {
  symbol: string;
  name: string;
}

export async function loadNasdaqCompanies(): Promise<NasdaqCompany[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'nasdaq-listed.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any) => ({
      symbol: record.Symbol,
      name: record['Security Name'].split('-')[0].trim()
    }));
  } catch (error) {
    console.error('Error loading NASDAQ companies:', error);
    return [];
  }
}