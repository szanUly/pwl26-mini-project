const orderService = require('../services/order.service');

exports.create = async (req, res, next) => {
  try {
    const data = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    const data = await orderService.listOrders();
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
};