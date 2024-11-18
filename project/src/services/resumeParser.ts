import { PrismaClient } from '@prisma/client';
import { NlpManager } from 'node-nlp';
import pdf from 'pdf-parse';

const prisma = new PrismaClient();
const nlp = new NlpManager({ languages: ['en'] });

interface ParsedResume {
  text: string;
  keywords: string[];
}

export async function parseResume(buffer: Buffer, fileType: string): Promise<ParsedResume> {
  let text = '';
  
  if (fileType === 'application/pdf') {
    const pdfData = await pdf(buffer);
    text = pdfData.text;
  } else {
    // Handle DOC/DOCX files
    // Implementation needed for DOC/DOCX parsing
    throw new Error('DOC/DOCX parsing not implemented yet');
  }

  // Extract keywords using NLP
  const keywords = await extractKeywords(text);
  
  return {
    text,
    keywords
  };
}

async function extractKeywords(text: string): Promise<string[]> {
  // Train the NLP manager with common job-related terms
  await trainNLP();
  
  // Extract entities and keywords
  const result = await nlp.process('en', text);
  const entities = result.entities.map(e => e.entity);
  
  // Add custom keyword extraction logic here
  // This is a simplified example
  const commonJobKeywords = ['javascript', 'python', 'react', 'node.js', 'aws'];
  const foundKeywords = commonJobKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return [...new Set([...entities, ...foundKeywords])];
}

async function trainNLP() {
  // Add entities for skills, job titles, etc.
  nlp.addNamedEntityText('skill', 'javascript', ['en'], ['JavaScript', 'JS', 'ECMAScript']);
  nlp.addNamedEntityText('skill', 'python', ['en'], ['Python', 'py']);
  // Add more entities as needed
  
  await nlp.train();
}