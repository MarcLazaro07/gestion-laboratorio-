const Horario = require('../models/Horario');

// GET /api/horarios
async function getHorarios(req, res, next) {
  try {
    const horarios = await Horario.find().populate('laboratorio').populate('docentes');
    res.json(horarios);
  } catch (err) {
    next(err);
  }
}

// GET /api/horarios/:labId
async function getHorarioByLab(req, res, next) {
  try {
    const horario = await Horario.findOne({ laboratorio: req.params.labId })
      .populate('laboratorio')
      .populate('docentes')
      .populate('tabla.docente');
    res.json(horario);
  } catch (err) {
    next(err);
  }
}

// PUT /api/horarios/:id
async function updateHorario(req, res, next) {
  try {
    const { tabla, docentes } = req.body;
    const h = await Horario.findByIdAndUpdate(
      req.params.id,
      { tabla, docentes },
      { new: true }
    );
    res.json(h);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHorarios, getHorarioByLab, updateHorario };