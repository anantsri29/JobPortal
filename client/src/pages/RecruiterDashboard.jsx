import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import { SkeletonCard } from '../components/Shared/Skeleton';
import { Briefcase, Users, Clock, Star, Plus, Eye } from 'lucide-react';

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/dashboard')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Jobs', value: data?.stats?.totalJobs || 0, icon: Briefcase, color: 'text-blue-600' },
    { label: 'Active Jobs', value: data?.stats?.activeJobs || 0, icon: Clock, color: 'text-green-600' },
    { label: 'Total Applicants', value: data?.stats?.totalApplicants || 0, icon: Users, color: 'text-purple-600' },
    { label: 'Shortlisted', value: data?.stats?.shortlisted || 0, icon: Star, color: 'text-yellow-600' },
  ];

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-10 animate-slide-up">
          <div>
            <h1 className="section-title text-2xl md:text-3xl">Recruiter <span className="gradient-text">Dashboard</span></h1>
            <p className="section-subtitle mt-2">Manage your job postings and applicants</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card !p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.includes('blue') ? 'from-blue-500 to-cyan-500' : color.includes('green') ? 'from-emerald-500 to-teal-500' : color.includes('purple') ? 'from-violet-500 to-purple-500' : 'from-amber-500 to-orange-500'} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '...' : value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Jobs */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Job Postings</h2>
              <Link to="/recruiter/jobs" className="text-sm text-primary-600 hover:underline">View all</Link>
            </div>
            {loading ? <SkeletonCard /> : data?.jobs?.length > 0 ? (
              <div className="space-y-3">
                {data.jobs.map((job) => (
                  <div key={job._id} className="card !p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-primary-600 hover:text-primary-700">
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-8 text-gray-500">
                No jobs posted yet. <Link to="/recruiter/post-job" className="text-primary-600 hover:underline">Post your first job</Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
            {loading ? <SkeletonCard /> : data?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplications.map((app) => (
                  <div key={app._id} className="card !p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{app.candidate?.name}</p>
                        <p className="text-sm text-gray-500">Applied for {app.job?.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{app.matchScore}% match • {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <span className="badge bg-yellow-100 text-yellow-800 capitalize">{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-8 text-gray-500">No applications yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
