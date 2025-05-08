const router = require('express').Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, authorize(['superAdmin']), getUsers);
router.put('/:id', authenticate, authorize(['superAdmin']), updateUser);
router.delete('/:id', authenticate, authorize(['superAdmin']), deleteUser);

module.exports = router;