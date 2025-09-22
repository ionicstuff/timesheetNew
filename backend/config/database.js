// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Load local .env only for dev; never override ECS env
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: false });

// Prefer DB_* but fall back to PG* (what pg reads natively)
const host     = process.env.DB_HOST     || process.env.PGHOST;
const port     = Number(process.env.DB_PORT || process.env.PGPORT || 5432);
const database = process.env.DB_NAME     || process.env.PGDATABASE || 'postgres';
const user     = process.env.DB_USER     || process.env.PGUSER;
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

// RDS usually requires TLS; keep simple “accept-any-CA” for now
const dialectOptions = { ssl: { require: true, rejectUnauthorized: false } };

// Helpful one-line log (no secrets)
console.log(`[DB] host=${host} port=${port} db=${database} user=${user}`);

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  dialectOptions,
  logging: (process.env.NODE_ENV || 'development') === 'development' ? console.log : false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

module.exports = sequelize;
