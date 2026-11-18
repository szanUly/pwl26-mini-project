# Mini Project REST API: Products & Orders

REST API CRUD berbasis Express.js, MySQL, dan Prisma untuk Mini Project ETS mata kuliah Pemrograman Web Lanjut, Teknik Informatika, Universitas Mataram.

## Identitas

| Keterangan | Isian |
|---|---|
| Nama | Sri Zul'aini Ulya |
| NIM | F1D02410096 |
| Kelas | B |
| Mata Kuliah | Pemrograman Web Lanjut |
| Kasus yang dipilih | Products API |

## Deskripsi Kasus

Proyek ini mengimplementasikan **Products API** untuk mengelola data produk beserta pesanannya. Tabel utama adalah `products`, dan tabel kedua adalah `orders` yang berelasi **satu-ke-banyak** (satu produk dapat memiliki banyak pesanan).

Fitur utama:

- CRUD lengkap untuk `products`, termasuk paginasi dan filter berdasarkan kategori.
- Endpoint `GET /orders` yang menampilkan pesanan beserta data produk terkait (`include`).
- Endpoint `POST /orders` yang membuat pesanan sekaligus mengurangi stok produk di dalam satu transaksi (`prisma.$transaction`), sehingga kedua langkah berhasil bersama atau gagal bersama.
- Middleware `logger`, validasi dengan Joi, dan `errorHandler` terpusat dengan format jawaban error yang seragam.

## Teknologi

| Komponen | Keterangan |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Basis data | MySQL |
| ORM | Prisma 6 |
| Validasi | Joi |
| Konfigurasi | dotenv |
| Pengembangan | nodemon |
| Pengujian | Postman (daftar kasus uji juga tersedia di `requests.http`) |

## Struktur Folder

```
pwl26-mini-project/
├── prisma/
│   ├── migrations/          # riwayat migrasi (di-commit)
│   ├── schema.prisma        # definisi model Product dan Order
│   └── seed.js              # seed data yang dapat diulang
├── screenshot/              # bukti pengujian API dan basis data
├── src/
│   ├── routes/              # definisi URL dan pemasangan middleware
│   ├── controllers/         # menerima request dan mengirim response
│   ├── services/            # logika bisnis (termasuk $transaction)
│   ├── data/                # akses basis data lewat Prisma
│   ├── middleware/          # logger, validate, errorHandler
│   ├── validators/          # skema Joi
│   ├── utils/               # AppError
│   ├── app.js               # perakitan aplikasi Express
│   └── server.js            # titik masuk server
├── .env.example             # contoh konfigurasi (tanpa kredensial asli)
├── .gitignore
├── package.json
├── prisma.config.ts
└── requests.http            # daftar kasus uji
```

Alur sebuah request:

```
route -> validasi -> controller -> service -> data -> database
```

Setiap lapis memiliki tanggung jawab tersendiri. Route menentukan URL dan middleware, controller mengatur request dan response, service memuat aturan bisnis, dan lapis data hanya berisi query Prisma.

## Skema Basis Data

### Tabel `products` (tabel utama)

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, auto increment | Identitas produk |
| name | VARCHAR(150), **UNIQUE** | Nama produk (kolom teks unik) |
| category | VARCHAR(100) | Kategori produk |
| price | INT | Harga (kolom angka) |
| stock | INT | Stok (kolom angka) |
| isActive | BOOLEAN, default `true` | Status aktif |
| createdAt | DATETIME, default `now()` | Waktu dibuat (kolom tanggal) |

### Tabel `orders` (tabel kedua)

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, auto increment | Identitas pesanan |
| productId | INT, FK ke `products.id` | Produk yang dipesan |
| customerName | VARCHAR(150) | Nama pemesan |
| quantity | INT | Jumlah pesanan |
| totalPrice | INT | Harga satuan dikali jumlah |
| orderDate | DATETIME, default `now()` | Waktu pesanan |

### Relasi

`products (1) ---- (N) orders`, yaitu satu produk memiliki banyak pesanan melalui kolom `orders.productId`.

## Cara Menjalankan

