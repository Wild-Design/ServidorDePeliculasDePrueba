const server = require('./app.js');
const sequelize = require('./db.js');

const PORT = 9000;

sequelize.sync().then(() =>
  server.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
  })
);
