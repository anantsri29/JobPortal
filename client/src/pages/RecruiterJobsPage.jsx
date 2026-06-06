import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, XCircle } from 'lucide-react';

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    api.get('/jobs/recruiter/my-jobs')
      .then(({ data }) => setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleClose = async (id) => {
    try {
      await api.patch(`/jobs/${id}/close`);
      toast.success('Job closed');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close');
    }
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <h1 className="section-title text-2xl md:text-3xl">My Job <span className="gradient-text">Postings</span></h1>
          <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="card skeleton h-20 rounded-xl" />)}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.location} • {job.jobType} • {job.experienceLevel}</p>
                  <span className={`badge mt-2 ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="View Applicants">
                    <Eye className="w-5 h-5 text-primary-600" />
                  </Link>
                  <Link to={`/recruiter/edit-job/${job._id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Edit">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </Link>
                  {job.isActive && (
                    <button onClick={() => handleClose(job._id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Close Job">
                      <XCircle className="w-5 h-5 text-yellow-600" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(job._id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Delete">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-gray-500">
            No jobs posted yet. <Link to="/recruiter/post-job" className="text-primary-600 hover:underline">Post your first job</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobsPage;
