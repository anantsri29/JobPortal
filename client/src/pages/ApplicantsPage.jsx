import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Users, Download, ExternalLink, ChevronDown } from 'lucide-react';

const statusOptions = ['pending', 'reviewed', 'shortlisted', 'rejected'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const { socket } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = () => {
    Promise.all([
      api.get(`/applications/job/${jobId}`),
      api.get(`/jobs/${jobId}`),
    ])
      .then(([appsRes, jobRes]) => {
        setApplicants(appsRes.data);
        setJob(jobRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 animate-slide-up">
        <div className="mb-8">
          <Link to="/recruiter/jobs" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">← Back to Jobs</Link>
          <h1 className="section-title text-2xl md:text-3xl mt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            Applicants for {job?.title}
          </h1>
          <p className="text-gray-500">{applicants.length} applicant(s)</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="card skeleton h-24 rounded-xl" />)}
          </div>
        ) : applicants.length > 0 ? (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div key={app._id} className="card">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {app.candidate?.profilePhoto ? (
                        <img src={app.candidate.profilePhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-600 font-bold">{app.candidate?.name?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.candidate?.name}</h3>
                      <p className="text-sm text-gray-500">{app.candidate?.email}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="badge bg-primary-100 text-primary-800">{app.matchScore}% match</span>
                        <span className="text-xs text-gray-400">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`input-field py-1 px-3 text-sm capitalize appearance-none pr-8 ${statusColors[app.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-white text-gray-800">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      className="btn-secondary text-sm"
                    >
                      {expandedId === app._id ? 'Hide' : 'View'} Profile
                    </button>
                  </div>
                </div>

                {expandedId === app._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {app.candidate?.skills?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {app.candidate.skills.map((s) => (
                            <span key={s} className="badge bg-gray-100 text-gray-700">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {app.coverLetter && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Cover Letter</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.coverLetter}</p>
                      </div>
                    )}
                    <div className="flex gap-3">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-1">
                          <Download className="w-4 h-4" /> Download Resume
                        </a>
                      )}
                      {app.candidate?.username && (
                        <Link to={`/profile/${app.candidate.username}`} className="btn-outline text-sm flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" /> Full Profile
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-gray-500">No applicants yet for this job</div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;
