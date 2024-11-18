import puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';
import getDb from '../lib/db';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  url: string;
  source: string;
}

export async function scrapeNasdaqJobs(): Promise<JobPosting[]> {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const jobs: JobPosting[] = [];

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // List of job boards to scrape
    const jobBoards = [
      {
        company: 'Microsoft',
        url: 'https://careers.microsoft.com/professionals/us/en/search-results',
        selector: '.jobs-list .job-item'
      },
      {
        company: 'Apple',
        url: 'https://jobs.apple.com/en-us/search?team=apps-and-frameworks',
        selector: '.table-row'
      },
      {
        company: 'Amazon',
        url: 'https://www.amazon.jobs/en/search?base_query=software',
        selector: '.job-tile'
      }
    ];

    for (const board of jobBoards) {
      try {
        console.log(`Scraping ${board.company} jobs...`);
        await page.goto(board.url, { 
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        
        await page.waitForSelector(board.selector, { timeout: 5000 });

        const jobListings = await page.evaluate((selector) => {
          const listings = document.querySelectorAll(selector);
          return Array.from(listings).map(listing => ({
            title: listing.querySelector('h2, h3, .job-title')?.textContent?.trim() || '',
            description: listing.querySelector('p, .description, .job-description')?.textContent?.trim() || '',
            location: listing.querySelector('.location, .job-location')?.textContent?.trim() || '',
            url: listing.querySelector('a')?.href || ''
          }));
        }, board.selector);

        console.log(`Found ${jobListings.length} jobs from ${board.company}`);

        jobListings.forEach(listing => {
          if (listing.title && listing.url) {
            jobs.push({
              id: randomUUID(),
              title: listing.title,
              company: board.company,
              description: listing.description,
              location: listing.location,
              url: listing.url,
              source: 'nasdaq'
            });
          }
        });
      } catch (error) {
        console.error(`Error scraping ${board.company}:`, error);
      }
    }
  } finally {
    await browser.close();
  }

  return jobs;
}

export async function saveJobsToDB(jobs: JobPosting[]): Promise<void> {
  if (jobs.length === 0) {
    console.log('No jobs to save');
    return;
  }

  const db = await getDb();
  
  for (const job of jobs) {
    try {
      await db.run(`
        INSERT OR REPLACE INTO job_postings 
        (id, title, company, description, location, salary, url, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [job.id, job.title, job.company, job.description, job.location, job.salary, job.url, job.source]);
    } catch (error) {
      console.error('Error saving job to database:', error);
    }
  }
}

export async function scrapeAndSaveJobs(): Promise<void> {
  try {
    console.log('Starting job scraping...');
    const jobs = await scrapeNasdaqJobs();
    console.log(`Found ${jobs.length} jobs total`);
    
    if (jobs.length > 0) {
      console.log('Saving jobs to database...');
      await saveJobsToDB(jobs);
      console.log('Jobs saved successfully');
    }
  } catch (error) {
    console.error('Error in scrape and save:', error);
    throw error;
  }
}