import React from 'react';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
}

export default function JobCard({ title, company, location, salary, description, url }: JobCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{company}</p>
      
      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
        <span>{location}</span>
        {salary && (
          <>
            <span>•</span>
            <span>{salary}</span>
          </>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-600 line-clamp-3">{description}</p>
      
      <div className="mt-4 flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Job
        </a>
      </div>
    </div>
  );
}