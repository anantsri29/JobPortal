export const calculateProfileCompletion = (user) => {
  const weights = {
    name: 5,
    phone: 5,
    location: 5,
    profilePhoto: 10,
    education: 15,
    skills: 15,
    experience: 15,
    achievements: 10,
    certifications: 10,
    resumeUrl: 10,
  };

  let score = 0;

  if (user.name) score += weights.name;
  if (user.phone) score += weights.phone;
  if (user.location) score += weights.location;
  if (user.profilePhoto) score += weights.profilePhoto;
  if (user.education?.length > 0) score += weights.education;
  if (user.skills?.length > 0) score += weights.skills;
  if (user.experience?.length > 0) score += weights.experience;
  if (user.achievements?.length > 0) score += weights.achievements;
  if (user.certifications?.length > 0) score += weights.certifications;
  if (user.resumeUrl) score += weights.resumeUrl;

  return Math.min(100, score);
};

export default calculateProfileCompletion;
