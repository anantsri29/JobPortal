import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Shared/Navbar';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, IndianRupee, Clock, Building2, Send } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await api.post(`/applications/apply/${id}`, { coverLetter });
      toast.success('Application submitted successfully!');
      setShowApply(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L per annum`;
    return min ? `₹${(min / 100000).toFixed(1)}L+` : `Up to ₹${(max / 100000).toFixed(1)}L`;
  };

  if (loading) {
    return (
      <div className="page-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="card animate-pulse shadow-card">
            <div className="skeleton h-8 w-2/3 rounded mb-4" />
            <div className="skeleton h-4 w-1/3 rounded mb-6" />
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 animate-slide-up">
        <div className="card mb-6 shadow-card border-primary-100 dark:border-primary-900/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-500" />
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pt-2">
            <div className="flex gap-4">
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/40 dark:to-violet-900/40 items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h1>
                <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg">{job.company}</p>
              </div>
            </div>
            {user?.role === 'candidate' && job.isActive && (
              <button onClick={() => setShowApply(true)} className="btn-primary flex items-center gap-2 !px-6 !py-3">
                <Send className="w-4 h-4" /> Apply Now
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { icon: MapPin, text: job.location },
              { icon: Briefcase, text: job.jobType, cap: true },
              { icon: IndianRupee, text: formatSalary(job.salaryMin, job.salaryMax) },
            ].map(({ icon: Icon, text, cap }) => (
              <span key={text} className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg ${cap ? 'capitalize' : ''}`}>
                <Icon className="w-3.5 h-3.5 text-primary-500" />{text}
              </span>
            ))}
            <span className="badge bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 capitalize">{job.experienceLevel} experience</span>
            {job.deadline && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5" />Apply by {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {job.skillsRequired?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Apply Modal */}
        {showApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApply(false)} />
            <div className="relative card max-w-lg w-full shadow-2xl border-primary-100 dark:border-primary-900/30 animate-slide-up">
              <h3 className="font-display text-xl font-bold mb-1">Apply for {job.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Your uploaded resume will be attached automatically.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field"
                  rows={5}
                  placeholder="Tell the recruiter why you're a great fit..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleApply} disabled={applying} className="btn-primary">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
