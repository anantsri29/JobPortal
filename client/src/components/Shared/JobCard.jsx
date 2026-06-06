import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Building2, ArrowRight } from 'lucide-react';

const JobCard = ({ job, showMatch = false }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    return min ? `₹${(min / 100000).toFixed(1)}L+` : `Up to ₹${(max / 100000).toFixed(1)}L`;
  };

  const getMatchColor = (score) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800';
    if (score >= 40) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <Link to={`/jobs/${job._id}`} className="card-hover block group">
      <div className="flex gap-4">
        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/40 dark:to-violet-900/40 items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
          <Building2 className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-3">
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mt-0.5">{job.company}</p>
            </div>
            {showMatch && job.matchScore !== undefined && (
              <span className={`badge flex-shrink-0 ${getMatchColor(job.matchScore)}`}>
                {job.matchScore}% Match
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5" />{job.location}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg capitalize">
              <Briefcase className="w-3.5 h-3.5" />{job.jobType}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <IndianRupee className="w-3.5 h-3.5" />{formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>

          {job.skillsRequired?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.skillsRequired.slice(0, 4).map((skill) => (
                <span key={skill} className="badge bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
                  {skill}
                </span>
              ))}
              {job.skillsRequired.length > 4 && (
                <span className="badge bg-slate-100 text-slate-500 dark:bg-slate-800">+{job.skillsRequired.length - 4}</span>
              )}
            </div>
          )}

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {job.deadline ? (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Apply by {new Date(job.deadline).toLocaleDateString()}
              </p>
            ) : <span />}
            <span className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
