const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrestamoSchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Equipo' },
  laboratorioOrigen: { type: Schema.Types.ObjectId, ref: 'Laboratorio' },
  laboratorioDestino: { type: Schema.Types.ObjectId, ref: 'Laboratorio' },
  fechaPrestamo: { type: Date, default: Date.now },
  fechaDevolucionPrevista: Date,
  estado: { type: String, enum: ['prestado','devuelto'], default: 'prestado' },
  usuario: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Prestamo', PrestamoSchema);