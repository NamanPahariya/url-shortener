const test = require('node:test');
const assert = require('node:assert/strict');

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

test('accepts http and https URLs', () => {
  assert.equal(isValidHttpUrl('https://example.com'), true);
  assert.equal(isValidHttpUrl('http://localhost:3000/path'), true);
});

test('rejects invalid or unsupported URLs', () => {
  assert.equal(isValidHttpUrl('not-a-url'), false);
  assert.equal(isValidHttpUrl('ftp://example.com'), false);
  assert.equal(isValidHttpUrl(''), false);
  assert.equal(isValidHttpUrl(null), false);
});
