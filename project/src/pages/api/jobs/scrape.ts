import { NextApiRequest, NextApiResponse } from 'next';
import { scrapeNasdaqJobs, saveJobsToDB } from '../../../services/jobScraper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const jobs = await scrapeNasdaqJobs();
    await saveJobsToDB(jobs);
    res.status(200).json({ message: `Successfully scraped ${jobs.length} jobs` });
  } catch (error) {
    console.error('Error in job scraping endpoint:', error);
    res.status(500).json({ message: 'Error scraping jobs' });
  }
}