const Prestamo = require('../models/Prestamo');

// GET /api/prestamos
async function getPrestamos(req, res, next) {
  try {
    const list = await Prestamo.find()
      .populate('equipo laboratorioOrigen laboratorioDestino usuario');
    res.json(list);
  } catch (err) {
    next(err);
  }
}

// POST /api/prestamos
async function createPrestamo(req, res, next) {
  try {
    const p = new Prestamo({ ...req.body, usuario: req.user.id });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
}

// PUT /api/prestamos/:id
async function updatePrestamo(req, res, next) {
  try {
    const p = await Prestamo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/prestamos/:id
async function deletePrestamo(req, res, next) {
  try {
    await Prestamo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Préstamo eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPrestamos, createPrestamo, updatePrestamo, deletePrestamo };