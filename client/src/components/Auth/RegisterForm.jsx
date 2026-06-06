import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, UserCircle, Building2 } from 'lucide-react';

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success('Account created successfully!');
      if (data.role === 'recruiter') {
        navigate('/recruiter/setup');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-card border-primary-100 dark:border-primary-900/30">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field pl-12"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field pl-12"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field pl-12 pr-12"
              placeholder="Min 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'candidate', label: 'Job Seeker', icon: UserCircle },
              { role: 'recruiter', label: 'Recruiter', icon: Building2 },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`py-4 px-4 rounded-2xl border-2 font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
                  form.role === role
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
