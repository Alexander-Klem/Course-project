// const { Sequelize } = require('sequelize');

// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT
//     }
// )

const { Sequelize } = require('sequelize');

// Внутренний URL PostgreSQL на Railway
const urlDB = `postgresql://postgres:LMAHnETRSsDgRANKyKnSOoQAsdqIFRDo@postgres.railway.internal:5432/railway`;

module.exports = new Sequelize(urlDB, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Обязательно для Railway
    }
  },
  logging: false  // Убираем лишние логи
});