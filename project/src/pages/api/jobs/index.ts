import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { role, location } = req.query;
    let query = 'SELECT * FROM job_postings WHERE 1=1';
    const params: any[] = [];

    if (role) {
      query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)';
      const searchTerm = `%${role.toString().toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (location) {
      query += ' AND LOWER(location) LIKE ?';
      params.push(`%${location.toString().toLowerCase()}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const stmt = db.prepare(query);
    const jobs = stmt.all(...params);
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
}