const AppError = require('../utils/AppError');

// source: 'body' | 'params' | 'query'
module.exports = (schema, source = 'body') => (req, res, next) => {
  if (source === 'body' && (!req.body || Object.keys(req.body).length === 0)) {
    return next(new AppError(400, 'Body tidak boleh kosong'));
  }
  const { error, value } = schema.validate(req[source], { abortEarly: false });
  if (error) {
    const detail = error.details.map((d) => d.message).join('; ');
    return next(new AppError(source === 'body' ? 422 : 400, detail));
  }
  req.validated = req.validated || {};
  req.validated[source] = value;
  if (source === 'body') req.body = value;
  next();
};