const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./db');
const { Op } = require('sequelize');
const { Pelicula, Actor, Genero } = sequelize.models;

const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(cors({ origin: '*' }));

server.get('/', (req, res) => {
  res.status(200).send('Funcionando');
});

server.get('/actor', async (req, res) => {
  const { nombre, apellido } = req.query;
  try {
    if (nombre && apellido) {
      const actor = await Actor.findOne({
        where: {
          nombre: { [Op.iLike]: nombre },
          apellido: { [Op.iLike]: apellido },
        },
        include: { model: Pelicula },
      });
      return actor
        ? res.status(200).send(actor)
        : res.status(400).json('Actor no encontrado');
    }
    if (nombre && !apellido) {
      const actors = await Actor.findAll({
        where: { nombre: { [Op.iLike]: nombre } },
        include: { model: Pelicula },
      });
      return actors.length
        ? res.status(200).send(actors)
        : res.status(400).json('No se encontraron actores con ese nombre');
    }
    if (!nombre && apellido) {
      const actors = await Actor.findAll({
        where: {
          apellido: { [Op.iLike]: apellido },
        },
        include: { model: Pelicula },
      });
      return actors.length
        ? res.status(200).send(actors)
        : res.status(400).json('No se encontraron actores con ese apellido');
    }
    return res.status(200).send(await Actor.findAll());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.post('/actor', async (req, res) => {
  const { nombre, apellido, fechaDeNacimiento } = req.body;
  try {
    await Actor.create({ nombre, apellido, fechaDeNacimiento });
    res
      .status(200)
      .json(
        `Actor ${nombre} ${apellido} añadido correctamente a la base de datos`
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.get('/genero', async (req, res) => {
  const { nombre } = req.query;
  try {
    if (nombre) {
      const genero = await Genero.findOne({
        where: {
          nombre: { [Op.iLike]: nombre },
        },
      });
      return genero
        ? res.status(200).send(genero)
        : res.status(400).json(`Genero ${nombre} no encontrado`);
    }
    const generos = await Genero.findAll();
    return res.status(200).send(generos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

server.post('/genero/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    await Genero.create({ nombre });
    res
      .status(201)
      .json(`Genero ${nombre} agregado a la base de datos correctamente`);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = server;
