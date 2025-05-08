const Equipo = require('../models/Equipo');

// GET /api/equipos
async function getAllEquipos(req, res, next) {
  try {
    const filter = req.query.laboratorio ? { laboratorio: req.query.laboratorio } : {};
    const equipos = await Equipo.find(filter).populate('laboratorio');
    res.json(equipos);
  } catch (err) {
    next(err);
  }
}

// POST /api/equipos
async function createEquipo(req, res, next) {
  try {
    const eq = new Equipo(req.body);
    await eq.save();
    res.status(201).json(eq);
  } catch (err) {
    next(err);
  }
}

// PUT /api/equipos/:id
async function updateEquipo(req, res, next) {
  try {
    const eq = await Equipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(eq);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/equipos/:id
async function deleteEquipo(req, res, next) {
  try {
    await Equipo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipo eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllEquipos, createEquipo, updateEquipo, deleteEquipo };