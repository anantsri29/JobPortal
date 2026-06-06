import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back!');
      if (data.role === 'recruiter') {
        navigate(data.onboardingComplete ? '/recruiter/dashboard' : '/recruiter/setup');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(data.onboardingComplete ? '/dashboard' : '/onboarding');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-card border-primary-100 dark:border-primary-900/30">
      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••"
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
        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
