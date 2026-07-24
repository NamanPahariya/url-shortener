const test = require('node:test');
const assert = require('node:assert/strict');

const { createShortUrl } = require('../../src/services/urlShortenerService');
const { deleteShortCode } = require('../../src/controllers/urlController');
const { __setTestSqlClient, resetStore } = require('../../src/store/urlStore');

const records = new Map();

function createMockSql() {
  function sql(strings, ...values) {
    const query = String(strings[0]).trim().toUpperCase();

    if (query.startsWith('INSERT INTO')) {
      const [code, originalUrl, shortUrl] = values;
      const record = {
        code,
        originalUrl,
        shortUrl,
        createdAt: new Date().toISOString(),
      };
      records.set(code, record);
      return Promise.resolve([record]);
    }

    if (query.startsWith('SELECT')) {
      const [code] = values;
      const record = records.get(code);
      return Promise.resolve(record ? [record] : []);
    }

    if (query.startsWith('DELETE')) {
      const [code] = values;
      const record = records.get(code) || null;
      records.delete(code);
      return Promise.resolve(record ? [record] : []);
    }

    if (query.startsWith('CREATE TABLE')) {
      return Promise.resolve([]);
    }

    return Promise.resolve([]);
  }

  sql.unsafe = (value) => value;
  return sql;
}

__setTestSqlClient(createMockSql());

test.afterEach(async () => {
  records.clear();
  await resetStore();
});

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('deletes a short url by code', async () => {
  const created = await createShortUrl('https://example.com/delete-me');
  const req = { params: { code: created.code } };
  const res = createMockResponse();

  await deleteShortCode(req, res, () => {});

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.code, created.code);
  assert.equal(res.body.originalUrl, created.originalUrl);
  assert.equal(res.body.shortUrl, created.shortUrl);
  assert.equal(res.body.createdAt, created.createdAt);
});

test('returns 404 for an unknown short code', async () => {
  const req = { params: { code: 'does-not-exist' } };
  const res = createMockResponse();

  await deleteShortCode(req, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.error, 'Short code not found');
});
