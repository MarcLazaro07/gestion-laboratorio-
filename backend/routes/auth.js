const { Router } = require('express');
const { login, register } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const User = require('../models/User');

const checkFirstUser = async (req, res, next) => {
  const count = await User.countDocuments();
  if (count === 0) return next(); // Si no hay usuarios, permite crear el primero
  return authenticate(req, res, () => authorize(['superAdmin'])(req, res, next));
};

const router = Router();
router.post('/login', login);
router.post('/register', checkFirstUser, register);

module.exports = router;