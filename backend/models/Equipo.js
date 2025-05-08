const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = new Schema({
  numeroSerie: { type: String, unique: true, required: true },
  marca: String,
  modelo: String,
  laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio', required: true },
  estado: String,
  fechaAdquisicion: Date
});

module.exports = mongoose.model('Equipo', EquipoSchema);