import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import JobCard from '../components/Shared/JobCard';
import { SkeletonJobCard } from '../components/Shared/Skeleton';
import { useAuth } from '../context/AuthContext';
import { User, FileText, Sparkles, Clock } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shortlisted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/candidate/dashboard')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 animate-slide-up">
          <h1 className="section-title text-2xl md:text-3xl">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="section-subtitle mt-2">Here's your personalized job search overview</p>
        </div>

        {/* Profile completion */}
        <div className="card mb-10 border-primary-100 dark:border-primary-900/30 shadow-glow/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-slate-900 dark:text-white">Profile Completion</span>
            </div>
            <span className="text-2xl font-display font-bold gradient-text">{data?.profileComplete || user?.profileComplete || 0}%</span>
          </div>
          <div className="progress-bar h-3">
            <div
              className="progress-fill"
              style={{ width: `${data?.profileComplete || user?.profileComplete || 0}%` }}
            />
          </div>
          {(data?.profileComplete || 0) < 100 && (
            <Link to="/onboarding" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline mt-3 inline-flex items-center gap-1">
              Complete your profile for better job matches →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Recent Applications
              </h2>
              <Link to="/applications" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
            </div>
            {loading ? (
              <SkeletonJobCard />
            ) : data?.applications?.length > 0 ? (
              <div className="space-y-3">
                {data.applications.map((app) => (
                  <div key={app._id} className="card-hover !p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{app.job?.title}</p>
                      <p className="text-sm text-slate-500">{app.job?.company}</p>
                    </div>
                    <span className={`badge capitalize ${statusColors[app.status]}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center text-gray-500 py-8">
                No applications yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link>
              </div>
            )}
          </div>

          {/* AI Suggested Jobs */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                AI Suggested Jobs
              </h2>
            </div>
            {loading ? (
              <SkeletonJobCard />
            ) : data?.suggestedJobs?.length > 0 ? (
              <div className="space-y-3">
                {data.suggestedJobs.slice(0, 3).map((job) => (
                  <JobCard key={job._id} job={job} showMatch />
                ))}
              </div>
            ) : (
              <div className="card text-center text-gray-500 py-8">
                Add skills to your profile to get AI job suggestions
              </div>
            )}
          </div>
        </div>

        {/* Recently Posted Jobs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              Recently Posted Jobs
            </h2>
            <Link to="/jobs" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <SkeletonJobCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.recentJobs?.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
