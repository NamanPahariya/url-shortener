const express = require('express');

const {
  deleteShortCode,
  shortenUrl,
  resolveShortCode,
} = require('../controllers/urlController');

const urlRouter = express.Router();

urlRouter.post('/shorten', shortenUrl);
urlRouter.get('/:code', resolveShortCode);
urlRouter.delete('/:code', deleteShortCode);

module.exports = { urlRouter };