Prasyarat: Node.js dan MySQL (misalnya melalui Laragon atau XAMPP) sudah terpasang dan MySQL sedang berjalan.

1. Kloning repository dan masuk ke foldernya.

   ```bash
   git clone https://github.com/ISI_USERNAME_GITHUB/pwl26-mini-project.git
   cd pwl26-mini-project
   ```

2. Pasang dependensi.

   ```bash
   npm install
   ```

3. Salin `.env.example` menjadi `.env`, lalu sesuaikan nilainya.

   ```bash
   copy .env.example .env      # Windows (cmd/PowerShell)
   # cp .env.example .env      # macOS/Linux
   ```

   Isi `.env`:

   ```env
   DATABASE_URL="mysql://root:@localhost:3306/pwl26_mini_project"
   PORT=3000
   ```

   Jika MySQL memakai kata sandi, ubah menjadi `mysql://root:PASSWORD@localhost:3306/pwl26_mini_project`.

4. Jalankan migrasi (database dibuat otomatis jika belum ada).

   ```bash
   npx prisma migrate dev
   ```

5. Isi data awal. Seed dapat dijalankan berulang kali karena mengosongkan tabel terlebih dahulu dan mereset auto increment.

   ```bash
   npx prisma db seed
   ```

6. Jalankan server.

   ```bash
   npm run dev
   ```

   Server berjalan di `http://localhost:3000`.

## Daftar Endpoint

### Products

| Method | URL | Fungsi | Status sukses | Status gagal |
|---|---|---|---|---|
| GET | `/products?page=1&limit=10&category=...` | Daftar produk dengan paginasi dan filter kategori | 200 | 400 |
| GET | `/products/:id` | Detail satu produk | 200 | 400, 404 |
| POST | `/products` | Tambah produk | 201 | 400, 409, 422 |
| PUT | `/products/:id` | Ubah produk | 200 | 400, 404, 409, 422 |
| DELETE | `/products/:id` | Hapus produk | 204 | 400, 404, 409 |

### Orders

| Method | URL | Fungsi | Status sukses | Status gagal |
|---|---|---|---|---|
| GET | `/orders` | Daftar pesanan beserta data produk (`include`) | 200 | - |
| POST | `/orders` | Buat pesanan dan kurangi stok dalam satu transaksi | 201 | 400, 404, 409, 422 |

### Parameter Paginasi dan Filter

| Parameter | Default | Keterangan |
|---|---|---|
| `page` | 1 | Nomor halaman (minimal 1) |
| `limit` | 10 | Jumlah data per halaman (1 sampai 100) |
| `category` | - | Filter produk berdasarkan kategori |

Contoh respons `GET /products`:

```json
{
  "success": true,
  "data": [ { "id": 1, "name": "...", "category": "Aksesoris", "price": 150000, "stock": 50 } ],
  "meta": { "page": 1, "limit": 3, "total": 2, "totalPages": 1 }
}
```

### Contoh Body

`POST /products`

```json
{ "name": "Headset Sri Zulaini", "category": "Aksesoris", "price": 200000, "stock": 20 }
```

`POST /orders`

```json
{ "productId": 2, "customerName": "Sri Zulaini", "quantity": 2 }
```

## Middleware dan Penanganan Error

| Middleware | Fungsi |
|---|---|
| `logger` | Mencatat method, URL, dan status response setelah response selesai dikirim |
| `validate` | Memvalidasi `body`, `params`, atau `query` memakai skema Joi. Body kosong dijawab 400, input yang salah dijawab 422 (body) atau 400 (params dan query) |
| `errorHandler` | Menangani semua error di satu tempat dan dipasang paling akhir setelah semua route |

Format jawaban error seragam:

```json
{ "success": false, "status": 409, "message": "Stok tidak cukup" }
```

Pemetaan error:

