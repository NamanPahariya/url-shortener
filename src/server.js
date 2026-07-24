require('dotenv').config();

const { createApp } = require('./app');
const { config } = require('./config');
const { ensureSchema } = require('./store/urlStore');

async function startServer() {
  await ensureSchema();

  const app = createApp();

  app.listen(config.port, config.host, () => {
    console.log(`URL shortener API listening on ${config.host}:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
