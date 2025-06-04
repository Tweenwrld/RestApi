const { apiKey } = require('../config/config');
const ValidationError = require('../errors/ValidationError');
const authMiddleware = (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];
  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    throw new ValidationError('Invalid or missing API key');
  }
  next();
};
module.exports = authMiddleware;