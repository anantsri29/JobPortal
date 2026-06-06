import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import TagInput from '../components/Shared/TagInput';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

const PostJobPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    skillsRequired: [],
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    experienceLevel: 'fresher',
    deadline: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description,
          company: data.company,
          skillsRequired: data.skillsRequired || [],
          location: data.location,
          salaryMin: data.salaryMin || '',
          salaryMax: data.salaryMax || '',
          jobType: data.jobType,
          experienceLevel: data.experienceLevel,
          deadline: data.deadline ? data.deadline.split('T')[0] : '',
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        deadline: form.deadline || undefined,
      };
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job updated!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully!');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="section-title text-2xl">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="card shadow-card border-primary-100 dark:border-primary-900/20 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Senior React Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company *</label>
            <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={6} placeholder="Job responsibilities, requirements..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Required Skills</label>
            <TagInput tags={form.skillsRequired} onChange={(skills) => setForm({ ...form, skillsRequired: skills })} placeholder="Add skill and press Enter" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="Mumbai, India" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Salary (₹/year)</label>
              <input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} className="input-field" placeholder="500000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Salary (₹/year)</label>
              <input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} className="input-field" placeholder="1500000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} className="input-field">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Required</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="input-field">
                <option value="fresher">Fresher</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Application Deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
