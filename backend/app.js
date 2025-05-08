const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/laboratorios', require('./routes/laboratorios'));
app.use('/api/equipos', require('./routes/equipos'));
app.use('/api/horarios', require('./routes/horarios'));
app.use('/api/incidenciasGenerales', require('./routes/incidenciasGenerales'));
app.use('/api/incidenciasEquipos', require('./routes/incidenciasEquipos'));
app.use('/api/prestamos', require('./routes/prestamos'));

const path = require('path');

// Servir frontend desde backend
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

module.exports = app;