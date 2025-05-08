const router = require('express').Router();
const { getIncidenciasEquipo, createIncidenciaEquipo, updateIncidenciaEquipo, deleteIncidenciaEquipo } = require('../controllers/incidenciaEquipoController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getIncidenciasEquipo);
router.post('/', authenticate, createIncidenciaEquipo);
router.put('/:id', authenticate, updateIncidenciaEquipo);
router.delete('/:id', authenticate, authorize(['superAdmin']), deleteIncidenciaEquipo);

module.exports = router;