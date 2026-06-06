import dotenv from 'dotenv';
dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;

const loginRes = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'candidate@demo.com', password: 'demo123' }),
});
const { token } = await loginRes.json();
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

// Payload that previously caused CastError (empty strings for numbers/dates)
const profilePayload = {
  phone: '+91 9999999999',
  location: 'Delhi, India',
  education: [{ degree: 'B.Tech', college: 'DTU', year: '', cgpa: '' }],
  skills: ['React', 'Node.js'],
  experience: [{ company: 'ABC', role: 'Dev', duration: '2023', description: 'Built apps' }],
  achievements: [{ title: 'Hackathon', issuer: 'XYZ', date: '', link: '' }],
  certifications: [{ title: 'AWS', issuer: 'Amazon', date: '', credentialLink: '' }],
};

const profileRes = await fetch(`${BASE}/candidate/profile`, {
  method: 'PUT',
  headers,
  body: JSON.stringify(profilePayload),
});
const profileData = await profileRes.json();
console.log('Profile update:', profileRes.status, profileRes.ok ? 'OK' : profileData.message);

const dashRes = await fetch(`${BASE}/candidate/dashboard`, { headers });
const dashData = await dashRes.json();
console.log('Dashboard:', dashRes.status, dashRes.ok ? 'OK' : dashData.message);
