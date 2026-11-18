const prisma = require('../data/prisma');
const orderData = require('../data/order.data');
const AppError = require('../utils/AppError');

const createOrder = ({ productId, customerName, quantity }) =>
  prisma.$transaction(async (tx) => {
    // 1. Cek aturan bisnis DI DALAM transaksi
    const product = await orderData.findProduct(tx, productId);
    if (!product) throw new AppError(404, 'Produk tidak ditemukan');
    if (product.stock < quantity) throw new AppError(409, 'Stok tidak cukup');

    // 2. Langkah 1: simpan baris di tabel kedua
    const order = await orderData.createOrder(tx, {
      productId,
      customerName,
      quantity,
      totalPrice: product.price * quantity,
    });

    // (tempat percobaan error: throw new Error('uji rollback') di sini)

    // 3. Langkah 2: ubah angka di tabel utama
    await orderData.decrementStock(tx, productId, quantity);

    return order;
  });

const listOrders = () => orderData.findAllWithProduct();

module.exports = { createOrder, listOrders };