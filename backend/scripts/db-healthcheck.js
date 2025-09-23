const sequelize = require('../config/database');

async function healthCheck() {
  try {
    await sequelize.authenticate();
    console.log('Database health check: OK');
    process.exit(0);
  } catch (error) {
    console.error('Database health check: FAILED', error.message);
    process.exit(1);
  }
}

healthCheck();