import Navbar from '../components/Shared/Navbar';
import LoginForm from '../components/Auth/LoginForm';
import { Sparkles } from 'lucide-react';

const LoginPage = () => (
  <div className="min-h-screen page-bg">
    <Navbar />
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/30 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your job search</p>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
);

export default LoginPage;
