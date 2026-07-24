const { neon } = require('@neondatabase/serverless');

const { config } = require('../config');

let sqlClient = null;

function getSqlClient() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required to use Neon Postgres');
  }

  if (!sqlClient) {
    sqlClient = neon(config.databaseUrl);
  }

  return sqlClient;
}

module.exports = { getSqlClient };
