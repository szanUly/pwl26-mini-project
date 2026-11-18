const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.$executeRawUnsafe('ALTER TABLE orders AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE products AUTO_INCREMENT = 1');

  await prisma.product.createMany({
    data: [
      { name: 'Laptop Asus Vivobook - Sri Zulaini Ulya - F1D02410096', category: 'Elektronik', price: 8500000, stock: 10 },
      { name: 'Mouse Logitech M170 - Sri Zulaini Ulya - F1D02410096', category: 'Aksesoris', price: 150000, stock: 50 },
      { name: 'Keyboard Mechanical - Sri Zulaini Ulya - F1D02410096', category: 'Aksesoris', price: 450000, stock: 25 },
      { name: 'Monitor LG 24 inci - Sri Zulaini Ulya - F1D02410096', category: 'Elektronik', price: 1800000, stock: 8 },
      { name: 'Flashdisk 64GB - Sri Zulaini Ulya - F1D02410096', category: 'Penyimpanan', price: 90000, stock: 100 },
    ],
  });
  console.log('Seed selesai');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());