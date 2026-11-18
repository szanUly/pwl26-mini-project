const productService = require('../services/product.service');

exports.list = async (req, res, next) => {
  try {
    const { items, meta } = await productService.list(req.validated.query);
    res.status(200).json({ success: true, data: items, meta });
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await productService.getById(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await productService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await productService.update(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await productService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (e) { next(e); }
};