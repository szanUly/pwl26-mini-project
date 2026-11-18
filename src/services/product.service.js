const productData = require('../data/product.data');
const AppError = require('../utils/AppError');

const list = async ({ page, limit, category }) => {
  const where = category ? { category } : {};
  const [items, total] = await Promise.all([
    productData.findMany(where, (page - 1) * limit, limit),
    productData.count(where),
  ]);
  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => {
  const product = await productData.findById(id);
  if (!product) throw new AppError(404, 'Produk tidak ditemukan');
  return product;
};

const create = (data) => productData.create(data);
const update = (id, data) => productData.update(id, data); // P2025 -> 404, P2002 -> 409
const remove = (id) => productData.remove(id);

module.exports = { list, getById, create, update, remove };