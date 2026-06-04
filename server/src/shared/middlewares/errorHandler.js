import { ENV } from '../../config/env.js';

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error('Lỗi server:', err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi hệ thống không xác định.',
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined
  });
}
export default errorHandler;
