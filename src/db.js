const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');

const sequelize = new Sequelize(
  `postgres://postgres:1234@localhost:3500/registros`,
  {
    logging: false,
  }
);

sequelize.define('RegistroViaje', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  estado: {
    type: DataTypes.ENUM('-', 'salio'),
    allowNull: false,
  },
  coche: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ramal: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  salida: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  llegada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = sequelize;
