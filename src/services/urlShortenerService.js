const {
  createRecord,
  deleteByCode,
  findByCode,
} = require('../store/urlStore');
const { generateCode } = require('../utils/generateCode');

async function createShortUrl(originalUrl) {
  let code = generateCode();
  while (await findByCode(code)) {
    code = generateCode();
  }

  const record = await createRecord({
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

async function findOriginalUrlByCode(code) {
  return findByCode(code);
}

async function deleteShortUrlByCode(code) {
  return deleteByCode(code);
}

module.exports = {
  createShortUrl,
  deleteShortUrlByCode,
  findOriginalUrlByCode,
};
