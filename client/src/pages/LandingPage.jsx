import { Link } from 'react-router-dom';
import { Briefcase, Search, Sparkles, Users, Building2, TrendingUp, ArrowRight, Zap, Shield } from 'lucide-react';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';

const stats = [
  { label: 'Active Jobs', value: '10,000+', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { label: 'Companies', value: '2,500+', icon: Building2, color: 'from-violet-500 to-purple-500' },
  { label: 'Job Seekers', value: '50,000+', icon: Users, color: 'from-emerald-500 to-teal-500' },
  { label: 'Placements', value: '15,000+', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI Job Matching',
    description: 'Get personalized job recommendations based on your skills, experience, and qualifications.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Search,
    title: 'Smart Search & Filters',
    description: 'Find the perfect job with advanced filters for location, salary, job type, and experience level.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'One-Click Apply',
    description: 'Apply to jobs instantly with your uploaded resume. Track all applications in one place.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Recruiter Tools',
    description: 'Post jobs, manage applicants, and update application status with real-time notifications.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const LandingPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 text-white py-24 md:py-32">
      <div className="hero-blob w-96 h-96 bg-violet-400 -top-20 -right-20 animate-float" />
      <div className="hero-blob w-80 h-80 bg-primary-400 -bottom-20 -left-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="hero-blob w-64 h-64 bg-pink-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          AI-Powered Career Platform
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
          Find Your{' '}
          <span className="bg-gradient-to-r from-yellow-200 via-white to-violet-200 bg-clip-text text-transparent">
            Dream Job
          </span>{' '}
          Today
        </h1>
        <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with top companies, get AI-matched to perfect roles, and land your next career move — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/register"
            className="group bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/jobs"
            className="border-2 border-white/60 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 backdrop-blur-sm"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Quick search preview */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
            <Search className="w-5 h-5 text-white/70 ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search jobs by title, skills, or company..."
              className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none py-3 text-sm"
              readOnly
              onClick={() => window.location.href = '/jobs'}
            />
            <Link to="/jobs" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary-50 transition-colors flex-shrink-0">
              Search
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-20 -mt-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{value}</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-24 page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="section-title mb-4">Why Choose <span className="gradient-text">JobPortal</span>?</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to land your next role or find the perfect candidate.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, gradient }) => (
            <div key={title} className="card-hover text-center group">
              <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-slate-900 dark:text-white">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-violet-600 to-primary-700" />
      <div className="hero-blob w-96 h-96 bg-white -top-32 -right-32 opacity-10" />
      <div className="hero-blob w-80 h-80 bg-violet-300 -bottom-32 -left-32 opacity-10" />

      <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Take the Next Step?</h2>
        <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of professionals finding their dream careers every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:-translate-y-0.5"
          >
            Register as Job Seeker
          </Link>
          <Link
            to="/register"
            className="border-2 border-white/70 hover:bg-white/10 font-semibold py-4 px-8 rounded-2xl transition-all duration-200"
          >
            Register as Recruiter
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default LandingPage;
