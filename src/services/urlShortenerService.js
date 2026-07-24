const { createRecord, findByCode } = require('../store/urlStore');
const { generateCode } = require('../utils/generateCode');

function createShortUrl(originalUrl) {
  let code = generateCode();
  while (findByCode(code)) {
    code = generateCode();
  }

  const record = createRecord({
    code,
    originalUrl,
  });

  return {
    code: record.code,
    originalUrl: record.originalUrl,
    shortUrl: record.shortUrl,
    createdAt: record.createdAt,
  };
}

function findOriginalUrlByCode(code) {
  return findByCode(code);
}

module.exports = {
  createShortUrl,
  findOriginalUrlByCode,
};
