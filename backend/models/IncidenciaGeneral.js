const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncGSchema = new Schema({
  descripcion: String,
  fechaCreacion: { type: Date, default: Date.now },
  creador: { type: Schema.Types.ObjectId, ref: 'User' },
  docente: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('IncidenciaGeneral', IncGSchema);