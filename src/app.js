const express = require('express');

const { healthRouter } = require('./routes/healthRoutes');
const { urlRouter } = require('./routes/urlRoutes');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigin = origin === 'http://127.0.0.1:5173' || origin === 'http://localhost:5173'
      ? origin
      : null;

    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  });

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
