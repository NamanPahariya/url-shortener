const crypto = require('node:crypto');

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_LENGTH = 6;

function generateCode(length = DEFAULT_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += ALPHABET[bytes[index] % ALPHABET.length];
  }

  return code;
}

module.exports = { generateCode };
