require('dotenv').config();

const { createApp } = require('./app');
const { config } = require('./config');

const app = createApp();

app.listen(config.port, config.host, () => {
  console.log(`URL shortener API listening on ${config.host}:${config.port}`);
});
