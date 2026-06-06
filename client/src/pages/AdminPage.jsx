import { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Shared/Navbar';
import toast from 'react-hot-toast';
import { Shield, Users, Briefcase, FileText, Trash2 } from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
    ])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.users, icon: Users },
    { label: 'Candidates', value: stats?.candidates, icon: Users },
    { label: 'Recruiters', value: stats?.recruiters, icon: Briefcase },
    { label: 'Applications', value: stats?.applications, icon: FileText },
  ];

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 animate-slide-up">
        <h1 className="section-title text-2xl md:text-3xl mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          Admin Panel
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card !p-4 text-center">
              <Icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{loading ? '...' : value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Role</th>
                  <th className="text-left py-3 px-2">Joined</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2 font-medium">{user.name}</td>
                    <td className="py-3 px-2 text-gray-500">{user.email}</td>
                    <td className="py-3 px-2">
                      <span className="badge bg-gray-100 text-gray-700 capitalize">{user.role}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right">
                      {user.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
