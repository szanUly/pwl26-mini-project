const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  let status = 500;
  let message = 'Terjadi kesalahan pada server';

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  } else if (err.code === 'P2002') {
    status = 409; message = 'Data sudah ada (nilai unik duplikat)';
  } else if (err.code === 'P2025') {
    status = 404; message = 'Data tidak ditemukan';
  } else if (err.code === 'P2003') {
    status = 409; message = 'Data masih dipakai oleh data lain';
  } else if (err.type === 'entity.parse.failed') {
    status = 400; message = 'Format JSON tidak valid';
  }

  if (status === 500) console.error(err); // detail hanya di log server

  res.status(status).json({ success: false, status, message });
};