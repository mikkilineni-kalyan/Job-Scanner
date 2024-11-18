import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ResumeUpload from '../components/ResumeUpload';
import ResumeList from '../components/ResumeList';
import JobList from '../components/JobList';

export default function Dashboard() {
  const [activeResume, setActiveResume] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Job Scanner Dashboard</title>
        <meta name="description" content="Manage your resumes and job applications" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Management</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <ResumeUpload />
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <ResumeList onSelect={setActiveResume} activeResume={activeResume} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Matching Jobs</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <JobList selectedResume={activeResume} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}