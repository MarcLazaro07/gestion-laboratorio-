const router = require('express').Router();
const { getPrestamos, createPrestamo, updatePrestamo, deletePrestamo } = require('../controllers/prestamoController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getPrestamos);
router.post('/', authenticate, createPrestamo);
router.put('/:id', authenticate, updatePrestamo);
router.delete('/:id', authenticate, authorize(['superAdmin']), deletePrestamo);

module.exports = router;