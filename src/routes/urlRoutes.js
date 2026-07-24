const express = require('express');

const { shortenUrl, resolveShortCode } = require('../controllers/urlController');

const urlRouter = express.Router();

urlRouter.post('/shorten', shortenUrl);
urlRouter.get('/:code', resolveShortCode);

module.exports = { urlRouter };
