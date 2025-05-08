const User = require('../models/User');

// GET /api/users
async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id
async function updateUser(req, res, next) {
  try {
    const { username, role, active } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, role, active },
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, updateUser, deleteUser };