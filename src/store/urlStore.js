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

module.exports = {
  createRecord,
  findByCode,
};
