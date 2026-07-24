const express = require('express');

const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

module.exports = { healthRouter };
