const Laboratorio = require('../models/Laboratorio');
const Horario = require('../models/Horario');

// GET /api/laboratorios
async function getAllLabs(req, res, next) {
  try {
    const labs = await Laboratorio.find();
    res.json(labs);
  } catch (err) {
    next(err);
  }
}

// POST /api/laboratorios
async function createLab(req, res, next) {
  try {
    const lab = new Laboratorio(req.body);
    await lab.save();
    // Crear horario inicial vacío
    const horario = new Horario({
      laboratorio: lab._id,
      tabla: Array(5).fill(Array(8).fill({ docente: null })),
      docentes: []
    });
    await horario.save();
    res.status(201).json(lab);
  } catch (err) {
    next(err);
  }
}

// PUT /api/laboratorios/:id
async function updateLab(req, res, next) {
  try {
    const lab = await Laboratorio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lab);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/laboratorios/:id
async function deleteLab(req, res, next) {
  try {
    await Laboratorio.findByIdAndDelete(req.params.id);
    // Eliminar horario en cascada
    await Horario.findOneAndDelete({ laboratorio: req.params.id });
    res.json({ message: 'Laboratorio y horario eliminados' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllLabs, createLab, updateLab, deleteLab };