const { config } = require('../config');

const urlsByCode = new Map();

function createRecord({ code, originalUrl }) {
  const record = {
    code,
    originalUrl,
    shortUrl: `${config.baseUrl.replace(/\/$/, '')}/api/${code}`,
    createdAt: new Date().toISOString(),
  };

  urlsByCode.set(code, record);
  return record;
}

function findByCode(code) {
  return urlsByCode.get(code) || null;
}

function deleteByCode(code) {
  const record = urlsByCode.get(code) || null;

  if (!record) {
    return null;
  }

  urlsByCode.delete(code);
  return record;
}

module.exports = {
  createRecord,
  deleteByCode,
  findByCode,
};
