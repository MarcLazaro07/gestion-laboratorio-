const router = require('express').Router();
const { getAllLabs, createLab, updateLab, deleteLab } = require('../controllers/laboratorioController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', authenticate, getAllLabs);
router.post('/', authenticate, authorize(['superAdmin']), createLab);
router.put('/:id', authenticate, authorize(['superAdmin']), updateLab);
router.delete('/:id', authenticate, authorize(['superAdmin']), deleteLab);

module.exports = router;