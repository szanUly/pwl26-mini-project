const Joi = require('joi');

const createOrder = Joi.object({
  productId: Joi.number().integer().positive().required(),
  customerName: Joi.string().trim().min(2).max(150).required(),
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = { createOrder };