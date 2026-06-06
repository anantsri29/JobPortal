/**
 * Quick smoke test — run: node test-api.js
 */
import dotenv from 'dotenv';
dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;

const tests = [
  { name: 'Health', url: `${BASE}/health` },
  { name: 'Jobs list', url: `${BASE}/jobs` },
  { name: 'Login', url: `${BASE}/auth/login`, method: 'POST', body: { email: 'candidate@demo.com', password: 'demo123' } },
];

for (const t of tests) {
  try {
    const opts = { method: t.method || 'GET', headers: { 'Content-Type': 'application/json' } };
    if (t.body) opts.body = JSON.stringify(t.body);
    const res = await fetch(t.url, opts);
    const data = await res.json().catch(() => ({}));
    console.log(`${t.name}: ${res.status}`, res.ok ? 'OK' : data.message || JSON.stringify(data));
  } catch (e) {
    console.log(`${t.name}: FAILED — ${e.message}`);
  }
}
