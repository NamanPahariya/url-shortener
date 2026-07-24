const { config } = require('../config');
const { getSqlClient } = require('../db/neon');

const tableName = 'short_urls';

let testSqlClient = null;

function getSql() {
  return testSqlClient || getSqlClient();
}

async function ensureSchema() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS ${sql.unsafe(tableName)} (
      code TEXT PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function createRecord({ code, originalUrl }) {
  const sql = getSql();
  const shortUrl = `${config.baseUrl.replace(/\/$/, '')}/api/${code}`;

  const [record] = await sql`
    INSERT INTO ${sql.unsafe(tableName)} (code, original_url, short_url)
    VALUES (${code}, ${originalUrl}, ${shortUrl})
    RETURNING
      code,
      original_url AS "originalUrl",
      short_url AS "shortUrl",
      created_at AS "createdAt"
  `;

  return record;
}

async function findByCode(code) {
  const sql = getSql();
  const [record] = await sql`
    SELECT
      code,
      original_url AS "originalUrl",
      short_url AS "shortUrl",
      created_at AS "createdAt"
    FROM ${sql.unsafe(tableName)}
    WHERE code = ${code}
  `;

  return record || null;
}

async function deleteByCode(code) {
  const sql = getSql();
  const [record] = await sql`
    DELETE FROM ${sql.unsafe(tableName)}
    WHERE code = ${code}
    RETURNING
      code,
      original_url AS "originalUrl",
      short_url AS "shortUrl",
      created_at AS "createdAt"
  `;

  return record || null;
}

async function resetStore() {
  if (!testSqlClient) {
    return;
  }

  await testSqlClient`DELETE FROM ${testSqlClient.unsafe(tableName)}`;
}

function __setTestSqlClient(sql) {
  testSqlClient = sql;
}

module.exports = {
  __setTestSqlClient,
  createRecord,
  deleteByCode,
  ensureSchema,
  findByCode,
  resetStore,
};
