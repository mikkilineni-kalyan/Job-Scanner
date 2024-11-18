import React, { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  url: string;
  match_score: number;
}

interface JobListProps {
  selectedResume?: { id: string; type: string; } | null;
}

export default function JobList({ selectedResume }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        
        const url = selectedResume 
          ? `/api/jobs/matches?resumeId=${selectedResume.id}`
          : '/api/jobs/matches';
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedResume]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        {selectedResume 
          ? "No matching jobs found for your resume. Try uploading a different resume."
          : "Upload a resume to see matching jobs."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${job.match_score >= 90 ? 'bg-green-100 text-green-800' :
                job.match_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'}`}>
              {Math.round(job.match_score)}% Match
            </span>
          </div>
          
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>{job.location}</span>
            {job.salary && (
              <>
                <span>•</span>
                <span>{job.salary}</span>
              </>
            )}
          </div>
          
          <p className="mt-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>
          
          <div className="mt-4 flex justify-end space-x-4">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details
            </a>
            <button 
              onClick={() => {}} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Apply Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}