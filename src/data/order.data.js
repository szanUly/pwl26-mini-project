const prisma = require('./prisma');

const findProduct = (db, id) => db.product.findUnique({ where: { id } });

const createOrder = (db, data) => db.order.create({ data });

const decrementStock = (db, productId, qty) =>
  db.product.update({
    where: { id: productId },
    data: { stock: { decrement: qty } },
  });

const findAllWithProduct = () =>
  prisma.order.findMany({ include: { product: true }, orderBy: { id: 'desc' } });

module.exports = { findProduct, createOrder, decrementStock, findAllWithProduct };