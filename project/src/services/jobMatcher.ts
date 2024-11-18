import { NlpManager } from 'node-nlp';
import db from '../lib/db';

const nlp = new NlpManager({ languages: ['en'] });

interface MatchScore {
  jobId: string;
  score: number;
}

export async function findMatchingJobs(userId: string): Promise<MatchScore[]> {
  // Get user's latest resume
  const resume = db.prepare(`
    SELECT * FROM resumes 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(userId);

  if (!resume) {
    return [];
  }

  // Get all jobs
  const jobs = db.prepare(`
    SELECT * FROM job_postings
    ORDER BY created_at DESC
  `).all();

  // Calculate match scores
  const matchScores: MatchScore[] = await Promise.all(
    jobs.map(async (job) => {
      const score = await calculateMatchScore(resume, job);
      return { jobId: job.id, score };
    })
  );

  // Sort by score descending
  return matchScores.sort((a, b) => b.score - a.score);
}

async function calculateMatchScore(resume: any, job: any): Promise<number> {
  const resumeKeywords = new Set(resume.keywords.toLowerCase().split(',').map((k: string) => k.trim()));
  const jobKeywords = await extractKeywordsFromJob(job);
  
  let matchCount = 0;
  let totalKeywords = jobKeywords.size;

  // Calculate matches
  for (const keyword of resumeKeywords) {
    if (jobKeywords.has(keyword)) {
      matchCount++;
    }
  }

  // Calculate score as percentage
  return totalKeywords > 0 ? (matchCount / totalKeywords) * 100 : 0;
}

async function extractKeywordsFromJob(job: any): Promise<Set<string>> {
  const text = `${job.title} ${job.description}`.toLowerCase();
  const result = await nlp.process('en', text);
  
  const keywords = new Set<string>();
  
  // Add entities from NLP
  result.entities.forEach((entity: any) => {
    keywords.add(entity.entity.toLowerCase());
  });

  // Add common tech keywords
  const techKeywords = ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes'];
  techKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      keywords.add(keyword);
    }
  });

  return keywords;
}