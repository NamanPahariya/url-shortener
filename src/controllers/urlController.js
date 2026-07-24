const {
  createShortUrl,
  deleteShortUrlByCode,
  findOriginalUrlByCode,
} = require('../services/urlShortenerService');
const { isValidHttpUrl } = require('../utils/isValidHttpUrl');

function shortenUrl(req, res, next) {
  try {
    const { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'url is required and must be a string',
      });
    }

    if (!isValidHttpUrl(url)) {
      return res.status(400).json({
        error: 'url must be a valid http or https URL',
      });
    }

    const shortUrl = createShortUrl(url);

    return res.status(201).json(shortUrl);
  } catch (error) {
    return next(error);
  }
}

function resolveShortCode(req, res, next) {
  try {
    const { code } = req.params;
    const record = findOriginalUrlByCode(code);

    if (!record) {
      return res.status(404).json({
        error: 'Short code not found',
      });
    }

    return res.redirect(302, record.originalUrl);
  } catch (error) {
    return next(error);
  }
}

function deleteShortCode(req, res, next) {
  try {
    const { code } = req.params;
    const record = deleteShortUrlByCode(code);

    if (!record) {
      return res.status(404).json({
        error: 'Short code not found',
      });
    }

    return res.status(200).json({
      code: record.code,
      originalUrl: record.originalUrl,
      shortUrl: record.shortUrl,
      createdAt: record.createdAt,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  deleteShortCode,
  shortenUrl,
  resolveShortCode,
};
