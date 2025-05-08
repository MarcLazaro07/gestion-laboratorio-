const IncG = require('../models/IncidenciaGeneral');

// GET /api/incidenciasGenerales
async function getIncidencias(req, res, next) {
  try {
    const list = await IncG.find()
      .populate('creador docente');
    res.json(list);
  } catch (err) {
    next(err);
  }
}

// POST /api/incidenciasGenerales
async function createIncidencia(req, res, next) {
  try {
    const inc = new IncG({ ...req.body, creador: req.user.id });
    await inc.save();
    res.status(201).json(inc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/incidenciasGenerales/:id
async function updateIncidencia(req, res, next) {
  try {
    const inc = await IncG.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inc);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/incidenciasGenerales/:id
async function deleteIncidencia(req, res, next) {
  try {
    await IncG.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incidencia general eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getIncidencias, createIncidencia, updateIncidencia, deleteIncidencia };