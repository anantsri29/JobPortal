/**
 * Job Matching Algorithm
 * Scores candidate-job compatibility using weighted keyword matching:
 * - Skills match: 70% weight
 * - Experience level match: 20% weight
 * - Qualification match: 10% weight
 */

const EXPERIENCE_LEVELS = ['fresher', '1-2', '3-5', '5+'];

const getCandidateExperienceLevel = (candidate) => {
  const expCount = candidate.experience?.length || 0;
  if (expCount === 0) return 'fresher';
  if (expCount <= 2) return '1-2';
  if (expCount <= 4) return '3-5';
  return '5+';
};

const normalizeSkill = (skill) => skill.toLowerCase().trim();

const skillsMatch = (candidateSkills, jobSkills) => {
  if (!jobSkills?.length) return 0;

  const normalizedCandidate = (candidateSkills || []).map(normalizeSkill);
  const normalizedJob = jobSkills.map(normalizeSkill);

  // Exact + partial keyword matching (e.g. "react" matches "react.js")
  const matched = normalizedJob.filter((jobSkill) =>
    normalizedCandidate.some(
      (cSkill) => cSkill === jobSkill || cSkill.includes(jobSkill) || jobSkill.includes(cSkill)
    )
  );

  return (matched.length / normalizedJob.length) * 70;
};

const experienceMatch = (candidate, job) => {
  const candidateLevel = getCandidateExperienceLevel(candidate);
  const jobLevel = job.experienceLevel || 'fresher';

  const candidateIdx = EXPERIENCE_LEVELS.indexOf(candidateLevel);
  const jobIdx = EXPERIENCE_LEVELS.indexOf(jobLevel);

  if (candidateIdx === -1 || jobIdx === -1) return 0;

  // Full score if candidate meets or exceeds requirement
  if (candidateIdx >= jobIdx) return 20;

  // Partial score if one level below
  if (candidateIdx === jobIdx - 1) return 10;

  return 0;
};

const qualificationMatch = (candidate, job) => {
  const education = candidate.education || [];
  if (!education.length) return 0;

  const jobText = `${job.title} ${job.description} ${(job.skillsRequired || []).join(' ')}`.toLowerCase();

  const degreeKeywords = {
    btech: ['b.tech', 'btech', 'bachelor of technology', 'engineering'],
    mtech: ['m.tech', 'mtech', 'master of technology'],
    bca: ['bca', 'bachelor of computer'],
    mca: ['mca', 'master of computer'],
    mba: ['mba', 'master of business'],
    bsc: ['b.sc', 'bsc', 'bachelor of science'],
    msc: ['m.sc', 'msc', 'master of science'],
  };

  let score = 0;
  for (const edu of education) {
    const degree = (edu.degree || '').toLowerCase();
    for (const [key, keywords] of Object.entries(degreeKeywords)) {
      if (keywords.some((kw) => degree.includes(kw))) {
        if (jobText.includes(key) || jobText.includes(degree)) {
          score = 10;
          break;
        }
        score = Math.max(score, 5);
      }
    }
  }

  return score;
};

export const matchScore = (candidate, job) => {
  const skillScore = skillsMatch(candidate.skills, job.skillsRequired);
  const expScore = experienceMatch(candidate, job);
  const qualScore = qualificationMatch(candidate, job);

  return Math.round(Math.min(100, skillScore + expScore + qualScore));
};

export const getSuggestedJobs = (candidate, jobs, limit = 10) => {
  return jobs
    .filter((job) => job.isActive)
    .map((job) => ({
      ...job.toObject?.() ?? job,
      matchScore: matchScore(candidate, job),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

export default { matchScore, getSuggestedJobs };
