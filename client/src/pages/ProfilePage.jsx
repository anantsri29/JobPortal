import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Shared/Navbar';
import TagInput from '../components/Shared/TagInput';
import { SkeletonProfile } from '../components/Shared/Skeleton';
import toast from 'react-hot-toast';
import {
  User, MapPin, Phone, GraduationCap, Briefcase, Award,
  FileText, Edit2, Save, X, Plus, Trash2, Upload, ExternalLink,
} from 'lucide-react';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    api.get(`/candidate/profile/${username}`)
      .then(({ data }) => setProfile(data))
      .catch(() => toast.error('Profile not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const startEdit = (section, data) => {
    setEditing(section);
    setEditData(data);
  };

  const saveEdit = async () => {
    try {
      await api.put('/candidate/profile', editData);
      await refreshUser();
      const { data } = await api.get(`/candidate/profile/${username}`);
      setProfile(data);
      setEditing(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await api.post('/upload/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const { data } = await api.get(`/candidate/profile/${username}`);
      setProfile(data);
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="page-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8"><SkeletonProfile /></div>
      </div>
    );
  }

  if (!profile) return null;

  const SectionHeader = ({ title, icon: Icon, section, data }) => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary-600" />{title}
      </h2>
      {isOwner && editing !== section && (
        <button onClick={() => startEdit(section, data)} className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm">
          <Edit2 className="w-4 h-4" /> Edit
        </button>
      )}
      {isOwner && editing === section && (
        <div className="flex gap-2">
          <button onClick={saveEdit} className="text-green-600 flex items-center gap-1 text-sm"><Save className="w-4 h-4" /> Save</button>
          <button onClick={() => setEditing(null)} className="text-red-500 flex items-center gap-1 text-sm"><X className="w-4 h-4" /> Cancel</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 animate-slide-up">
        {/* Header */}
        <div className="card mb-6 shadow-card border-primary-100 dark:border-primary-900/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-500" />
          <div className="flex items-center gap-6 pt-2">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/40 dark:to-violet-900/40 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-lg">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.location && <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{profile.location}</p>}
              {profile.phone && <p className="text-gray-500 flex items-center gap-1"><Phone className="w-4 h-4" />{profile.phone}</p>}
              <div className="mt-2">
                <span className="text-sm text-primary-600 font-medium">{profile.profileComplete}% Profile Complete</span>
                <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${profile.profileComplete}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card mb-6">
          <SectionHeader title="Skills" icon={Award} section="skills" data={{ skills: profile.skills }} />
          {editing === 'skills' ? (
            <TagInput tags={editData.skills || []} onChange={(skills) => setEditData({ skills })} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? profile.skills.map((s) => (
                <span key={s} className="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">{s}</span>
              )) : <p className="text-gray-500 text-sm">No skills added</p>}
            </div>
          )}
        </div>

        {/* Education */}
        <div className="card mb-6">
          <SectionHeader title="Education" icon={GraduationCap} section="education" data={{ education: profile.education }} />
          {editing === 'education' ? (
            <div className="space-y-3">
              {(editData.education || []).map((edu, i) => (
                <div key={i} className="p-3 border rounded-lg space-y-2">
                  <input value={edu.degree} onChange={(e) => { const arr = [...editData.education]; arr[i].degree = e.target.value; setEditData({ education: arr }); }} className="input-field" placeholder="Degree" />
                  <input value={edu.college} onChange={(e) => { const arr = [...editData.education]; arr[i].college = e.target.value; setEditData({ education: arr }); }} className="input-field" placeholder="College" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={edu.year} onChange={(e) => { const arr = [...editData.education]; arr[i].year = e.target.value; setEditData({ education: arr }); }} className="input-field" placeholder="Year" />
                    <input type="number" value={edu.cgpa} onChange={(e) => { const arr = [...editData.education]; arr[i].cgpa = e.target.value; setEditData({ education: arr }); }} className="input-field" placeholder="CGPA" />
                  </div>
                </div>
              ))}
              <button onClick={() => setEditData({ education: [...(editData.education || []), { degree: '', college: '', year: '', cgpa: '' }] })} className="btn-outline text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
            </div>
          ) : (
            profile.education?.length > 0 ? profile.education.map((edu, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.college} • {edu.year} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
              </div>
            )) : <p className="text-gray-500 text-sm">No education added</p>
          )}
        </div>

        {/* Experience */}
        <div className="card mb-6">
          <SectionHeader title="Experience" icon={Briefcase} section="experience" data={{ experience: profile.experience }} />
          {profile.experience?.length > 0 ? profile.experience.map((exp, i) => (
            <div key={i} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-gray-200 dark:border-gray-700">
              <p className="font-medium">{exp.role}</p>
              <p className="text-primary-600 text-sm">{exp.company} • {exp.duration}</p>
              {exp.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>}
            </div>
          )) : <p className="text-gray-500 text-sm">No experience added</p>}
        </div>

        {/* Certifications */}
        <div className="card mb-6">
          <SectionHeader title="Certifications" icon={Award} section="certifications" data={{ certifications: profile.certifications }} />
          {profile.certifications?.length > 0 ? profile.certifications.map((cert, i) => (
            <div key={i} className="mb-3 last:mb-0 flex justify-between items-start">
              <div>
                <p className="font-medium">{cert.title}</p>
                <p className="text-sm text-gray-500">{cert.issuer} {cert.date && `• ${new Date(cert.date).toLocaleDateString()}`}</p>
              </div>
              {cert.credentialLink && (
                <a href={cert.credentialLink} target="_blank" rel="noopener noreferrer" className="text-primary-600"><ExternalLink className="w-4 h-4" /></a>
              )}
            </div>
          )) : <p className="text-gray-500 text-sm">No certifications added</p>}
        </div>

        {/* Resume */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" /> Resume</h2>
            {isOwner && (
              <label className="btn-outline text-sm cursor-pointer flex items-center gap-1">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
              </label>
            )}
          </div>
          {profile.resumeUrl ? (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center gap-2">
              <FileText className="w-5 h-5" /> View Resume <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <p className="text-gray-500 text-sm">No resume uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