| Sumber error | Status | Pesan |
|---|---|---|
| `AppError` buatan sendiri | sesuai nilai yang dilempar | sesuai pesan yang dilempar |
| Prisma `P2002` (nilai unik duplikat) | 409 | Data sudah ada (nilai unik duplikat) |
| Prisma `P2025` (record tidak ditemukan) | 404 | Data tidak ditemukan |
| Prisma `P2003` (masih dipakai data lain) | 409 | Data masih dipakai oleh data lain |
| JSON tidak valid | 400 | Format JSON tidak valid |
| Route tidak terdaftar | 404 | Route tidak ditemukan |
| Error lain | 500 | Terjadi kesalahan pada server |

Untuk error 500, detail asli hanya dicetak di log server dan tidak dikirim ke klien, sehingga tidak membocorkan informasi internal.

## Transaksi pada `POST /orders`

Pembuatan pesanan terdiri dari dua langkah yang dibungkus `prisma.$transaction`:

1. Menyimpan baris baru di tabel `orders`.
2. Mengurangi angka `stock` di tabel `products`.

Aturan bisnis diperiksa di lapis service **di dalam transaksi**: produk harus ada (jika tidak, 404) dan stok harus mencukupi (jika tidak, 409).

Alasan perancangan:

- **Berhasil atau gagal bersama (atomik).** Jika pesanan tersimpan tetapi stok gagal dikurangi, data menjadi tidak konsisten, yaitu ada pesanan yang stoknya tidak pernah berkurang. Transaksi menjamin kedua langkah dibatalkan bersama bila salah satunya gagal.
- **Memakai `tx`, bukan `prisma`.** Di dalam transaksi, seluruh query harus lewat objek `tx` agar berjalan pada koneksi dan transaksi yang sama. Query yang memakai `prisma` berjalan di luar transaksi sehingga tidak ikut dibatalkan (rollback). Karena itu fungsi di lapis data menerima parameter `db` yang diisi `tx`.
- **Efek `throw` di dalam transaksi.** Setiap error yang dilempar di dalam callback transaksi memicu rollback otomatis, sehingga semua perubahan yang sudah dilakukan sebelumnya di transaksi itu dibatalkan.

Kerangka service:

```js
prisma.$transaction(async (tx) => {
  const product = await orderData.findProduct(tx, productId);
  if (!product) throw new AppError(404, 'Produk tidak ditemukan');
  if (product.stock < quantity) throw new AppError(409, 'Stok tidak cukup');

  const order = await orderData.createOrder(tx, { productId, customerName, quantity, totalPrice: product.price * quantity });
  await orderData.decrementStock(tx, productId, quantity);
  return order;
});
```

Percobaan rollback: sebuah `throw new Error('uji rollback')` sengaja ditempatkan setelah `tx.order.create` dan sebelum pengurangan stok. Hasilnya, baris pesanan tidak tersimpan di basis data (lihat screenshot 24).

## Hasil Pengujian

Seluruh pengujian dilakukan dengan Postman. Setiap gambar memperlihatkan request, kode status, respons, dan nama saya (Sri Zulaini) pada data yang diuji. Daftar kasus uji yang sama juga tersedia di berkas `requests.http`.

### 1. Products: Berhasil

**GET /products dengan paginasi dan filter** (`page=1&limit=3&category=Aksesoris`), status 200.

![GET products 200](screenshot/01.png)

**GET /products/:id**, status 200.

![GET product by id 200](screenshot/02.png)

**POST /products**, status 201.

![POST product 201](screenshot/05.png)

**PUT /products/:id**, status 200.

![PUT product 200](screenshot/09.png)

**DELETE /products/:id**, status 204.

![DELETE product 204](screenshot/12.png)

### 2. Products: Gagal

**GET /products/9999** (produk tidak ada), status 404.

![GET product 404](screenshot/03.png)

**GET /products/abc** (ID bukan angka), status 400.

![GET product id invalid 400](screenshot/04.png)

**POST /products dengan nama duplikat**, status 409.

![POST product duplicate 409](screenshot/06.png)

**POST /products dengan data tidak valid** (nama terlalu pendek dan harga negatif), status 422.

![POST product validasi 422](screenshot/07.png)

**POST /products dengan body kosong**, status 400.

![POST product body kosong 400](screenshot/08.png)

