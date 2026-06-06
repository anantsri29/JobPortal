import { useEffect, useState } from 'react';
import api from '../utils/api';
import useDebounce from '../hooks/useDebounce';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';
import JobCard from '../components/Shared/JobCard';
import { SkeletonJobCard } from '../components/Shared/Skeleton';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { ...filters, search: debouncedSearch };
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });
        const { data } = await api.get('/jobs', { params });
        setJobs(data.jobs);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [debouncedSearch, filters.location, filters.jobType, filters.experienceLevel, filters.salaryMin, filters.salaryMax, filters.page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const FilterSidebar = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="input-field"
          placeholder="e.g. Mumbai"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Job Type</label>
        <select value={filters.jobType} onChange={(e) => updateFilter('jobType', e.target.value)} className="input-field">
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <select value={filters.experienceLevel} onChange={(e) => updateFilter('experienceLevel', e.target.value)} className="input-field">
          <option value="">All Levels</option>
          <option value="fresher">Fresher</option>
          <option value="1-2">1-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Min Salary (₹)</label>
        <input type="number" value={filters.salaryMin} onChange={(e) => updateFilter('salaryMin', e.target.value)} className="input-field" placeholder="300000" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max Salary (₹)</label>
        <input type="number" value={filters.salaryMax} onChange={(e) => updateFilter('salaryMax', e.target.value)} className="input-field" placeholder="1500000" />
      </div>
      <button
        onClick={() => setFilters({ search: '', location: '', jobType: '', experienceLevel: '', salaryMin: '', salaryMax: '', page: 1 })}
        className="btn-secondary w-full text-sm"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-8 animate-slide-up">
          <h1 className="section-title text-2xl md:text-3xl mb-2">Browse <span className="gradient-text">Jobs</span></h1>
          <p className="section-subtitle">Discover opportunities that match your skills and ambitions</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input-field pl-12 !py-3.5 shadow-card"
              placeholder="Search by title, company, or skills..."
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 lg:hidden">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card sticky top-24 shadow-card">
              <h3 className="font-display font-semibold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Filter className="w-4 h-4 text-primary-600" />
                </div>
                Filters
              </h3>
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
                <h3 className="font-semibold mb-4">Filters</h3>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Job listings */}
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-5 font-medium">
              <span className="text-primary-600 dark:text-primary-400 font-bold">{pagination.total}</span> jobs found
            </p>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => <SkeletonJobCard key={i} />)}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => updateFilter('page', filters.page - 1)}
                      disabled={filters.page <= 1}
                      className="btn-secondary flex items-center gap-1 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</span>
                    <button
                      onClick={() => updateFilter('page', filters.page + 1)}
                      disabled={filters.page >= pagination.pages}
                      className="btn-secondary flex items-center gap-1 disabled:opacity-50"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12 text-gray-500">No jobs found matching your criteria</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobsPage;
