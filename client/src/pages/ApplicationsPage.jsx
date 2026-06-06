import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import { SkeletonCard } from '../components/Shared/Skeleton';
import { FileText, ExternalLink } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shortlisted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(({ data }) => setApplications(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 animate-slide-up">
        <h1 className="section-title text-2xl md:text-3xl mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          My Applications
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="card">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.job?.title}</h3>
                    <p className="text-primary-600">{app.job?.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      {app.matchScore > 0 && ` • ${app.matchScore}% match`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge capitalize ${statusColors[app.status]}`}>{app.status}</span>
                    <Link to={`/jobs/${app.job?._id}`} className="text-primary-600 hover:underline flex items-center gap-1 text-sm">
                      View Job <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
