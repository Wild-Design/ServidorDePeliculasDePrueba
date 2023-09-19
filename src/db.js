const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');

const sequelize = new Sequelize(
  `postgres://postgres:1234@localhost:3500/peliculas`,
  {
    logging: false,
  }
);

sequelize.define('Pelicula', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  titulo_de_la_pelicula: {
    type: DataTypes.STRING,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
});

sequelize.define('Genero', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  nombre: {
    type: DataTypes.STRING,
    unique: true,
  },
});

sequelize.define(
  'Actor',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Fecha_de_nacimiento: {
      type: DataTypes.DATE,
    },
  },
  {
    uniqueKeys: {
      unique_actor: {
        fields: ['nombre', 'apellido'],
      },
    },
  }
);

const { Pelicula, Genero, Actor } = sequelize.models;

Pelicula.belongsToMany(Actor, { through: 'Casting' });
Actor.belongsToMany(Pelicula, { through: 'Casting' });

Pelicula.belongsToMany(Genero, { through: 'PeliculaGenero' });
Genero.belongsToMany(Pelicula, { through: 'PeliculaGenero' });

module.exports = sequelize;
