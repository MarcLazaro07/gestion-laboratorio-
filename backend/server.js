const app = require('./app');
const { connect } = require('./utils/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 4000;

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
