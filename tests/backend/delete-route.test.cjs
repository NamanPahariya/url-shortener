const test = require('node:test');
const assert = require('node:assert/strict');

const { createShortUrl } = require('../../src/services/urlShortenerService');
const { deleteShortCode } = require('../../src/controllers/urlController');

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

test('deletes a short url by code', () => {
  const created = createShortUrl('https://example.com/delete-me');
  const req = { params: { code: created.code } };
  const res = createMockResponse();

  deleteShortCode(req, res, () => {});

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.code, created.code);
  assert.equal(res.body.originalUrl, created.originalUrl);
  assert.equal(res.body.shortUrl, created.shortUrl);
  assert.equal(res.body.createdAt, created.createdAt);
});

test('returns 404 for an unknown short code', () => {
  const req = { params: { code: 'does-not-exist' } };
  const res = createMockResponse();

  deleteShortCode(req, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.error, 'Short code not found');
});
