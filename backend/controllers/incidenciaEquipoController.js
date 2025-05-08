const IncE = require('../models/IncidenciaEquipo');

// GET /api/incidenciasEquipos
async function getIncidenciasEquipo(req, res, next) {
  try {
    const list = await IncE.find()
      .populate('equipo laboratorio creador asignadoA');
    res.json(list);
  } catch (err) {
    next(err);
  }
}

// POST /api/incidenciasEquipos
async function createIncidenciaEquipo(req, res, next) {
  try {
    const inc = new IncE({ ...req.body, creador: req.user.id });
    await inc.save();
    res.status(201).json(inc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/incidenciasEquipos/:id
async function updateIncidenciaEquipo(req, res, next) {
  try {
    const inc = await IncE.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inc);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/incidenciasEquipos/:id
async function deleteIncidenciaEquipo(req, res, next) {
  try {
    await IncE.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incidencia de equipo eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getIncidenciasEquipo, createIncidenciaEquipo, updateIncidenciaEquipo, deleteIncidenciaEquipo };