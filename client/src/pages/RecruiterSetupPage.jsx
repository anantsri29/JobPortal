import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Building2, Upload } from 'lucide-react';

const RecruiterSetupPage = () => {
  const [form, setForm] = useState({ name: '', website: '', description: '', industry: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append('photo', logoFile);
        formData.append('type', 'logo');
        await api.post('/upload/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await api.post('/recruiter/company', form);
      await refreshUser();
      toast.success('Company profile created!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center py-10 px-4">
      <div className="card max-w-lg w-full shadow-card border-primary-100 dark:border-primary-900/30 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Setup Your Company</h1>
          <p className="text-slate-500 mt-1">Tell candidates about your organization</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Logo</label>
            <label className="cursor-pointer flex items-center gap-2 btn-secondary w-fit">
              <Upload className="w-4 h-4" /> Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
            </label>
            {logoFile && <span className="text-sm text-gray-500 ml-2">{logoFile.name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field" placeholder="https://acme.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field" placeholder="Technology, Finance, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={4} placeholder="About your company..." />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterSetupPage;
