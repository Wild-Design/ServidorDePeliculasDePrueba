const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./db');
const { RegistroViaje } = sequelize.models;
const { createServer } = require('node:http');
const { Server: SocketServer } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new SocketServer(server, {
  cors: { origin: 'http://127.0.0.1:5500' },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    //Con esto escucho el mensage que biene del cliente
    console.log(data);

    //Y con eso envio el mismo mensaje a los clientes que sean diferentes a el mismo
    socket.broadcast.emit('message', data);
  });
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));

app.get('/', async (req, res) => {
  try {
    const traerTodosLosViajes = await RegistroViaje.findAll();
    res.status(200).send(traerTodosLosViajes);
  } catch (error) {
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

app.post('/', async (req, res) => {
  const { estado, coche, ramal, salida, llegada } = req.body;
  try {
    if (!estado || !coche || !ramal || !salida || !llegada)
      return res
        .status(404)
        .send(
          'Las propiedades: "estado, coche, ramal, salida, llegada" son obligatorias.'
        );
    const CREATE = await RegistroViaje.create(req.body);
    return res.status(200).send(CREATE);
  } catch (error) {
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

module.exports = server;
