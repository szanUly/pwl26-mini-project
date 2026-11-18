const prisma = require('./prisma');

const findMany = (where, skip, take) =>
  prisma.product.findMany({ where, skip, take, orderBy: { id: 'asc' } });
const count = (where) => prisma.product.count({ where });
const findById = (id) => prisma.product.findUnique({ where: { id } });
const create = (data) => prisma.product.create({ data });
const update = (id, data) => prisma.product.update({ where: { id }, data });
const remove = (id) => prisma.product.delete({ where: { id } });

module.exports = { findMany, count, findById, create, update, remove };