const router = require('express').Router();
const { getHorarios, getHorarioByLab, updateHorario } = require('../controllers/horarioController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getHorarios);
router.get('/:labId', authenticate, getHorarioByLab);
router.put('/:id', authenticate, authorize(['superAdmin']), updateHorario);

module.exports = router;