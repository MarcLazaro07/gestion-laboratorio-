const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncESchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Equipo' },
  laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio' },
  descripcion: String,
  impacto: { type: String, enum: ['baja','media','alta'] },
  fechaApertura: { type: Date, default: Date.now },
  creador: { type: Schema.Types.ObjectId, ref: 'User' },
  asignadoA: { type: Schema.Types.ObjectId, ref: 'User' },
  estado: { type: String, enum: ['sin empezar','en proceso','bloqueado','finalizado'], default: 'sin empezar' },
  fechaResolucion: Date
});

module.exports = mongoose.model('IncidenciaEquipo', IncESchema);