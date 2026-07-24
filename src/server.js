require('dotenv').config();

const { createApp } = require('./app');
const { config } = require('./config');

const app = createApp();

app.listen(config.port, () => {
  console.log(`URL shortener API listening on port ${config.port}`);
});
