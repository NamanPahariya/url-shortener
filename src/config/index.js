function toNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const config = {
  port: toNumber(process.env.PORT, 3000),
  host: process.env.HOST || '127.0.0.1',
  baseUrl: process.env.BASE_URL || `http://localhost:${toNumber(process.env.PORT, 3000)}`,
};

module.exports = { config };
