export const sendError = (res, error, fallback = 'Server Error') => {
  console.error(error);

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: error.message || fallback });
};

export default sendError;
