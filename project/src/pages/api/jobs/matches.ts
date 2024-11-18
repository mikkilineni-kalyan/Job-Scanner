import { NextApiRequest, NextApiResponse } from 'next';
import getDb from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const { resumeId } = req.query;

    // Get resume type if resumeId is provided
    let resumeType = 'general';
    if (resumeId) {
      const resume = await db.get('SELECT type FROM resumes WHERE id = ?', resumeId);
      if (resume) {
        resumeType = resume.type;
      }
    }

    // Query jobs with match scoring
    const jobs = await db.all(`
      SELECT 
        j.*,
        CASE 
          WHEN LOWER(j.title) LIKE ? THEN 95
          WHEN LOWER(j.description) LIKE ? THEN 85
          ELSE 70
        END as match_score
      FROM job_postings j
      WHERE 1=1
      ORDER BY match_score DESC, created_at DESC
      LIMIT 20
    `, [`%${resumeType}%`, `%${resumeType}%`]);

    // If no jobs found, return sample jobs
    if (!jobs || jobs.length === 0) {
      const sampleJobs = [
        {
          id: '1',
          title: 'Senior Data Engineer',
          company: 'Tech Corp',
          description: 'Looking for an experienced Data Engineer...',
          location: 'Remote',
          salary: '$150,000 - $200,000',
          url: '#',
          source: 'sample',
          match_score: 95
        },
        {
          id: '2',
          title: 'Python Developer',
          company: 'Software Inc',
          description: 'Python developer needed...',
          location: 'New York, NY',
          salary: '$120,000 - $160,000',
          url: '#',
          source: 'sample',
          match_score: 90
        }
      ];
      return res.status(200).json(sampleJobs);
    }

    res.status(200).json(jobs);

  } catch (error) {
    console.error('Error fetching job matches:', error);
    res.status(500).json({ message: 'Error fetching job matches' });
  }
}