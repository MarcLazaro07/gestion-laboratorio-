const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['superAdmin','docente','tecnico'], required: true },
  active: { type: Boolean, default: true }
});

UserSchema.methods.setPassword = async function(pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 10);
};
UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);