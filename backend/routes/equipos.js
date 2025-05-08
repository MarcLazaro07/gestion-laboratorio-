const router = require('express').Router();
const { getAllEquipos, createEquipo, updateEquipo, deleteEquipo } = require('../controllers/equipoController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getAllEquipos);
router.post('/', authenticate, authorize(['superAdmin']), createEquipo);
router.put('/:id', authenticate, authorize(['superAdmin']), updateEquipo);
router.delete('/:id', authenticate, authorize(['superAdmin']), deleteEquipo);

module.exports = router;