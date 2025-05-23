const mongoose = require('mongoose');

async function connect() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✔ Conectado a MongoDB');
}

module.exports = { connect };