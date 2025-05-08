const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabSchema = new Schema({
  nombre: { type: String, required: true },
  ubicacion: String,
  cantidadEquipos: Number
});

module.exports = mongoose.model('Laboratorio', LabSchema);