import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

let db: any = null;

async function getDb() {
  if (db) return db;

  const dbPath = join(process.cwd(), 'job-scanner.db');
  
  // Use verbose mode for better error messages
  sqlite3.verbose();

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT,
        location TEXT,
        salary TEXT,
        url TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export default getDb;