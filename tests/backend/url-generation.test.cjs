const test = require('node:test');
const assert = require('node:assert/strict');

const crypto = require('node:crypto');

function generateCode(length = 6) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += alphabet[bytes[index] % alphabet.length];
  }

  return code;
}

test('generates a six-character short code by default', () => {
  const code = generateCode();

  assert.equal(code.length, 6);
  assert.match(code, /^[0-9a-zA-Z]{6}$/);
});

test('supports custom code lengths', () => {
  const code = generateCode(10);

  assert.equal(code.length, 10);
  assert.match(code, /^[0-9a-zA-Z]{10}$/);
});
