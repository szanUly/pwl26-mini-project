const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  category: Joi.string().trim().max(100).required(),
  price: Joi.number().integer().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  isActive: Joi.boolean(),
});

const updateProduct = createProduct; // PUT = ganti seluruh data

const idParam = Joi.object({ id: Joi.number().integer().positive().required() });

const listQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().trim(),
});

module.exports = { createProduct, updateProduct, idParam, listQuery };