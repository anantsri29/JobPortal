import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const generateUsername = (name, email) => {
  const base = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${base}${Math.floor(Math.random() * 10000)}`;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate',
      username: generateUsername(name, email),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      profileComplete: user.profileComplete,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        profileComplete: user.profileComplete,
        onboardingComplete: user.onboardingComplete,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
