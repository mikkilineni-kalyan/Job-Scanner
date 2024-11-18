import React, { useEffect, useState } from 'react';

interface Resume {
  id: string;
  type: string;
  createdAt: string;
  file_path: string;
}

interface ResumeListProps {
  onSelect: (resume: Resume | null) => void;
  activeResume: Resume | null;
}

export default function ResumeList({ onSelect, activeResume }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume/list');
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      const data = await response.json();
      setResumes(data);
      setError('');
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No resumes uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className={`p-4 rounded-lg border cursor-pointer transition-colors
            ${activeResume?.id === resume.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'}`}
          onClick={() => onSelect(resume)}
        >
          <div className="font-medium capitalize">
            {resume.type.replace(/_/g, ' ')}
          </div>
          <div className="text-sm text-gray-500">
            Uploaded {new Date(resume.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}