import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TagInput from '../components/Shared/TagInput';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Upload, Plus, Trash2 } from 'lucide-react';

const STEPS = [
  'Personal Info',
  'Education',
  'Skills',
  'Experience',
  'Achievements',
  'Resume',
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    education: [{ degree: '', college: '', year: '', cgpa: '' }],
    skills: [],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    achievements: [{ title: '', issuer: '', date: '', link: '' }],
    certifications: [{ title: '', issuer: '', date: '', credentialLink: '' }],
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setProfile((prev) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, template) => {
    setProfile((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const saveStep = async () => {
    setLoading(true);
    try {
      if (step === 0 && photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await api.post('/upload/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (step === 5 && resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await api.post('/upload/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const payload = { ...profile };
      if (step === STEPS.length - 1) {
        payload.onboardingComplete = true;
      }

      // Clean empty array items
      ['education', 'experience', 'achievements', 'certifications'].forEach((field) => {
        payload[field] = payload[field].filter((item) =>
          Object.values(item).some((v) => v !== '' && v !== null)
        );
      });

      await api.put('/candidate/profile', payload);
      await refreshUser();

      if (step < STEPS.length - 1) {
        setStep(step + 1);
        toast.success('Progress saved!');
      } else {
        toast.success('Profile setup complete!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 btn-secondary">
                  <Upload className="w-4 h-4" /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files[0])} />
                </label>
                {photoFile && <span className="text-sm text-gray-500">{photoFile.name}</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} className="input-field" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" value={profile.location} onChange={(e) => updateField('location', e.target.value)} className="input-field" placeholder="Mumbai, India" />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education & Qualification</h3>
            {profile.education.map((edu, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Education #{i + 1}</span>
                  {profile.education.length > 1 && (
                    <button onClick={() => removeArrayItem('education', i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                <input value={edu.degree} onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} className="input-field" placeholder="B.Tech in Computer Science" />
                <input value={edu.college} onChange={(e) => updateArrayItem('education', i, 'college', e.target.value)} className="input-field" placeholder="College/University" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={edu.year} onChange={(e) => updateArrayItem('education', i, 'year', e.target.value)} className="input-field" placeholder="Year" />
                  <input type="number" step="0.01" value={edu.cgpa} onChange={(e) => updateArrayItem('education', i, 'cgpa', e.target.value)} className="input-field" placeholder="CGPA" />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('education', { degree: '', college: '', year: '', cgpa: '' })} className="btn-outline flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <p className="text-sm text-gray-500">Add your technical and soft skills (e.g., React, Node.js, Python)</p>
            <TagInput tags={profile.skills} onChange={(skills) => updateField('skills', skills)} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Experience & Internships</h3>
            {profile.experience.map((exp, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Experience #{i + 1}</span>
                  {profile.experience.length > 1 && (
                    <button onClick={() => removeArrayItem('experience', i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                <input value={exp.company} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} className="input-field" placeholder="Company Name" />
                <input value={exp.role} onChange={(e) => updateArrayItem('experience', i, 'role', e.target.value)} className="input-field" placeholder="Role/Position" />
                <input value={exp.duration} onChange={(e) => updateArrayItem('experience', i, 'duration', e.target.value)} className="input-field" placeholder="Jan 2023 - Present" />
                <textarea value={exp.description} onChange={(e) => updateArrayItem('experience', i, 'description', e.target.value)} className="input-field" rows={3} placeholder="Describe your responsibilities..." />
              </div>
            ))}
            <button onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })} className="btn-outline flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              {profile.achievements.map((ach, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3 mb-3">
                  <input value={ach.title} onChange={(e) => updateArrayItem('achievements', i, 'title', e.target.value)} className="input-field" placeholder="Achievement Title" />
                  <input value={ach.issuer} onChange={(e) => updateArrayItem('achievements', i, 'issuer', e.target.value)} className="input-field" placeholder="Issuer" />
                  <input type="date" value={ach.date} onChange={(e) => updateArrayItem('achievements', i, 'date', e.target.value)} className="input-field" />
                  <input value={ach.link} onChange={(e) => updateArrayItem('achievements', i, 'link', e.target.value)} className="input-field" placeholder="Link (optional)" />
                </div>
              ))}
              <button onClick={() => addArrayItem('achievements', { title: '', issuer: '', date: '', link: '' })} className="btn-outline flex items-center gap-1 text-sm">
                <Plus className="w-4 h-4" /> Add Achievement
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Certifications</h3>
              {profile.certifications.map((cert, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3 mb-3">
                  <input value={cert.title} onChange={(e) => updateArrayItem('certifications', i, 'title', e.target.value)} className="input-field" placeholder="Certification Title" />
                  <input value={cert.issuer} onChange={(e) => updateArrayItem('certifications', i, 'issuer', e.target.value)} className="input-field" placeholder="Issuing Organization" />
                  <input type="date" value={cert.date} onChange={(e) => updateArrayItem('certifications', i, 'date', e.target.value)} className="input-field" />
                  <input value={cert.credentialLink} onChange={(e) => updateArrayItem('certifications', i, 'credentialLink', e.target.value)} className="input-field" placeholder="Credential URL" />
                </div>
              ))}
              <button onClick={() => addArrayItem('certifications', { title: '', issuer: '', date: '', credentialLink: '' })} className="btn-outline flex items-center gap-1 text-sm">
                <Plus className="w-4 h-4" /> Add Certification
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload Resume</h3>
            <p className="text-sm text-gray-500">Upload your resume in PDF format. This will be used when you apply to jobs.</p>
            <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-primary-200 dark:border-primary-800 rounded-2xl p-12 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all duration-200 group">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8 text-primary-500" />
              </div>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">Click to upload PDF</span>
              <span className="text-sm text-slate-400 mt-1">Max 5MB</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
            </label>
            {resumeFile && (
              <p className="text-sm text-green-600 text-center">Selected: {resumeFile.name}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-bg py-10 px-4">
      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="section-title text-2xl md:text-3xl mb-2">Complete Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Step <span className="font-semibold text-primary-600">{step + 1}</span> of {STEPS.length} — <span className="font-medium text-slate-700 dark:text-slate-300">{STEPS[step]}</span>
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-3 gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-primary-500 text-white' :
                i === step ? 'bg-gradient-to-br from-primary-500 to-violet-500 text-white shadow-lg shadow-primary-500/30 scale-110' :
                'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1.5 hidden sm:block text-center leading-tight ${i <= step ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-400'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="progress-bar h-2 mb-8">
          <div className="progress-fill transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="card mb-6 shadow-card border-primary-100 dark:border-primary-900/20">{renderStep()}</div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="btn-secondary flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={saveStep} disabled={loading} className="btn-primary flex items-center gap-1">
            {loading ? 'Saving...' : step === STEPS.length - 1 ? 'Finish' : 'Save & Continue'}
            {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
