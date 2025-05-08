const router = require('express').Router();
const { getIncidencias, createIncidencia, updateIncidencia, deleteIncidencia } = require('../controllers/incidenciaGeneralController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getIncidencias);
router.post('/', authenticate, createIncidencia);
router.put('/:id', authenticate, updateIncidencia);
router.delete('/:id', authenticate, authorize(['superAdmin']), deleteIncidencia);

module.exports = router;