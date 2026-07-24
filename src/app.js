const express = require('express');

const { healthRouter } = require('./routes/healthRoutes');
const { urlRouter } = require('./routes/urlRoutes');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', urlRouter);

  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
    });
  });

  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Internal server error',
    });
  });

  return app;
}

module.exports = { createApp };
