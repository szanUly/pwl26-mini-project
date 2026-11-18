const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

app.use(logger);
app.use(express.json());

app.use('/products', require('./routes/product.routes'));
app.use('/orders', require('./routes/order.routes'));

app.use((req, res, next) => next(new AppError(404, 'Route tidak ditemukan')));
app.use(errorHandler); // paling akhir

module.exports = app;