function toNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const config = {
  port: toNumber(process.env.PORT, 3000),
  baseUrl: process.env.BASE_URL || `http://localhost:${toNumber(process.env.PORT, 3000)}`,
};

module.exports = { config };