**PUT /products/9999** (produk tidak ada), status 404.

![PUT product 404](screenshot/10.png)

**PUT /products/:id dengan nama milik produk lain**, status 409.

![PUT product duplicate 409](screenshot/11.png)

**DELETE /products/9999** (produk tidak ada), status 404.

![DELETE product 404](screenshot/13.png)

### 3. Orders dan Transaksi

**POST /orders berhasil** (pesanan dibuat dan stok berkurang), status 201.

![POST order 201](screenshot/14.png)

**POST /orders dengan stok tidak cukup**, status 409.

![POST order stok 409](screenshot/15.png)

**POST /orders dengan produk yang tidak ada**, status 404.

![POST order produk 404](screenshot/16.png)

**POST /orders dengan quantity 0**, status 422.

![POST order validasi 422](screenshot/17.png)

**GET /orders beserta data produk (`include`)**, status 200.

![GET orders include 200](screenshot/18.png)

### 4. Bukti Basis Data (phpMyAdmin)

**Kondisi awal**: stok produk sebelum pesanan dibuat dan tabel `orders` masih kosong.

![DB sebelum order](screenshot/19.png)

**Setelah pesanan berhasil**: baris baru muncul di `orders` dan stok produk berkurang sesuai jumlah pesanan.

![DB sesudah order berhasil](screenshot/20.png)

**Setelah pesanan gagal (409)**: tabel `products` dan `orders` tidak berubah.

![DB sesudah order gagal](screenshot/21.png)

### 5. Bukti Tambahan

**Migrasi dan seed** berhasil dijalankan.

![Migrate dan seed](screenshot/22.png)

**Struktur tabel** `products` dan `orders` di phpMyAdmin.

![Struktur tabel](screenshot/23.png)

**Percobaan rollback**: `throw new Error` setelah `tx.order.create` tidak meninggalkan baris pesanan di basis data.

![Eksperimen rollback](screenshot/24.png)

## Deklarasi Penggunaan AI

> Catatan untuk diri sendiri: bagian ini dinilai dari kejujuran dan kelengkapan. Sesuaikan isinya dengan hal yang benar-benar saya lakukan, lalu hapus catatan ini.

Saya menggunakan AI (Claude, Anthropic) sebagai alat bantu belajar dalam pengerjaan proyek ini.

**Bagian yang dibantu AI dan untuk apa:**

| Bagian | Bentuk bantuan |
|---|---|
| Perencanaan | Menjelaskan arti soal, memilih rancangan kasus (Products dan Orders), dan menyusun urutan langkah pengerjaan |
| Debugging | Membantu menelusuri kesalahan, yaitu perbedaan perintah `mkdir` di PowerShell, error seed karena berkas belum dibuat, error 500 pada paginasi akibat nilai default `req.query` di Express 5, dan ID produk yang tidak dimulai dari 1 |
| Dokumentasi | Kerangka dan teks README ini |

**Cara saya memeriksa hasilnya:**

- Menjalankan setiap endpoint di Postman dan mencocokkan kode status (200, 201, 204, 400, 404, 409, 422) dengan yang diharapkan.
- Mengecek isi tabel `products` dan `orders` di phpMyAdmin sebelum dan sesudah pesanan, termasuk kasus gagal.
- Membaca ulang setiap berkas kode dan memastikan saya memahami alurnya.
- Melakukan percobaan `throw new Error` di tengah transaksi untuk membuktikan rollback.
- Menulis ulang fungsi transaksi (`POST /orders`) tanpa melihat contoh, seperti yang saya tunjukkan pada video.

**Bagian yang saya kerjakan sendiri:** pemilihan kasus dan nama kolom, pengisian data uji dan identitas pada data, pengujian dan pengambilan screenshot, penyesuaian kode ketika terjadi error, serta penjelasan dan kesimpulan pada video.

## Link Video Presentasi

https://drive.google.com/drive/folders/1mX_w9Qc0yvXB3iIGxeZcgQCU5vTX8YPn?usp=sharing

## Link Repository

https://github.com/szanUly/pwl26-mini-project.git