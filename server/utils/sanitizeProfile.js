const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

const toDate = (value) => {
  if (!value || value === '') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const cleanObject = (obj, fields) => {
  const cleaned = {};
  fields.forEach((field) => {
    if (obj[field] !== undefined && obj[field] !== '' && obj[field] !== null) {
      cleaned[field] = obj[field];
    }
  });
  return cleaned;
};

export const sanitizeProfilePayload = (body) => {
  const sanitized = { ...body };

  if (Array.isArray(body.education)) {
    sanitized.education = body.education
      .map((edu) => cleanObject(
        { ...edu, year: toNumber(edu.year), cgpa: toNumber(edu.cgpa) },
        ['degree', 'college', 'year', 'cgpa']
      ))
      .filter((edu) => Object.keys(edu).length > 0);
  }

  if (Array.isArray(body.experience)) {
    sanitized.experience = body.experience
      .map((exp) => cleanObject(exp, ['company', 'role', 'duration', 'description']))
      .filter((exp) => Object.keys(exp).length > 0);
  }

  if (Array.isArray(body.achievements)) {
    sanitized.achievements = body.achievements
      .map((ach) => cleanObject(
        { ...ach, date: toDate(ach.date) },
        ['title', 'issuer', 'date', 'link']
      ))
      .filter((ach) => Object.keys(ach).length > 0);
  }

  if (Array.isArray(body.certifications)) {
    sanitized.certifications = body.certifications
      .map((cert) => cleanObject(
        { ...cert, date: toDate(cert.date) },
        ['title', 'issuer', 'date', 'credentialLink']
      ))
      .filter((cert) => Object.keys(cert).length > 0);
  }

  if (Array.isArray(body.skills)) {
    sanitized.skills = body.skills.map((s) => s.trim()).filter(Boolean);
  }

  return sanitized;
};

export default sanitizeProfilePayload;
