import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="relative bg-slate-900 text-slate-400 py-16 mt-auto overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">JobPortal</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Find your dream job or hire the best talent. AI-powered job matching for better career outcomes.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Candidates</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/jobs" className="hover:text-primary-400 transition-colors duration-200">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-primary-400 transition-colors duration-200">Create Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Recruiters</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/register" className="hover:text-primary-400 transition-colors duration-200">Post a Job</Link></li>
            <li><Link to="/register" className="hover:text-primary-400 transition-colors duration-200">Find Candidates</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">About Us</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
