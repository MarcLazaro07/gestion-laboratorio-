const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HorarioSchema = new Schema({
  laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio', required: true, unique: true },
  tabla: { type: [[{ docente: { type: Schema.Types.ObjectId, ref: 'User' } }]], default: [] },
  docentes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Horario', HorarioSchema);