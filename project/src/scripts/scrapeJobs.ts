import { scrapeAndSaveJobs } from '../services/jobScraper';

async function main(): Promise<void> {
  try {
    console.log('Starting job scraper...');
    await scrapeAndSaveJobs();
    console.log('Job scraping completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during job scraping:', error);
    process.exit(1);
  }
}

void main();