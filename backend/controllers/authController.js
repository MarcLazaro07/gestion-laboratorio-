const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const u = await User.findOne({ username });
    if (!u || !(await u.comparePassword(password)))
      return res.status(400).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: u.role });
  } catch (err) { next(err); }
}

async function register(req, res, next) {
  try {
    const { username, password, role } = req.body;
    const u = new User({ username, role });
    await u.setPassword(password);
    await u.save();
    res.status(201).json({ token, role });
  } catch (err) { next(err); }
}

module.exports = { login, register };
