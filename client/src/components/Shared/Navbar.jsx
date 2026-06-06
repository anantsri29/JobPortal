import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Briefcase, Sun, Moon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'recruiter'
    ? '/recruiter/dashboard'
    : user?.role === 'admin'
    ? '/admin'
    : '/dashboard';

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        location.pathname === to || location.pathname.startsWith(to + '/')
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
          : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">JobPortal</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLink('/jobs', 'Browse Jobs')}
            {user && navLink(dashboardLink, 'Dashboard')}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to={user.role === 'candidate' ? `/profile/${user.username}` : dashboardLink}
                  className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-500 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
